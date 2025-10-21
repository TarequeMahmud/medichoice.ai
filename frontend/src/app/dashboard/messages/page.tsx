"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Section from "@/components/Section";

const MessagesPage: React.FC = () => {
    return (
        <Section title="Messages">
            <div className="relative w-[70%] mx-auto flex gap-6 bg-[#05050580] rounded-[25px] p-6 shadow-lg backdrop-blur-md border border-white/10 text-white">
                {/* Chat area */}
                <Card className="flex-1 bg-[#D9D9D952] border-none rounded-[20px] shadow-lg flex flex-col justify-between overflow-hidden">
                    <CardHeader className="border-b border-white/20">
                        <CardTitle className="text-2xl text-white">Dr. Hassan</CardTitle>
                    </CardHeader>

                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {/* Message bubbles placeholder */}
                        <div className="self-start max-w-[70%] bg-[#ffffff20] p-3 rounded-2xl shadow-md">
                            <p className="text-sm">Hello doctor, I wanted to ask about my last report.</p>
                        </div>
                        <div className="self-end max-w-[70%] bg-[#4a9eff90] p-3 rounded-2xl shadow-md">
                            <p className="text-sm">Sure, I’ve reviewed it — everything looks fine!</p>
                        </div>
                    </CardContent>

                    {/* Input */}
                    <div className="flex items-center gap-2 border-t border-white/20 p-3">
                        <Input
                            type="text"
                            placeholder="Type a message..."
                            className="flex-1 bg-[#ffffff15] text-white border-none focus:ring-0 placeholder:text-white/50"
                        />
                        <Button className="rounded-xl px-6 bg-[#4A9EFF] hover:bg-[#3C89E2]">
                            Send
                        </Button>
                    </div>
                </Card>

                {/* Doctor list sidebar */}
                <div className="w-[40%] bg-[#D9D9D952] rounded-[20px] shadow-lg flex flex-col">

                    <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                        {Array(4)
                            .fill(0)
                            .map((_, i) => (
                                <div
                                    key={i}
                                    className="bg-[#ffffff15] rounded-xl p-3 mb-3 hover:bg-[#4A9EFF40] cursor-pointer transition"
                                >
                                    <p className="font-semibold">Dr. Hassan</p>
                                    <p className="text-sm text-gray-300">Cardiologist</p>
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            {/* Scrollbar styles */}
            <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ffffff40;
          border-radius: 10px;
        }
      `}</style>
        </Section>
    );
};

export default MessagesPage;
