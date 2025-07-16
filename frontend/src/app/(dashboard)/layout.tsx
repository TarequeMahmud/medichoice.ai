import ClientLayout from "@/components/ClientLayout";
import Sidebar from "@/components/Sidebar";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-row justify-start items-center min-h-screen w-full p-4">
      <Sidebar />
      <ClientLayout>{children}</ClientLayout>
    </div>
  );
};

export default Layout;
