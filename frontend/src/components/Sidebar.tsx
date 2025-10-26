"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface SideBarProps {
  role: UserRole;
}

const sidebarItems = [
  { src: "/appointments.png", page: "/dashboard/appointments", title: "Appointments" },
  { src: "/ai.png", page: "/dashboard/ai-suggestions", title: "AI Suggestions" },
  { src: "/records.png", page: "/dashboard/records", title: "Records" },
  { src: "/messages.png", page: "/dashboard/messages", title: "Messages" },
  { src: "/tips.png", page: "/dashboard/tips", title: "Tips" },
];

const Sidebar: React.FC<SideBarProps> = ({ role }) => {
  const pathname = usePathname();

  return (
    <aside
      className="fixed top-1/4 left-10 w-[60px] h-[350px] flex flex-col justify-around items-center py-4 shadow-md rounded-xl backdrop-blur-md bg-[#d9d9d933] border border-white/10"
    >
      {sidebarItems.map((item) => {
        const isActive = pathname === item.page;

        return (
          <Link
            key={item.page}
            href={item.page}
            title={item.title}
            className={`relative group p-2 rounded-lg overflow-hidden isolate transition-all duration-300`}
          >
            {/* Background layer behind the image */}
            <span
              className={`absolute inset-0 rounded-lg transition-all duration-300 z-0
                ${isActive
                  ? "bg-[#4A9EFF40]"
                  : "group-hover:bg-[#ffffff25]"}`}
            />

            {/* Image always on top */}
            <Image
              src={item.src}
              alt={item.title}
              width={32}
              height={32}
              className="relative z-10 w-8 h-8 object-contain transition-transform duration-200"
            />

            {/* Tooltip */}
            <span
              className="absolute left-[115%] top-1/2 -translate-y-1/2 whitespace-nowrap
              bg-[#4A9EFF] text-white text-xs font-medium px-2 py-1 rounded-md shadow-md
              opacity-0 translate-x-[-4px] group-hover:opacity-100 group-hover:translate-x-0
              transition-all duration-300 z-20"
            >
              {item.title}
            </span>
          </Link>
        );
      })}
    </aside>
  );
};

export default Sidebar;
