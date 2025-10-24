import Image from "next/image";
import "../globals.css";
import type { Metadata } from "next";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "Medichoice.AI- Authenticate",
  description: "Medichoice.AI authentication page",
};

export default async function Auth({
  children,
}: {
  children: React.ReactNode;
}) {
  const response = await verifyToken();
  console.log("token is:", response);

  if (response) {
    redirect('/dashboard');
  }
  return (
    <div className="flex flex-col md:flex-row justify-center items-center w-full mx-auto min-h-screen p-4">
      <div className="flex flex-col justify-center items-center md:w-[50%] w-full h-full px-10 gap-6">
        <Image
          src="/logo.png"
          alt="medichoice.ai logo"
          width={100}
          height={100}
        />
        <h1
          className="text-4xl font-extrabold text-center"
          style={{ color: "var(--background)" }}
        >
          MediChoice.AI
        </h1>
        <p
          className="text-lg text-center"
          style={{ color: "var(--background)" }}
        >
          An AI based clinic management system
        </p>
      </div>

      {children}
    </div>
  );
}
