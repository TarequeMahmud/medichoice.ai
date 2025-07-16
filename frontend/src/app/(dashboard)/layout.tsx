import ClientLayout from "@/components/ClientLayout";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen items-center justify-center w-full">
      <ClientLayout>{children}</ClientLayout>
    </div>
  );
};

export default Layout;
