import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const orders = (data ?? []).map((o) => ({
    id: o.id,
    customerName: o.customer_name,
    phone: o.phone ?? "",
    ration: o.ration,
    days: o.days,
    amount: o.amount,
    status: o.status,
    notes: o.notes ?? "",
    createdAt: o.created_at ?? "",
  }));

  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  let notesString: string;
  if (body.notes && typeof body.notes === "string") {
    notesString = body.notes;
  } else {
    notesString = JSON.stringify({
      comment: body.comment ?? "",
      social: body.social ?? "",
      city: body.city ?? "",
      street: body.street ?? "",
      house: body.house ?? "",
      apartment: body.apartment ?? "",
      floor: body.floor ?? "",
      intercom: body.intercom ?? "",
      deliverySlots: body.deliverySlots ?? [],
    });
  }

  const { data, error } = await supabase
    .from("orders")
    .insert({
      customer_name: body.customerName,
      phone: body.phone ?? "",
      ration: body.ration,
      days: body.days,
      amount: body.amount,
      status: body.status ?? "pending",
      notes: notesString,
    })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    id: data.id,
    customerName: data.customer_name,
    phone: data.phone ?? "",
    ration: data.ration,
    days: data.days,
    amount: data.amount,
    status: data.status,
    notes: data.notes ?? "",
    createdAt: data.created_at ?? "",
  });
}
