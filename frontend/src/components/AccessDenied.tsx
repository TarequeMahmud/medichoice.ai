"use client";
import React from "react";
import { ShieldAlert } from "lucide-react";

export default function AccessDenied({
    message = "You do not have permission to access this page.",
}: {
    message?: string;
}) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-100 py-20">
            <ShieldAlert className="w-12 h-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
            <p className="text-gray-100">{message}</p>
        </div>
    );
}
