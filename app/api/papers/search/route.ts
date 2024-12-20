import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  const params = new URLSearchParams({
    query,
    limit: "10",
    fields:
      "paperId,title,abstract,authors,year,citationCount,url,venue,publicationDate,fieldsOfStudy",
  });

  try {
    const response = await fetch(
      `https://api.semanticscholar.org/graph/v1/paper/search?${params}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to search papers: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to search papers" },
      { status: 500 }
    );
  }
} 