import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const data = cookieStore.get("access-token");

  return data?.value ?? null;
}

export async function verifyToken(): Promise<JwtPayload | null> {
  const token = await getToken();
  if (!token) return null;

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    return verified;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
