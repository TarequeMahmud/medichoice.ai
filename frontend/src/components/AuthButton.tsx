import React from "react";
import Spinner from "@/components/Spinner";
type AuthButtonProps = {
  loading: boolean;
  name: string;
};

const AuthButton: React.FC<AuthButtonProps> = ({ loading, name }) => (
  <button
    type="submit"
    className="w-full h-10 md:h-[50px] bg-[#005baf] text-white rounded-md m-2 cursor-pointer hover:bg-[#0000ffb3] transition duration-300 ease-in-out"
    disabled={loading}
  >
    {loading ? <Spinner /> : name}
  </button>
);

export default AuthButton;
