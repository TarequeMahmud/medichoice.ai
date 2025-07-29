"use client";
import useLoader from "@/hooks/useLoader";
import AuthCard from "@/components/AuthCard";
import AuthButton from "@/components/AuthButton";
import { authorizedUser, axiosInstance } from "@/lib/axios";
import { useAppDispatch } from "@/hooks/redux";
import { Alert, showAlert } from "@/lib/features/alert/alertSlice";
import axios from "axios";

export default function Login() {
  const { loading, showLoader, hideLoader } = useLoader();
  const dispatch = useAppDispatch();
  const handleSignin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    showLoader();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      alert("Please fill in all fields");
      hideLoader();
      return;
    }

    try {
      const response = await axiosInstance.post(`/auth/login`, {
        email,
        password,
      });

      if (response.status === 201) {
        const user = await authorizedUser();
        window.location.href = `/${user.role}`;
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        dispatch(
          showAlert({
            message: error.response?.data?.message || "Login failed",
            type: "error",
          } as Alert)
        );
      }
    } finally {
      hideLoader();
    }
  };

  return (
    <AuthCard mode="login">
      <form
        className="flex flex-col justify-center gap-4 items-center w-full h-full"
        onSubmit={handleSignin}
      >
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
          autoCapitalize="none"
          spellCheck="false"
          className="w-full md:h-[50px] border-2 border-gray-300 rounded-md p-2 m-2"
        />
        <AuthButton loading={loading} name="Login" />
      </form>
    </AuthCard>
  );
}
