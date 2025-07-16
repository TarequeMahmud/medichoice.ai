"use client";
import React from "react";

const ErrorPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
      <h1 className="text-5xl font-bold mb-4">Oops!</h1>
      <p className="text-xl mb-8">
        Something went wrong. Please try again later.
      </p>
      <a
        href="/"
        className="px-6 py-3 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition"
      >
        Go Home
      </a>
    </div>
  );
};

export default ErrorPage;
