import { NextResponse } from "next/server";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: Request) {
  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Image upload is not configured" },
      { status: 500 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("image");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image" }, { status: 400 });
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