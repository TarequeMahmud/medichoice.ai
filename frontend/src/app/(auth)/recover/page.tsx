"use client";
import { useState } from "react";
import useLoader from "@/hooks/useLoader";
import AuthCard from "@/components/AuthCard";
import AuthButton from "@/components/AuthButton";
import { axiosInstance } from "@/lib/axios";

export default function Recover() {
  const [email, setEmail] = useState<FormDataEntryValue>("");
  const [status, setStatus] = useState<"SEARCH_EMAIL" | "CHANGE_PWD" | "">(
    "SEARCH_EMAIL"
  );
  const { loading, showLoader, hideLoader } = useLoader();
  const handleSearchEmail = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    showLoader();
    // Extract form data
    const formData = new FormData(event.currentTarget);
    const { email } = Object.fromEntries(formData.entries());

    if (!email) {
      alert("Please fill in all fields and agree to the terms and conditions.");
      return;
    }
    try {
      const response = await axiosInstance.post("/auth/recovery", {
        email,
      });

      if (response.status === 201) {
        setStatus("CHANGE_PWD");
        setEmail(email);
        hideLoader();
      }
    } catch (error) {
      console.error("Registration failed:", error);
      hideLoader();
    }
  };

  const handleChangePassword = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    showLoader();
    const formData = new FormData(event.currentTarget);
    const { newPassword, otp } = Object.fromEntries(formData.entries());

    if (!newPassword) {
      alert("Please enter the new password.");
      hideLoader();
      return;
    }
    try {
      const response = await axiosInstance.post("/auth/change-password", {
        password: newPassword,
        email: email,
        otp,
      });

      if (response.status === 201) {
        setStatus("");
        hideLoader();
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Password changing failed:", error);
      hideLoader();
    }
  };

  const statusMessages = {
    SEARCH_EMAIL: "Enter your email",
    CHANGE_PWD: "Change your password",
  };

  const statusMessage =
    statusMessages[status as keyof typeof statusMessages] || "";

  return (
    <AuthCard mode="reset" title={statusMessage}>
      <form
        className="flex flex-col justify-center gap-4 items-center w-full h-full "
        onSubmit={
          status === "SEARCH_EMAIL" ? handleSearchEmail : handleChangePassword
        }
      >
        {status === "SEARCH_EMAIL" && (
          <input
            type="email"
            placeholder="Email"
            name="email"
            required
            className="w-full h-[50px] border-2 border-gray-300 rounded-md p-2 m-2"
          />
        )}

        {status === "CHANGE_PWD" && (
          <>
            <input
              type="number"
              placeholder="Enter Verification Code"
              name="otp"
              required
              className="w-full h-[50px] border-2 border-gray-300 rounded-md p-2 m-2"
            />
            <input
              type="password"
              placeholder="Type your new password"
              name="newPassword"
              required
              minLength={6}
              maxLength={20}
              autoComplete="on"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              className="w-full h-[50px] border-2 border-gray-300 rounded-md p-2 m-2"
            />
          </>
        )}
        {!status && (
          <p className="text-lg text-center text-[#4e4e4e]">
            Password changed successfully. Redirecting to homepage.
          </p>
        )}

        {status && <AuthButton loading={loading} name="Submit" />}
      </form>
    </AuthCard>
  );
}
