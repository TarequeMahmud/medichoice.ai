import React from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return <div className="p-6 w-[95%]">{children}</div>;
};

export default AdminLayout;
