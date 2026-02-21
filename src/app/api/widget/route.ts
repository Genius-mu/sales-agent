import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET(req: NextRequest) {
  const filePath = join(process.cwd(), "public", "widget.js");
  const js = readFileSync(filePath, "utf-8");

  return new NextResponse(js, {
    headers: {
      "Content-Type": "application/javascript",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
