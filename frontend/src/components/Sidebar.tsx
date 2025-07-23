"use client";
import React from "react";

const sidebarImages = [
  { src: "/appointments.png", page: "/appointments" },
  { src: "/ai.png", page: "/ai-suggestions" },
  { src: "/records.png", page: "/records" },
  { src: "/messages.png", page: "/messages" },
  { src: "/tips.png", page: "/tips" },
];

interface SideBarProps {
  role: UserRole;
}

const Sidebar: React.FC<SideBarProps> = ({ role }) => {
  const handleNavigate = (page: string) => {
    window.location.href = page;
  };

  const [activeIdx, setActiveIdx] = React.useState<number | null>(null);

  return (
    <aside
      className="fixed top-1/4 left-[40px] w-[50px] h-[350px] flex flex-col justify-around items-center py-4 shadow-md rounded-lg"
      style={{ background: "rgba(217, 217, 217, 0.33)" }}
    >
      {sidebarImages.map((img, idx) => {
        const isActive = activeIdx === idx;
        return (
          <button
            key={idx}
            onClick={() => {
              setActiveIdx(idx);
              handleNavigate(`/${role}/${img.page}`);
            }}
            className="mb-3 last:mb-0 focus:outline-none rounded transition"
            type="button"
            style={{ background: "transparent" }}
          >
            <div
              style={
                isActive
                  ? {
                      background: "rgba(0,0,0,0.3)",
                      borderRadius: "8px",
                      padding: "6px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }
                  : undefined
              }
            >
              <img
                src={img.src}
                alt={`Sidebar icon ${idx + 1}`}
                className="w-8 h-8 object-contain"
              />
            </div>
          </button>
        );
      })}
    </aside>
  );
};

export default Sidebar;
