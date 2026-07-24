import type { Metadata } from "next";
import { PracticeWorkspace } from "@/app/practice/practice-workspace";

export const metadata: Metadata = { title: "Practice" };

export default function PracticePage() {
  return <PracticeWorkspace />;
}
