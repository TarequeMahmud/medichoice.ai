import React from "react";
import Spinner from "@/components/Spinner";

interface LoadingOrEmptyProps {
  loading: boolean;
  emptyText: string;
}

const LoadingOrEmpty: React.FC<LoadingOrEmptyProps> = ({
  loading,
  emptyText,
}) => {
  return loading ? (
    <Spinner size="w-12 h-12" color="border-white" />
  ) : (
    <h1 className="text-3xl text-center text-white/50 font-bold mb-2 mx-auto">
      {emptyText}
    </h1>
  );
};

export default LoadingOrEmpty;
