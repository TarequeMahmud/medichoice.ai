import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("access-token")?.value;

  if (!token) {
    return NextResponse.json({ user: null, token: null }, { status: 401 });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.json({ user, token });
  } catch (err) {
    console.error("JWT verification error:", err);
    return NextResponse.json({ user: null, token: null }, { status: 401 });
  }
}
