import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function Page() {
  const isValidUser = await verifyToken();
  if (!isValidUser) {
    redirect("/login");
  } else {
    redirect(`/${isValidUser.role}`);
  }
}
