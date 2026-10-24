import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

// Only reached on Vercel, where submission photos are written to /tmp
// (see src/app/actions.ts) instead of /public, because /public is
// read-only at runtime there. This streams them back out.
const UPLOAD_DIR = "/tmp/ascend-uploads";

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

export async function GET(_req: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  const safeName = path.basename(filename);
  const filePath = path.join(UPLOAD_DIR, safeName);
  if (!filePath.startsWith(UPLOAD_DIR) || !fs.existsSync(filePath)) {
    return new NextResponse("Not found", { status: 404 });
  }
  const ext = safeName.split(".").pop()?.toLowerCase() ?? "";
  const body = fs.readFileSync(filePath);
  return new NextResponse(body, {
    headers: { "Content-Type": MIME[ext] ?? "application/octet-stream" },
  });
}
