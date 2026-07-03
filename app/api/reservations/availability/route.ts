import { NextRequest, NextResponse } from "next/server";

const DINNER_TIMES = [
  "17:30", "18:00", "18:30", "19:00", "19:30",
  "20:00", "20:30", "21:00", "21:30", "22:00",
];

function hash(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const partySize = searchParams.get("partySize") ?? "2";

  if (!date || date.length > 32) {
    return NextResponse.json({ error: "A valid date is required" }, { status: 400 });
  }

  await delay(500 + Math.random() * 500);

  const seed = hash(`${date}:${partySize}`);
  const size = parseInt(partySize, 10) || 2;

  const slots = DINNER_TIMES.map((time, i) => {
    const slotSeed = hash(`${seed}:${time}`);
    let unavailable = slotSeed % 5 === 0;
    if (size >= 8 && slotSeed % 3 === 0) unavailable = true;
    if (i === 0 || i === DINNER_TIMES.length - 1) {
      unavailable = unavailable || slotSeed % 2 === 0;
    }
    return { time, available: !unavailable };
  });

  return NextResponse.json({ date, partySize: size, slots });
}
