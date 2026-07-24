import type { Metadata } from "next";
import { MistakesWorkspace } from "@/app/mistakes/mistakes-workspace";

export const metadata: Metadata = { title: "Mistake book" };

export default function MistakesPage() {
  return <MistakesWorkspace />;
}
