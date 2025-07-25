import { Loader } from "@/components/ui/loader";

export default function Loading() {
  return (
    <div className="w-full h-dvh bg-whitePrimary grid place-items-center z-[1000]">
      <Loader />
    </div>
  );
}
