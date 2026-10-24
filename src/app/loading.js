import LoadingLottie from "@/components/common/LoadingLottie";

export default function RootLoading() {
  return (
    <div className="min-h-screen w-full bg-[#F5F3EC] flex items-center justify-center p-6">
      <LoadingLottie size="lg" />
    </div>
  );
}
