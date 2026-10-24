import mongoose from "mongoose";
import { connectDatabase } from "@/lib/server/database";

export async function GET() {
  try {
    await connectDatabase();
    return Response.json({
      ok: true,
      service: "spotwise-next",
      database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    });
  } catch {
    return Response.json({ ok: false, database: "disconnected" }, { status: 503 });
  }
}
