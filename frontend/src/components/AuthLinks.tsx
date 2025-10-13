"use client";
import React from "react";

const AuthLinks: React.FC<AuthLinksProps> = ({ mode }) => {
  return (
    <div className="flex flex-col justify-center items-center w-full md:h-[100px] md:px-10 py-5 mt-4">
      {(mode === "login" || mode === "reset") && (
        <p className="md:text-lg text-center text-white">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-amber-400">
            Register
          </a>
        </p>
      )}

      {(mode === "register" || mode === "reset") && (
        <p className="md:text-lg text-center text-white">
          Have an account?{" "}
          <a href="/login" className="text-amber-400">
            Login instead
          </a>
        </p>
      )}

      {(mode === "login" || mode === "register") && (
        <p className="md:text-lg text-center text-white">
          Forgot your password?{" "}
          <a href="/recover" className="text-amber-400">
            Reset Password
          </a>
        </p>
      )}
    </div>
  );
};

export default AuthLinks;
