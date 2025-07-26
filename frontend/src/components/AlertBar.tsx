"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { clearAlert } from "@/lib/features/alert/alertSlice";

export const AlertBar = () => {
  const dispatch = useAppDispatch();
  const { message, type } = useAppSelector((state) => state.alert);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        dispatch(clearAlert());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  if (!message) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-md z-50 text-white text-xl
        ${type === "error" ? "bg-red-600" : "bg-green-600"}`}
    >
      {message}
    </div>
  );
};
