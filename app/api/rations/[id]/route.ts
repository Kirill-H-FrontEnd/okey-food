import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();

  const updates: Record<string, unknown> = {};
  if (body.name !== undefined) updates.name = body.name;
  if (body.description !== undefined) updates.description = body.description;
  if (body.calories !== undefined) updates.calories = body.calories;
  if (body.pricePerDay !== undefined) updates.price_per_day = body.pricePerDay;
  if (body.image !== undefined) updates.image = body.image;
  if (body.category !== undefined) updates.category = body.category;
  if (body.isActive !== undefined) updates.is_active = body.isActive;
  if (body.dishes !== undefined) updates.dishes = body.dishes;

  const { error } = await supabase.from("rations").update(updates).eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const { error } = await supabase.from("rations").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
