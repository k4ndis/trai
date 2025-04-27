// src/app/api/delete-image/route.ts
import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function DELETE(req: NextRequest) {
  const { filePath } = await req.json()

  if (!filePath) {
    return NextResponse.json({ error: "Kein Pfad angegeben" }, { status: 400 })
  }

  const { error } = await supabaseAdmin.storage.from("trai").remove([filePath])

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
