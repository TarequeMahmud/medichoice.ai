import ClientLayout from "@/components/ClientLayout";
import Sidebar from "@/components/Sidebar";
import React from "react";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";

interface LayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Medichoice.AI",
  description: "Medichoice.AI main page",
};

const Layout: React.FC<LayoutProps> = async ({ children }) => {
  const user = await verifyToken();
  if (!user) {
    redirect("/login");
  }
  return (
    <div className="flex flex-row justify-center items-center min-h-screen w-full p-4">
      <Sidebar role={user.role} />
      <ClientLayout user={user}>{children}</ClientLayout>
    </div>
  );
};

export default Layout;
