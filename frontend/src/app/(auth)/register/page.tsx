"use client";
import { useState } from "react";
import useLoader from "@/hooks/useLoader";
import AuthCard from "@/components/AuthCard";
import AuthButton from "@/components/AuthButton";
import { axiosInstance } from "@/lib/axios";

export default function Register() {
  const [registered, setRegistered] = useState<FormDataEntryValue>("");
  const { loading, showLoader, hideLoader } = useLoader();
  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    showLoader();
    // Extract form data
    const formData = new FormData(event.currentTarget);
    const { name, role, email, password, terms } = Object.fromEntries(
      formData.entries()
    );

    // Validate form inputs
    if (!name || !role || !email || !password || !terms) {
      alert("Please fill in all fields and agree to the terms and conditions.");
      return;
    }

    try {
      // Send registration data to the server
      const response = await axiosInstance.post(`/auth/register/`, {
        full_name: name,
        email,
        password,
        role,
      });

      // Handle successful registration
      if (response.status === 201) {
        hideLoader();
        setRegistered(email);
      }
    } catch (error) {
      // Handle errors
      console.error("Registration failed:", error);
      hideLoader();
    }
  };
  const handleVerification = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    showLoader();
    const formData = new FormData(event.currentTarget);
    const { verificationCode } = Object.fromEntries(formData.entries());
    // Validate form inputs
    if (!verificationCode) {
      alert("Please enter the verification code.");
      hideLoader();
      return;
    }
    try {
      const response = await axiosInstance.post("/auth/verify-otp", {
        otp: verificationCode,
        email: registered,
      });

      // Handle successful registration
      if (response.status === 200) {
        hideLoader();
        setRegistered("");
        window.location.href = "/";
      }
    } catch (error) {
      // Handle errors
      console.error("Verification failed:", error);
      hideLoader();
    }
  };

  return (
    <AuthCard
      mode="register"
      title={registered ? "Verify Account" : "Register"}
    >
      <form
        className="flex flex-col justify-center gap-4 items-center w-full h-full "
        onSubmit={registered ? handleVerification : handleRegister}
      >
        {!registered && (
          <>
            <input
              type="text"
              placeholder="Full Name"
              name="name"
              required
              className="w-full md:h-[50px] border-2 border-gray-300 rounded-md p-2 m-2"
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              required
              className="w-full md:h-[50px] border-2 border-gray-300 rounded-md p-2 m-2"
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              required
              minLength={6}
              maxLength={20}
              autoComplete="on"
              autoCorrect="off"
              spellCheck="false"
              className="w-full md:h-[50px] border-2 border-gray-300 rounded-md p-2 m-2"
            />
            <select
              name="role"
              required
              className="w-full md:h-[50px] border-2 border-gray-300 rounded-md p-2 m-2"
            >
              <option value="" disabled selected>
                Select Role
              </option>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
            <div className="flex items-center w-full m-2">
              <input type="checkbox" name="terms" required className="mr-2" />
              <label htmlFor="terms" className="text-sm">
                I agree to the terms and conditions
              </label>
            </div>
          </>
        )}
        {registered && (
          <input
            type="number"
            placeholder="Enter Verification Code"
            name="verificationCode"
            required
            className="w-full md:h-[50px] border-2 border-gray-300 rounded-md p-2 m-2"
          />
        )}

        <AuthButton
          loading={loading}
          name={registered ? "Verify" : "Register"}
        />
      </form>
    </AuthCard>
  );
}
