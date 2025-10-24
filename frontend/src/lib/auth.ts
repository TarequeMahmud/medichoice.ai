import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const data = cookieStore.get("access-token");

  return data?.value ?? null;
}

export async function verifyToken(): Promise<UserTokenResponse | null> {
  const token = await getToken();
  if (!token) return null;

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET!)
    const user: AuthUser = {
      userId: (verified as JwtPayload).sub as string,
      email: (verified as JwtPayload).email as string,
      role: (verified as JwtPayload).role as UserRole,
    }
    return { user, token } as UserTokenResponse;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
