"use client";
import useLoader from "@/hooks/useLoader";
import AuthCard from "@/components/AuthCard";
import AuthButton from "@/components/AuthButton";
import { axiosInstance } from "@/lib/axios";

export default function Login() {
  const { loading, showLoader, hideLoader } = useLoader();
  const handleSignin = (event: React.FormEvent<HTMLFormElement>) => {
    //prevent reload
    event.preventDefault();
    //show loader
    showLoader();
    //form inputs
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    // Perform validation
    if (!email || !password) {
      alert("Please fill in all fields");
      hideLoader();
      return;
    }

    axiosInstance
      .post(`/auth/login`, { email, password })
      .then((response) => {
        console.log(response);
        hideLoader();

        console.log(response.data);
        if (response.status === 200) {
          console.log(response.headers);

          window.location.href = "/";
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
        hideLoader();
      });
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
