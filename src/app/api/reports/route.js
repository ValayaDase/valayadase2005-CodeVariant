import { connectDatabase, Report } from "@/lib/server/database";
import { serverErrorResponse, venueById } from "@/lib/server/api";

export async function GET() {
  try {
    await connectDatabase();
    const reports = await Report.find().sort({ createdAt: -1 }).limit(100).lean();
    return Response.json({
      reports: reports.map((report) => ({
        ...report,
        id: report._id.toString(),
        venueName: venueById.get(report.venueId)?.name || "Workspace",
        venueCategory: venueById.get(report.venueId)?.categoryLabel || "Workspace",
        neighborhood: venueById.get(report.venueId)?.neighborhood || "",
        timestamp: new Date(report.createdAt).toLocaleString(),
        status: "Community reported",
      })),
    });
  } catch (error) {
    return serverErrorResponse(error);
  }
}
