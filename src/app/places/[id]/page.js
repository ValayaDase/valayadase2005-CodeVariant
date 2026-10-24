import { Suspense } from "react";
import initialVenues from "@/data/venues.json";
import PlaceDetailClient from "./PlaceDetailClient";

export function generateStaticParams() {
  return initialVenues.map((v) => ({
    id: v.id,
  }));
}

export default async function PlaceDetailPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5F3EC] flex items-center justify-center p-8">
          <div className="w-8 h-8 border-2 border-[#819477] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PlaceDetailClient id={id} />
    </Suspense>
  );
}
