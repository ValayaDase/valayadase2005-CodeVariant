import { connectDatabase, SavedPlace } from "@/lib/server/database";
import { invalidVenueResponse, isValidDemoUser, isValidVenue, serverErrorResponse } from "@/lib/server/api";

export async function GET(_request, { params }) {
  const { id: userId } = await params;
  if (!isValidDemoUser(userId)) {
    return Response.json({ error: "Invalid demo user." }, { status: 400 });
  }
  try {
    await connectDatabase();
    const records = await SavedPlace.find({ userId }).lean();
    return Response.json({ venueIds: records.map((record) => record.venueId) });
  } catch (error) {
    return serverErrorResponse(error);
  }
}

export async function PUT(request, { params }) {
  const { id: venueId } = await params;
  if (!isValidVenue(venueId)) return invalidVenueResponse();

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "A valid saved-place update is required." }, { status: 400 });
  }
  const { userId, saved } = body || {};
  if (!isValidDemoUser(userId) || typeof saved !== "boolean") {
    return Response.json({ error: "A valid demo user and saved flag are required." }, { status: 400 });
  }

  try {
    await connectDatabase();
    if (saved) {
      await SavedPlace.updateOne(
        { userId, venueId },
        { $setOnInsert: { userId, venueId } },
        { upsert: true }
      );
    } else {
      await SavedPlace.deleteOne({ userId, venueId });
    }
    return Response.json({ saved });
  } catch (error) {
    return serverErrorResponse(error);
  }
}
