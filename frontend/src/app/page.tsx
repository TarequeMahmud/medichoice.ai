import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function Page() {
  const userAndToken = await verifyToken();
  if (!userAndToken) {
    redirect("/login");
  } else {
    redirect("/dashboard");
  }
}
