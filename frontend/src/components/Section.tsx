import { title } from "process";
import React, { PropsWithChildren } from "react";

interface SectionProps extends PropsWithChildren {
  title: string;
}

const Section: React.FC<SectionProps> = ({ title, children }) => {
  return (
    <div className="w-full m-auto px-4 py-6 ml-10">
      <h1 className="text-3xl text-center text-white font-bold mb-2 mx-auto">
        {title}
      </h1>
      <hr className="mb-10 w-[80%] mx-auto" />
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        {children}
      </div>
    </div>
  );
};

export default Section;
