import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: request.headers.get("Authorization")!,
          },
        },
      }
    );

    const { data: projects, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(projects);
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json({ error: "Error fetching projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    console.log("POST /api/projects - Starting");
    const authHeader = request.headers.get("Authorization");
    console.log("Auth header present:", !!authHeader);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: authHeader!,
          },
        },
      }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error("User not found");

    const body = await request.json();
    console.log("Request body:", body);

    const { data: project, error } = await supabase
      .from("projects")
      .insert([{ 
        title: body.title, 
        description: body.description,
        user_id: user.id
      }])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json(
      { error: "Error creating project" },
      { status: 500 }
    );
  }
} 