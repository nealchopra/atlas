import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { action, ...data } = await req.json();
    const { access_token } = data;

    if (!access_token) {
      return NextResponse.json(
        { error: "No access token provided" },
        { status: 401 }
      );
    }

    const notion = new Client({ auth: access_token });

    switch (action) {
      case "list_databases":
        const databases = await notion.search({
          filter: {
            property: "object",
            value: "database",
          },
        });
        return NextResponse.json(databases);

      case "create_database":
        const { title } = data;
        const newDatabase = await notion.databases.create({
          parent: {
            type: "page_id",
            page_id: data.pageId,
          },
          title: [
            {
              type: "text",
              text: {
                content: title,
                link: null,
              },
            },
          ],
          properties: {
            Title: {
              title: {},
            },
            Summary: {
              rich_text: {},
            },
            Authors: {
              rich_text: {},
            },
            Tags: {
              multi_select: {
                options: [],
              },
            },
            "Key Findings": {
              rich_text: {},
            },
            Methodology: {
              rich_text: {},
            },
            Limitations: {
              rich_text: {},
            },
            "Future Work": {
              rich_text: {},
            },
            Impact: {
              rich_text: {},
            },
            URL: {
              url: {},
            },
          },
        });
        return NextResponse.json(newDatabase);

      case "add_to_database":
        const { databaseId, paper, analysis } = data;
        const newPage = await notion.pages.create({
          parent: {
            database_id: databaseId,
          },
          properties: {
            Title: {
              title: [
                {
                  text: {
                    content: paper.title,
                  },
                },
              ],
            },
            Summary: {
              rich_text: [
                {
                  text: {
                    content: analysis.summary,
                  },
                },
              ],
            },
            Authors: {
              rich_text: [
                {
                  text: {
                    content: paper.authors?.map((a: any) => a.name).join(", ") || "",
                  },
                },
              ],
            },
            Tags: {
              multi_select: analysis.tags.map((tag: string) => ({
                name: tag,
              })),
            },
            "Key Findings": {
              rich_text: [
                {
                  text: {
                    content: Array.isArray(analysis.keyFindings)
                      ? analysis.keyFindings.join("\n")
                      : analysis.keyFindings,
                  },
                },
              ],
            },
            Methodology: {
              rich_text: [
                {
                  text: {
                    content: analysis.methodology,
                  },
                },
              ],
            },
            Limitations: {
              rich_text: [
                {
                  text: {
                    content: Array.isArray(analysis.limitations)
                      ? analysis.limitations.join("\n")
                      : analysis.limitations,
                  },
                },
              ],
            },
            "Future Work": {
              rich_text: [
                {
                  text: {
                    content: Array.isArray(analysis.futureWork)
                      ? analysis.futureWork.join("\n")
                      : analysis.futureWork,
                  },
                },
              ],
            },
            Impact: {
              rich_text: [
                {
                  text: {
                    content: analysis.impact,
                  },
                },
              ],
            },
            URL: {
              url: paper.url || "",
            },
          },
        });
        return NextResponse.json(newPage);

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error("Notion API error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 