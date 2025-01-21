import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;
        const response = await fetch(
            `https://api.semanticscholar.org/graph/v1/paper/${id}?fields=paperId,title,abstract,authors,year,citationCount,url,venue,publicationDate,fieldsOfStudy`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (!response.ok) {
            throw new Error(`Failed to fetch paper details: ${response.statusText}`);
        }
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching paper details:", error);
        return NextResponse.json(
            { error: "Failed to fetch paper details" },
            { status: 500 }
        );
    }
}