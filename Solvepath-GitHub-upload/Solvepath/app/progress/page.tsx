import type { Metadata } from "next";
import { ProgressWorkspace } from "@/app/progress/progress-workspace";

export const metadata: Metadata = { title: "Progress" };

export default function ProgressPage() {
  return <ProgressWorkspace />;
}
