/* eslint-disable @typescript-eslint/no-require-imports */
const http = require("node:http");
const path = require("node:path");
require("dotenv").config({ path: path.join(__dirname, "../.env.local") });
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const { rateLimit } = require("express-rate-limit");
const { Server } = require("socket.io");
const venues = require(path.join(__dirname, "../src/data/venues.json"));

const app = express();
const server = http.createServer(app);
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim());
const io = new Server(server, {
  cors: { origin: allowedOrigins, methods: ["GET", "POST"] },
});
const PORT = Number(process.env.PORT || 4000);
const venueIds = new Set(venues.map((venue) => venue.id));

app.use(helmet());
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "20kb" }));
app.use("/api", rateLimit({ windowMs: 60_000, limit: 100 }));

const reportSchema = new mongoose.Schema(
  {
    venueId: { type: String, required: true },
    author: { type: String, required: true, maxlength: 40 },
    crowd: { type: String, enum: ["Low", "Moderate", "High"], required: true },
    noise: { type: String, enum: ["Quiet", "Moderate", "Noisy"], required: true },
    seating: { type: String, required: true, maxlength: 32 },
    wifi: { type: String, required: true, maxlength: 32 },
    outlets: { type: String, required: true, maxlength: 32 },
    note: { type: String, maxlength: 500, default: "" },
  },
  { timestamps: true }
);
reportSchema.index({ venueId: 1, createdAt: -1 });

const messageSchema = new mongoose.Schema(
  {
    venueId: { type: String, required: true },
    author: { type: String, required: true, maxlength: 40 },
    text: { type: String, required: true, maxlength: 500 },
  },
  { timestamps: true }
);
messageSchema.index({ venueId: 1, createdAt: -1 });

const savedPlaceSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    venueId: { type: String, required: true },
  },
  { timestamps: true }
);
savedPlaceSchema.index({ userId: 1, venueId: 1 }, { unique: true });

const Report = mongoose.model("CommunityReport", reportSchema);
const ChatMessage = mongoose.model("ChatMessage", messageSchema);
const SavedPlace = mongoose.model("SavedPlace", savedPlaceSchema);

function validVenue(venueId, res) {
  if (!venueIds.has(venueId)) {
    res.status(404).json({ error: "Venue not found." });
    return false;
  }
  return true;
}

function safeMessage(message) {
  return {
    id: message._id.toString(),
    venueId: message.venueId,
    author: message.author,
    role: "Demo user",
    text: message.text,
    createdAt: message.createdAt,
    time: new Date(message.createdAt).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.get("/api/reports", async (_req, res, next) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 }).limit(100).lean();
    const venueById = new Map(venues.map((venue) => [venue.id, venue]));
    res.json({ reports: reports.map((report) => ({
      ...report,
      id: report._id.toString(),
      venueName: venueById.get(report.venueId)?.name || "Workspace",
      venueCategory: venueById.get(report.venueId)?.categoryLabel || "Workspace",
      neighborhood: venueById.get(report.venueId)?.neighborhood || "",
      timestamp: new Date(report.createdAt).toLocaleString(),
      status: "Community reported",
    })) });
  } catch (error) {
    next(error);
  }
});

app.get("/api/venues/:venueId/reports", async (req, res, next) => {
  if (!validVenue(req.params.venueId, res)) return;
  try {
    const reports = await Report.find({ venueId: req.params.venueId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    res.json({ reports });
  } catch (error) {
    next(error);
  }
});

app.post("/api/venues/:venueId/reports", async (req, res, next) => {
  if (!validVenue(req.params.venueId, res)) return;
  const { crowd, noise, seating, wifi, outlets, note = "" } = req.body || {};
  const choices = {
    crowd: ["Low", "Moderate", "High"],
    noise: ["Quiet", "Moderate", "Noisy"],
    seating: ["Plentiful", "Few Seats Left", "Full", "Not checked"],
    wifi: ["Excellent", "Good", "Spotty", "Down", "Not checked"],
    outlets: ["Available Everywhere", "Some Desks", "None Available", "Not checked"],
  };
  if (Object.entries(choices).some(([key, values]) => !values.includes(req.body?.[key]))) {
    return res.status(400).json({ error: "Please complete each report field with a valid option." });
  }
  if (typeof note !== "string" || note.length > 500) {
    return res.status(400).json({ error: "Comments must be 500 characters or fewer." });
  }
  try {
    const report = await Report.create({
      venueId: req.params.venueId,
      author: "Spotwise guest",
      crowd,
      noise,
      seating,
      wifi,
      outlets,
      note: note.trim(),
    });
    res.status(201).json({ report });
  } catch (error) {
    next(error);
  }
});

app.get("/api/venues/:venueId/chat", async (req, res, next) => {
  if (!validVenue(req.params.venueId, res)) return;
  try {
    const messages = await ChatMessage.find({ venueId: req.params.venueId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    res.json({ messages: messages.reverse().map(safeMessage) });
  } catch (error) {
    next(error);
  }
});

app.get("/api/saved/:userId", async (req, res, next) => {
  if (!/^[\w-]{1,80}$/.test(req.params.userId)) {
    return res.status(400).json({ error: "Invalid demo user." });
  }
  try {
    const records = await SavedPlace.find({ userId: req.params.userId }).lean();
    res.json({ venueIds: records.map((record) => record.venueId) });
  } catch (error) {
    next(error);
  }
});

app.put("/api/saved/:venueId", async (req, res, next) => {
  if (!validVenue(req.params.venueId, res)) return;
  const { userId, saved } = req.body || {};
  if (typeof userId !== "string" || !/^[\w-]{1,80}$/.test(userId) || typeof saved !== "boolean") {
    return res.status(400).json({ error: "A valid demo user and saved flag are required." });
  }
  try {
    if (saved) {
      await SavedPlace.updateOne(
        { userId, venueId: req.params.venueId },
        { $setOnInsert: { userId, venueId: req.params.venueId } },
        { upsert: true }
      );
    } else {
      await SavedPlace.deleteOne({ userId, venueId: req.params.venueId });
    }
    res.json({ saved });
  } catch (error) {
    next(error);
  }
});

io.on("connection", (socket) => {
  let lastSentAt = 0;
  socket.on("join-venue", (venueId) => {
    if (typeof venueId !== "string" || !venueIds.has(venueId)) return;
    for (const room of socket.rooms) {
      if (room !== socket.id) socket.leave(room);
    }
    socket.join(`venue:${venueId}`);
  });

  socket.on("send-message", async (payload, acknowledge = () => {}) => {
    const now = Date.now();
    const venueId = payload?.venueId;
    const text = typeof payload?.text === "string" ? payload.text.trim() : "";
    if (!venueIds.has(venueId) || !socket.rooms.has(`venue:${venueId}`)) {
      return acknowledge({ error: "Join a valid venue chat before sending." });
    }
    if (!text || text.length > 500) {
      return acknowledge({ error: "Messages must be between 1 and 500 characters." });
    }
    if (now - lastSentAt < 800) {
      return acknowledge({ error: "Please wait a moment before sending another message." });
    }
    lastSentAt = now;
    try {
      const author =
        typeof payload?.author === "string" && payload.author.trim()
          ? payload.author.trim().slice(0, 40)
          : "Guest";

      const message = await ChatMessage.create({
        venueId,
        author,
        text,
      });
      const result = {
        ...safeMessage(message),
        clientId: payload?.clientId,
      };
      // Broadcast to other peers in the venue room
      socket.to(`venue:${venueId}`).emit("new-message", result);
      // Acknowledge back to sender
      acknowledge({ message: result });
    } catch {
      acknowledge({ error: "Message could not be saved. Please try again." });
    }
  });
});

app.use((error, _req, res, next) => {
  void next;
  console.error(error);
  res.status(500).json({ error: "The backend could not complete that request." });
});

async function start() {
  if (!process.env.MONGODB_URI) {
    throw new Error("Set MONGODB_URI in .env before starting the backend.");
  }
  await mongoose.connect(process.env.MONGODB_URI);
  server.listen(PORT, () => console.log(`Spotwise API and chat listening on ${PORT}`));
}

start().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
