import { NextResponse } from "next/server";
import OpenAI from "openai";
import { Paper } from "@/types/paper";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const paper: Paper = await request.json();

    const prompt = `Analyze the following research paper:
Title: ${paper.title}
Authors: ${paper.authors.map((a) => a.name).join(", ")}
Year: ${paper.year}
Abstract: ${paper.abstract}

Please provide a comprehensive analysis including:
1. 3-4 concise tags that describe the main research areas and topics (e.g., "Machine Learning", "Computer Vision", "Neural Networks")
2. A concise summary (2-3 sentences)
3. Key findings and contributions
4. Methodology overview
5. Limitations and potential weaknesses
6. Future research directions
7. Impact on the field

Format the response as JSON with the following structure:
{
  "tags": ["string"],
  "summary": "string",
  "keyFindings": ["string"],
  "methodology": "string",
  "limitations": ["string"],
  "futureWork": ["string"],
  "impact": "string"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a research paper analysis assistant. Analyze the given paper and provide structured insights. Be concise but thorough. Focus on the most important aspects. For tags, provide 3-4 specific research areas or topics that best categorize the paper.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No response content");

    const analysis = JSON.parse(content);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze paper" },
      { status: 500 }
    );
  }
}
