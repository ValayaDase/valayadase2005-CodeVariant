import { connectDatabase, Report } from "@/lib/server/database";
import { invalidVenueResponse, isValidVenue, serverErrorResponse } from "@/lib/server/api";

export async function GET(_request, { params }) {
  const { venueId } = await params;
  if (!isValidVenue(venueId)) return invalidVenueResponse();
  try {
    await connectDatabase();
    const reports = await Report.find({ venueId }).sort({ createdAt: -1 }).limit(50).lean();
    return Response.json({ reports });
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
    return Response.json({ error: "A valid JSON report is required." }, { status: 400 });
  }

  const { crowd, noise, seating, wifi, outlets, note = "" } = body || {};
  const choices = {
    crowd: ["Low", "Moderate", "High"],
    noise: ["Quiet", "Moderate", "Noisy"],
    seating: ["Plentiful", "Few Seats Left", "Full", "Not checked"],
    wifi: ["Excellent", "Good", "Spotty", "Down", "Not checked"],
    outlets: ["Available Everywhere", "Some Desks", "None Available", "Not checked"],
  };
  if (Object.entries(choices).some(([key, values]) => !values.includes(body?.[key]))) {
    return Response.json({ error: "Please complete each report field with a valid option." }, { status: 400 });
  }
  if (typeof note !== "string" || note.length > 500) {
    return Response.json({ error: "Comments must be 500 characters or fewer." }, { status: 400 });
  }

  try {
    await connectDatabase();
    const report = await Report.create({
      venueId,
      author: "Spotwise guest",
      crowd,
      noise,
      seating,
      wifi,
      outlets,
      note: note.trim(),
    });
    return Response.json({ report }, { status: 201 });
  } catch (error) {
    return serverErrorResponse(error);
  }
}
