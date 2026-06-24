import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { loginWithApi } from "@/lib/auth/api";
import {
  ACCESS_TOKEN_COOKIE,
  AUTH_COOKIE_MAX_AGE_SECONDS,
} from "@/lib/auth/constants";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    password?: string;
  };

  if (!body.email || !body.password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 },
    );
  }

  const result = await loginWithApi({
    email: body.email,
    password: body.password,
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN_COOKIE, result.data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: result.data.expiresIn ?? AUTH_COOKIE_MAX_AGE_SECONDS,
  });

  return NextResponse.json({ user: result.data.user });
}
