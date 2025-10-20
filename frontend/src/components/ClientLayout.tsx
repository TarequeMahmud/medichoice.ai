"use client";
import { JwtPayload } from "jsonwebtoken";
import React, { createContext, useContext } from "react";

const UserContext = createContext<JwtPayload | null>(null);
export const useUser = () => useContext(UserContext);

export default function ClientLayout({
  user,
  children,
}: {
  user: JwtPayload;
  children: React.ReactNode;
}) {
  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
}