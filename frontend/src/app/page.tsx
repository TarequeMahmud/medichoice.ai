import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function Page() {
  const user = await verifyToken();
  if (!user) {
    redirect("/login");
  } else {
    redirect("/dashboard");
  }
}
