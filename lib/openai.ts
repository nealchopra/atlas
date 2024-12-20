import { Paper } from "@/types/paper";

export interface PaperAnalysis {
  tags: string[];
  summary: string;
  keyFindings: string[];
  methodology: string;
  limitations: string[];
  futureWork: string[];
  impact: string;
}

export async function analyzePaper(paper: Paper): Promise<PaperAnalysis> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(paper),
  });

  if (!response.ok) {
    throw new Error("Failed to analyze paper");
  }

  const analysis = await response.json();
  return analysis;
} 