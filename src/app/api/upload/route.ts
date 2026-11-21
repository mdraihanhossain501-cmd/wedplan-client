import { NextResponse } from "next/server";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// Best-effort limit: 20 uploads per 10 minutes per visitor (per server instance).
const WINDOW_MS = 10 * 60 * 1000;
const MAX_UPLOADS = 20;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  if (hits.size > 5000) hits.clear();

  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_UPLOADS) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

export async function POST(request: Request) {
  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Image upload is not configured" },
      { status: 500 }
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many uploads. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  let file: FormDataEntryValue | null = null;
  try {
    const formData = await request.formData();
    file = formData.get("image");
  } catch {
    return NextResponse.json({ error: "Invalid upload request" }, { status: 400 });
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Please upload a JPG, PNG, WebP or GIF image" },
      { status: 400 }
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "Image must be smaller than 5 MB" },
      { status: 400 }
    );
  }

  const body = new FormData();
  body.append("image", file);

  try {
    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      { method: "POST", body }
    );
    const result = await response.json();

    if (!response.ok || !result?.success) {
      return NextResponse.json({ error: "Image upload failed" }, { status: 502 });
    }
    return NextResponse.json({ url: result.data.url });
  } catch {
    return NextResponse.json({ error: "Image upload failed" }, { status: 502 });
  }
}