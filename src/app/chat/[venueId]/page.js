import { Suspense } from "react";
import initialVenues from "@/data/venues.json";
import VenueChatClient from "./VenueChatClient";

import LoadingLottie from "@/components/common/LoadingLottie";

export function generateStaticParams() {
  return initialVenues.map((v) => ({
    venueId: v.id,
  }));
}

export default async function VenueChatPage({ params }) {
  const resolvedParams = await params;
  const venueId = resolvedParams?.venueId;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5F3EC] flex items-center justify-center p-8">
          <LoadingLottie size="lg" />
        </div>
      }
    >
      <VenueChatClient venueId={venueId} />
    </Suspense>
  );
}
