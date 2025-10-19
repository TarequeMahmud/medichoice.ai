'use client';
import { useParams } from "next/navigation";
import React from "react";


const Page: React.FC = () => {
  const { role } = useParams() as { role: UserRole };
  return (
    <div className="w-[100%]">
      <h1>{role.charAt(0).toUpperCase() + role.slice(1)} Dashboard</h1>
      <p>Welcome to the {role} dashboard page.</p>
    </div>
  );
};

export default Page;
