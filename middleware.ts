import { NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const { pathname } = nextUrl;

  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }
}