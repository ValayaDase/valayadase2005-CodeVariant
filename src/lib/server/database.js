import mongoose from "mongoose";

const globalForMongoose = globalThis;

export async function connectDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured.");
  }

  const state = globalForMongoose.spotwiseMongoose || { promise: null };
  globalForMongoose.spotwiseMongoose = state;
  if (mongoose.connection.readyState === 0) {
    state.promise = null;
  }
  if (!state.promise) {
    state.promise = mongoose.connect(process.env.MONGODB_URI)
      .then(() => mongoose.connection)
      .catch((error) => {
        state.promise = null;
        throw error;
      });
  }

  return state.promise;
}

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
    clientId: { type: String, maxlength: 100 },
  },
  { timestamps: true }
);
messageSchema.index({ venueId: 1, createdAt: -1 });

const savedPlaceSchema = new mongoose.Schema(
  { userId: { type: String, required: true }, venueId: { type: String, required: true } },
  { timestamps: true }
);
savedPlaceSchema.index({ userId: 1, venueId: 1 }, { unique: true });

function model(name, schema) {
  return mongoose.models[name] || mongoose.model(name, schema);
}

export const Report = model("CommunityReport", reportSchema);
export const ChatMessage = model("ChatMessage", messageSchema);
export const SavedPlace = model("SavedPlace", savedPlaceSchema);
