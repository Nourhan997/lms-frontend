"use client";

import dynamic from "next/dynamic";
import { Spinner } from "@/components/ui/Spinner";

// react-player references the DOM, so it must not render on the server.
const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <Spinner size="lg" className="text-white" />
    </div>
  ),
});

export interface CoursePlayerProps {
  /** Video source URL (react-player v3 uses `src`). */
  src: string;
}

export function CoursePlayer({ src }: CoursePlayerProps) {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
      <ReactPlayer src={src} controls width="100%" height="100%" />
    </div>
  );
}
