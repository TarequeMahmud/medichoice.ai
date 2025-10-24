"use client";
import { JwtPayload } from "jsonwebtoken";
import React, { createContext, useContext } from "react";

interface UserContextType {
  user: JwtPayload;
  token: string;
}

const UserContext = createContext<UserContextType | null>(null);
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export default function ClientLayout({
  user,
  token,
  children,
}: {
  user: JwtPayload;
  token: string;
  children: React.ReactNode;
}) {
  return (
    <UserContext.Provider value={{ user, token }} >
      {children}
    </UserContext.Provider>
  );
}