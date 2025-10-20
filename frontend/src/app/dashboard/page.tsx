'use client';
import { useUser } from "@/components/ClientLayout";
import React from "react";


const Page: React.FC = () => {
  const role = useUser()?.role;
  return (
    <div className="w-[100%] mx-auto">
      <h1>{role?.charAt(0).toUpperCase() + role?.slice(1)} Dashboard</h1>
      <p>Welcome to the {role} dashboard page.</p>
    </div>
  );
};

export default Page;
