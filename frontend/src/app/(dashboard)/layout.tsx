import ClientLayout from "@/components/ClientLayout";
import Sidebar from "@/components/Sidebar";
import React from "react";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = async ({ children }) => {
  const isValidUser = await verifyToken();
  console.log(isValidUser);

  if (!isValidUser) {
    redirect("/login");
  }
  return (
    <div className="flex flex-row justify-start items-center min-h-screen w-full p-4">
      <Sidebar />
      <ClientLayout>{children}</ClientLayout>
    </div>
  );
};

export default Layout;
