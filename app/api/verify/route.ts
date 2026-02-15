import { check_payment } from "@/lib/check_payment";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { md5 }: { md5: string } = await request.json();
  const res = await check_payment(md5);
  return new NextResponse(JSON.stringify(res));
}
