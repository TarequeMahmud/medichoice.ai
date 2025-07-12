import React, { ReactNode } from "react";
import AuthLinks from "./AuthLinks";

type AuthCardProps = {
  children: ReactNode;
  mode: AuthLinksProps["mode"];
};

const AuthCard = ({ children, mode }: AuthCardProps) => {
  return (
    <div className="flex flex-col justify-center items-center w-full md:w-[50%] h-full md:px-10  ">
      <div className="flex flex-col justify-center items-center w-[97%] md:w-[600px]  h-auto px-5 md:px-10 bg-[#D9D9D952] rounded-xl shadow-lg pb-8 my-10">
        {children}
        <AuthLinks mode={mode} />
      </div>
    </div>
  );
};

export default AuthCard;
