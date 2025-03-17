import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../supabaseServer";

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");

  try {
    const { data, error } = await supabase.auth.admin.deleteUser(uid as string);

    return NextResponse.json({ data, error }, { status: 200 });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ error: "Failed GET Request" }, { status: 500 });
  }
}
