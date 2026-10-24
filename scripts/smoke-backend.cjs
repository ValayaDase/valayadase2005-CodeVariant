/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("node:assert/strict");
const path = require("node:path");
const { randomUUID } = require("node:crypto");
require("dotenv").config({ path: path.join(__dirname, "../.env.local") });
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const mongoose = require("mongoose");
const { io } = require("socket.io-client");

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const venueId = "glasshouse-atelier";
const otherVenueId = "heritage-reading-room";
const marker = `spotwise-backend-smoke-${randomUUID()}`;
const userId = `smoke-${randomUUID()}`;
const sockets = [];

async function request(pathname, options) {
  return fetch(`${baseUrl}${pathname}`, options);
}

async function expectStatus(response, status, label) {
  const payload = await response.json().catch(() => ({}));
  assert.equal(response.status, status, `${label}: ${JSON.stringify(payload)}`);
  return payload;
}

function connectSocket() {
  return new Promise((resolve, reject) => {
    const socket = io(baseUrl, { timeout: 5000, reconnection: false });
    sockets.push(socket);
    socket.once("connect", () => resolve(socket));
    socket.once("connect_error", reject);
    setTimeout(() => reject(new Error("Socket.IO connection timed out.")), 6000).unref();
  });
}

async function run() {
  assert.ok(process.env.MONGODB_URI, "MONGODB_URI is missing from .env.local or .env");

  await expectStatus(await request("/api/health"), 200, "Health endpoint");
  const preflight = await request(`/api/venues/${venueId}/reports`, {
    method: "OPTIONS",
    headers: {
      Origin: "http://localhost:3000",
      "Access-Control-Request-Method": "POST",
      "Access-Control-Request-Headers": "content-type",
    },
  });
  assert.equal(preflight.headers.get("access-control-allow-origin"), "http://localhost:3000", "Frontend CORS origin was not allowed");
  await expectStatus(await request(`/api/venues/${venueId}/reports`), 200, "Report list");
  await expectStatus(await request("/api/venues/not-a-venue/reports"), 404, "Invalid venue check");

  const invalidReport = await request(`/api/venues/${venueId}/reports`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ crowd: "impossible" }),
  });
  await expectStatus(invalidReport, 400, "Invalid report validation");

  const reportResponse = await request(`/api/venues/${venueId}/reports`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      crowd: "Moderate",
      noise: "Quiet",
      seating: "Plentiful",
      wifi: "Good",
      outlets: "Some Desks",
      note: marker,
    }),
  });
  await expectStatus(reportResponse, 201, "Report creation");
  const { reports } = await (await request(`/api/venues/${venueId}/reports`)).json();
  assert.ok(reports.some((report) => report.note === marker), "Report was not persisted");
  const history = await (await request("/api/reports")).json();
  assert.ok(history.reports.some((report) => report.note === marker), "Report history did not include the report");

  const save = (saved) => request(`/api/saved/${venueId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, saved }),
  });
  await expectStatus(await save(true), 200, "Save place");
  let savedPlaces = await (await request(`/api/saved/${userId}`)).json();
  assert.ok(savedPlaces.venueIds.includes(venueId), "Saved place was not persisted");
  await expectStatus(await save(false), 200, "Unsave place");
  savedPlaces = await (await request(`/api/saved/${userId}`)).json();
  assert.ok(!savedPlaces.venueIds.includes(venueId), "Place remained saved after removing it");

  const [sender, sameRoom, otherRoom] = await Promise.all([
    connectSocket(),
    connectSocket(),
    connectSocket(),
  ]);
  sameRoom.emit("join-venue", venueId);
  sender.emit("join-venue", venueId);
  otherRoom.emit("join-venue", otherVenueId);
  await new Promise((resolve) => setTimeout(resolve, 250));

  const tooLongMessage = await sender.timeout(5000).emitWithAck("send-message", {
    venueId,
    text: "x".repeat(501),
  });
  assert.match(tooLongMessage.error || "", /500 characters/, "Oversized chat message was not rejected");

  let deliveredToOtherRoom = false;
  otherRoom.on("new-message", (message) => {
    if (message.text === marker) deliveredToOtherRoom = true;
  });
  const receivedInRoom = new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Message was not broadcast to the matching venue room.")), 5000);
    sameRoom.on("new-message", (message) => {
      if (message.text === marker) {
        clearTimeout(timer);
        resolve(message);
      }
    });
  });
  const acknowledgement = await sender.timeout(5000).emitWithAck("send-message", { venueId, text: marker });
  assert.equal(acknowledgement.message?.text, marker, "Server did not acknowledge the chat message");
  const delivered = await receivedInRoom;
  assert.equal(delivered.venueId, venueId, "Message venue ID was incorrect");
  await new Promise((resolve) => setTimeout(resolve, 250));
  assert.equal(deliveredToOtherRoom, false, "Message leaked into another venue room");

  const chatHistory = await (await request(`/api/venues/${venueId}/chat`)).json();
  assert.ok(chatHistory.messages.some((message) => message.text === marker), "Chat message was not persisted");
  console.log("Backend smoke checks passed: health, CORS, reports/comments, saved places, chat persistence, room isolation, and validation.");
}

async function cleanup() {
  for (const socket of sockets) socket.disconnect();
  if (!process.env.MONGODB_URI) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Promise.all([
      mongoose.connection.collection("communityreports").deleteMany({ venueId, note: marker }),
      mongoose.connection.collection("chatmessages").deleteMany({ venueId, text: marker }),
      mongoose.connection.collection("savedplaces").deleteMany({ userId }),
    ]);
  } catch {
    console.error("Test record cleanup could not complete automatically; remove records containing the backend smoke marker from MongoDB.");
  } finally {
    await mongoose.disconnect();
  }
}

run()
  .catch((error) => {
    console.error(`Backend smoke check failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(cleanup);
