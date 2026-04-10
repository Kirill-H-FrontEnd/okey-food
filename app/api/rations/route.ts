import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("rations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rations = (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    calories: r.calories,
    pricePerDay: r.price_per_day,
    image: r.image,
    category: r.category,
    isActive: r.is_active,
    dishes: r.dishes ?? [],
    createdAt: r.created_at?.split("T")[0] ?? "",
  }));

  return NextResponse.json(rations);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { data, error } = await supabase
    .from("rations")
    .insert({
      name: body.name,
      description: body.description,
      calories: body.calories,
      price_per_day: body.pricePerDay,
      image: body.image,
      category: body.category,
      is_active: body.isActive,
      dishes: body.dishes ?? [],
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    id: data.id,
    name: data.name,
    description: data.description,
    calories: data.calories,
    pricePerDay: data.price_per_day,
    image: data.image,
    category: data.category,
    isActive: data.is_active,
    dishes: data.dishes ?? [],
    createdAt: data.created_at?.split("T")[0] ?? "",
  });
}
