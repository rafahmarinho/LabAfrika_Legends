import { NextResponse } from "next/server";

export function middleware(request) {
  const session = request.cookies.get("token");
  const pages = ["/my-account", "my-guilds", "/my-tickets", "/admin-panel"];
  if (pages.includes(request.nextUrl.pathname) && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
