"use client";
import React from "react";

const sidebarImages = [
  { src: "/ai.png", page: "/ai-suggestions" },
  { src: "/appointments.png", page: "/appointments" },
  { src: "/messages.png", page: "/messages" },
  { src: "/records.png", page: "/records" },
  { src: "/tips.png", page: "/tips" },
];

const Sidebar: React.FC = () => {
  const handleNavigate = (page: string) => {
    window.location.href = page;
  };

  const [activeIdx, setActiveIdx] = React.useState<number | null>(null);

  return (
    <aside
      className="w-[50px] h-[40vh] flex flex-col items-center py-2 shadow-md rounded-lg"
      style={{ background: "rgba(217, 217, 217, 0.33)" }}
    >
      {sidebarImages.map((img, idx) => {
        const isActive = activeIdx === idx;
        return (
          <button
            key={idx}
            onClick={() => {
              setActiveIdx(idx);
              handleNavigate(`/patient/${img.page}`);
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
