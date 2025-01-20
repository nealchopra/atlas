import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const { data: project, error } = await supabase
      .from("projects")
      .select("*, paper_analyses(*)")
      .eq("id", params.id)
      .single();

    if (error) throw error;

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching project" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const { title, description } = await request.json();

    const { data: project, error } = await supabase
      .from("projects")
      .update({ title, description })
      .eq("id", params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating project" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", params.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting project" },
      { status: 500 }
    );
  }
} 