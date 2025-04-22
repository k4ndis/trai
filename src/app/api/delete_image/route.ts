// src/app/api/delete-image/route.ts
import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function DELETE(req: NextRequest) {
  const { filePath } = await req.json()

  if (!filePath) {
    return NextResponse.json({ error: "Kein Pfad angegeben" }, { status: 400 })
  }

  const { error } = await supabase.storage.from("trai").remove([filePath])

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
