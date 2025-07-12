"use client";
import React from "react";

const AuthLinks: React.FC<AuthLinksProps> = ({ mode }) => {
  return (
    <div className="flex flex-col justify-center items-center w-full md:h-[100px] md:px-10 py-5 bg-[#ffffffe1] rounded-xl border-2 border-gray-300 shadow-lg mt-4">
      {(mode === "login" || mode === "reset") && (
        <p className="md:text-lg text-center text-[#4e4e4e]">
          Don&apos;t have an account?{" "}
          <a href="/auth/register" className="text-blue-500">
            Register
          </a>
        </p>
      )}

      {(mode === "register" || mode === "reset") && (
        <p className="md:text-lg text-center text-[#4e4e4e]">
          Have an account?{" "}
          <a href="/auth/login" className="text-blue-500">
            Login instead
          </a>
        </p>
      )}

      {(mode === "login" || mode === "register") && (
        <p className="md:text-lg text-center text-[#4e4e4e]">
          Forgot your password?{" "}
          <a href="/auth/recover" className="text-blue-500">
            Reset Password
          </a>
        </p>
      )}
    </div>
  );
};

export default AuthLinks;
