import venues from "@/data/venues.json";

const venueIds = new Set(venues.map((venue) => venue.id));
export const venueById = new Map(venues.map((venue) => [venue.id, venue]));

export function isValidVenue(venueId) {
  return venueIds.has(venueId);
}

export function invalidVenueResponse() {
  return Response.json({ error: "Venue not found." }, { status: 404 });
}

export function serverErrorResponse(error) {
  console.error("Spotwise API request failed:", error);
  return Response.json(
    { error: "The backend could not complete that request." },
    { status: 500 }
  );
}

export function safeMessage(message) {
  return {
    id: message._id.toString(),
    venueId: message.venueId,
    author: message.author,
    role: "Demo user",
    text: message.text,
    clientId: message.clientId,
    createdAt: message.createdAt,
    time: new Date(message.createdAt).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

export function isValidDemoUser(userId) {
  return typeof userId === "string" && /^[\w-]{1,80}$/.test(userId);
}
