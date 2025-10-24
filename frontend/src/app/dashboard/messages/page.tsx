"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Section from "@/components/Section";
import { io, Socket } from "socket.io-client";
import { axiosInstance } from "@/lib/axios";
import { useUser } from "@/components/ClientLayout";

type ChatMessage = { senderId: string; name: string; message: string };

const MessagesPage: React.FC = () => {
    const { user, token } = useUser();
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const socketRef = useRef<Socket | null>(null);
    const [loadingDoctors, setLoadingDoctors] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // auto-scroll to bottom on new messages / room change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [messages, selectedDoctor]);

    // fetch doctors
    useEffect(() => {
        const fetchDoctors = async () => {
            setLoadingDoctors(true);
            try {
                const res = await axiosInstance.get("/doctors");
                setDoctors(res.data);
            } catch (err) {
                console.error("Failed to fetch doctors:", err);
            } finally {
                setLoadingDoctors(false);
            }
        };
        fetchDoctors();
    }, []);

    // create socket and attach handlers for a room
    const connectAndJoin = (receiverId: string) => {
        if (!token) {
            alert("No token found. Please login again.");
            return;
        }

        // Disconnect & clean previous socket (if any)
        if (socketRef.current) {
            socketRef.current.removeAllListeners();
            socketRef.current.disconnect();
            socketRef.current = null;
            setMessages([]);
        }

        const WS_URL =
            process.env.NEXT_PUBLIC_WS_URL ||
            (typeof window !== "undefined" && window.location.origin) ||
            "http://localhost:3000";

        const socket = io(WS_URL, {
            auth: { token },
            transports: ["websocket"],
        });

        socketRef.current = socket;

        // IMPORTANT: set up handlers here
        socket.on("connect", () => {
            console.log("Socket connected:", socket.id);
            // ask server to join the correct room
            socket.emit("joinRoom", { receiverId });
        });

        socket.on("disconnect", (reason) => {
            console.log("Socket disconnected:", reason);
        });

        socket.on("connect_error", (err) => {
            console.error("Socket connect error:", err);
        });

        // Server will send previous messages as a single array under this event
        socket.on("receivePreviousMessages", (payload: Array<{ senderId: string; name: string; message: string }>) => {
            // replace messages with previous history
            if (Array.isArray(payload)) {
                setMessages(payload.map((m) => ({ senderId: m.senderId, name: m.name, message: m.message })));
            }
        });

        // Server will broadcast each new message as 'receiveMessage'
        socket.on("receiveMessage", (payload: { senderId: string; name: string; message: string }) => {
            if (!payload) return;
            setMessages((prev) => {
                // simple dedupe: avoid adding exact duplicate that already exists at the end
                const last = prev[prev.length - 1];
                if (last && last.senderId === payload.senderId && last.message === payload.message) {
                    return prev;
                }
                return [...prev, { senderId: payload.senderId, name: payload.name, message: payload.message }];
            });
        });
    };

    const handleSelectDoctor = (doc: Doctor) => {
        setSelectedDoctor(doc);
        setMessages([]); // clear while joining
        connectAndJoin(doc.id);
    };

    // Option 1 chosen — rely on server broadcast to render message (no optimistic local push)
    const sendMessage = () => {
        if (!input.trim() || !socketRef.current || !selectedDoctor || !user) return;
        const payload = {
            senderId: user.userId,
            receiverId: selectedDoctor.id,
            content: input.trim(),
        };
        socketRef.current.emit("sendMessage", payload);
        setInput("");
    };

    // cleanup on unmount
    useEffect(() => {
        return () => {
            if (socketRef.current) {
                socketRef.current.removeAllListeners();
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, []);

    return (
        <Section title="Messages">
            <div className="relative w-[70%] h-130 mx-auto flex gap-6 bg-[#05050580] rounded-[25px] p-6 shadow-lg backdrop-blur-md border border-white/10 text-white">
                {/* Chat area */}
                <Card className="flex-1 bg-[#D9D9D952] border-none rounded-[20px] shadow-lg flex flex-col justify-between overflow-hidden">
                    <CardHeader className="border-b border-white/20">
                        <CardTitle className="text-2xl text-white">{selectedDoctor ? (selectedDoctor.name || "Chat") : "Select a doctor to start"}</CardTitle>
                    </CardHeader>

                    <CardContent className="flex-1 overflow-y-scroll p-4 space-y-4 custom-scrollbar">
                        {selectedDoctor ? (
                            <>
                                {messages.length === 0 && <p className="text-sm text-white/60">No messages yet. Say hello 👋</p>}

                                {messages.map((m, i) => {
                                    const isUser = m.senderId === user?.userId;
                                    return (
                                        <div key={i} className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
                                            <div className={`max-w-[70%] p-3 rounded-2xl shadow-md ${isUser ? "bg-[#4A9EFF90] text-right" : "bg-[#ffffff20]"}`}>
                                                {!isUser && <div className="text-xs text-white/80 mb-1 font-semibold">{m.name}</div>}
                                                <p className="text-sm">{m.message}</p>
                                            </div>
                                        </div>
                                    );
                                })}

                                <div ref={messagesEndRef} />
                            </>
                        ) : (
                            <div className="text-center text-white/70">
                                <p>Select a doctor from the right to begin a secure chat.</p>
                            </div>
                        )}
                    </CardContent>

                    {/* Input */}
                    <div className="flex items-center gap-2 border-t border-white/20 p-3">
                        <Input
                            type="text"
                            placeholder={selectedDoctor ? "Type a message..." : "Select a doctor first"}
                            className="flex-1 bg-[#ffffff15] text-white border-none focus:ring-0 placeholder:text-white/50"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage();
                                }
                            }}
                            disabled={!selectedDoctor}
                        />
                        <Button className="rounded-xl px-6 bg-[#4A9EFF] hover:bg-[#3C89E2]" onClick={sendMessage} disabled={!selectedDoctor}>
                            Send
                        </Button>
                    </div>
                </Card>

                {/* Doctor list sidebar */}
                <div className="w-[40%] bg-[#D9D9D952] rounded-[20px] shadow-lg flex flex-col">
                    <h3 className="text-xl font-semibold text-white px-4 py-3 border-b border-white/20">Doctors</h3>

                    <div className="flex-1 overflow-y-scroll p-2 custom-scrollbar">
                        {loadingDoctors && <p className="text-white/60 px-2">Loading doctors...</p>}
                        {!loadingDoctors && doctors.length === 0 && <p className="text-white/60 px-2">No doctors available.</p>}
                        {!loadingDoctors &&
                            doctors.map((doc) => (
                                <div
                                    key={doc.id}
                                    onClick={() => handleSelectDoctor(doc)}
                                    className={`rounded-xl p-3 mb-3 cursor-pointer transition ${selectedDoctor?.id === doc.id ? "bg-[#4A9EFF40]" : "bg-[#ffffff15] hover:bg-[#ffffff25]"}`}
                                >
                                    <p className="font-semibold">{doc.name}</p>
                                    <p className="text-sm text-gray-300">{(doc as any).specializations?.join?.(", ") || ""}</p>
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
