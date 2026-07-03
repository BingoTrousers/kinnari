import { NextRequest, NextResponse } from "next/server";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ confirmed: false, message: "Invalid request." }, { status: 400 });
  }

  const { date, time, displayTime, partySize, name, email, phone } = body ?? {};

  if (!date || !time || !partySize || !name || !email || !phone) {
    return NextResponse.json(
      { confirmed: false, message: "All fields are required to complete a reservation." },
      { status: 400 }
    );
  }

  const fields = { date, time, name, email, phone };
  for (const [key, value] of Object.entries(fields)) {
    if (typeof value !== "string" || value.length > 200) {
      return NextResponse.json({ confirmed: false, message: `Invalid ${key}.` }, { status: 400 });
    }
  }
  if (typeof partySize !== "number" && typeof partySize !== "string") {
    return NextResponse.json({ confirmed: false, message: "Invalid party size." }, { status: 400 });
  }

  await delay(900 + Math.random() * 700);

  const stillAvailable = Math.random() > 0.12;

  if (!stillAvailable) {
    return NextResponse.json({
      confirmed: false,
      message: "That table was just booked by another guest. Please choose a different time.",
    });
  }

  return NextResponse.json({
    confirmed: true,
    message: `Your table for ${partySize} on ${date} at ${displayTime ?? time} is confirmed. A confirmation email is on its way to ${email}.`,
  });
}
