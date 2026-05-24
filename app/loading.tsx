import { Spinner } from "@/components/ui/Spinner";

/** Global route-transition loading state. */
export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner size="lg" className="text-blue-600" />
    </div>
  );
}
