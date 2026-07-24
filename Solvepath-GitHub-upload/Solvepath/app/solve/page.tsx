import type { Metadata } from "next";
import { SolveWorkspace } from "@/app/solve/solve-workspace";

export const metadata: Metadata = { title: "Homework help" };

export default function SolvePage() {
  return <SolveWorkspace />;
}
