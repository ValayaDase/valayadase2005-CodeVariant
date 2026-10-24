import { connectDatabase, ChatMessage } from "@/lib/server/database";
import { invalidVenueResponse, isValidVenue, safeMessage, serverErrorResponse } from "@/lib/server/api";

export async function GET(_request, { params }) {
  const { venueId } = await params;
  if (!isValidVenue(venueId)) return invalidVenueResponse();
  try {
    await connectDatabase();
    const records = await ChatMessage.find({ venueId }).sort({ createdAt: -1 }).limit(50).lean();
    return Response.json({ messages: records.reverse().map(safeMessage) });
  } catch (error) {
    return serverErrorResponse(error);
  }
}

export async function POST(request, { params }) {
  const { venueId } = await params;
  if (!isValidVenue(venueId)) return invalidVenueResponse();

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "A valid JSON message is required." }, { status: 400 });
  }

  const text = typeof body?.text === "string" ? body.text.trim() : "";
  if (!text || text.length > 500) {
    return Response.json({ error: "Messages must be between 1 and 500 characters." }, { status: 400 });
  }

  const author = typeof body?.author === "string" && body.author.trim()
    ? body.author.trim().slice(0, 40)
    : "Guest";
  const clientId = typeof body?.clientId === "string" && body.clientId.length <= 100
    ? body.clientId
    : undefined;

  try {
    await connectDatabase();
    const message = await ChatMessage.create({ venueId, author, text, clientId });
    return Response.json({ message: safeMessage(message) }, { status: 201 });
  } catch (error) {
    return serverErrorResponse(error);
  }
}
