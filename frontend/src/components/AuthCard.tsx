import React, { ReactNode } from "react";
import AuthLinks from "./AuthLinks";
import clsx from "clsx";

type AuthCardProps = {
  children: ReactNode;
  mode: AuthLinksProps["mode"];
  title?: string;
};

const AuthCard = ({ children, mode, title }: AuthCardProps) => {
  const authMode = mode === "register" || mode === "reset";
  return (
    <div
      className={clsx(
        "flex flex-col justify-center items-center w-full md:px-10",
        authMode && "md:w-[60%] h-auto min-h-full",
        mode === "login" && "md:w-[50%] h-full"
      )}
    >
      <div
        className={clsx(
          "flex flex-col justify-center items-center w-[97%] md:w-[600px]  h-auto px-5 md:px-10 bg-[#D9D9D952] rounded-xl shadow-lg my-10",
          authMode && "pb-4",
          mode === "login" && "pb-8"
        )}
      >
        <h1 className="text-3xl font-bold my-4 text-white">
          {mode === "login" ? "Login" : title}
        </h1>
        {children}
        <AuthLinks mode={mode} />
      </div>
    </div>
  );
};

export default AuthCard;
