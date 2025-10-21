"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Section from "@/components/Section";
import { io, Socket } from "socket.io-client";
import { axiosInstance } from "@/lib/axios";

type ChatMessage = { name: string; message: string; local?: boolean };
type UserSummary = { id: string; full_name: string; email: string };

type MeResponse = {
    user: {
        userId: string;
        email: string;
        role: string;
    } | null;
    token: string | null;
};

const MessagesPage: React.FC = () => {
    const [me, setMe] = useState<MeResponse["user"] | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const socketRef = useRef<Socket | null>(null);
    const [connected, setConnected] = useState(false);
    const [loadingDoctors, setLoadingDoctors] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [messages, selectedDoctor]);

    // Fetch /api/me (user + token)
    useEffect(() => {
        let isMounted = true;
        const fetchMe = async () => {
            try {
                const res = await fetch("/api/me");
                if (!isMounted) return;
                const data: MeResponse = await res.json();
                setMe(data.user);
                setToken(data.token);
            } catch (err) {
                console.error("Failed to fetch /api/me:", err);
                setMe(null);
                setToken(null);
            }
        };
        fetchMe();
        return () => {
            isMounted = false;
        };
    }, []);

    // Fetch doctors for sidebar
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

    // Connect and join room
    const connectAndJoin = (receiverId: string) => {
        if (!token) {
            alert("No token found. Please login again.");
            return;
        }

        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
            setMessages([]);
            setConnected(false);
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

        socket.on("connect", () => {
            setConnected(true);
            console.log("Socket connected:", socket.id);
            socket.emit("joinRoom", { receiverId });
        });

        socket.on("disconnect", () => setConnected(false));
        socket.on("connect_error", (err) => console.error("Socket connect error:", err));
        socket.on("receiveMessage", (payload) =>
            setMessages((prev) => [...prev, { name: payload.name, message: payload.message }])
        );
    };

    const handleSelectDoctor = (doc: Doctor) => {
        setSelectedDoctor(doc);
        setMessages([]);
        connectAndJoin(doc.id);
    };

    const sendMessage = () => {
        if (!input.trim() || !socketRef.current || !selectedDoctor || !me) return;
        const payload = {
            senderId: me.userId,
            receiverId: selectedDoctor.id,
            content: input.trim(),
        };
        setMessages((prev) => [...prev, { name: "You", message: payload.content, local: true }]);
        socketRef.current.emit("sendMessage", payload);
        setInput("");
    };

    useEffect(() => {
        return () => {
            socketRef.current?.disconnect();
        };
    }, []);

    return (
        <Section title="Messages">
            <div className="relative w-[70%] min-h-100 mx-auto flex gap-6 bg-[#05050580] rounded-[25px] p-6 shadow-lg backdrop-blur-md border border-white/10 text-white">
                {/* Chat area */}
                <Card className="flex-1 bg-[#D9D9D952] border-none rounded-[20px] shadow-lg flex flex-col justify-between overflow-hidden">
                    <CardHeader className="border-b border-white/20">
                        <CardTitle className="text-2xl text-white">
                            {selectedDoctor ? selectedDoctor.name : "Select a doctor to start"}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {selectedDoctor ? (
                            <>
                                {messages.length === 0 && (
                                    <p className="text-sm text-white/60">No messages yet. Say hello 👋</p>
                                )}

                                {messages.map((m, i) => {
                                    const isLocal = m.local || m.name === "You";
                                    return (
                                        <div
                                            key={i}
                                            className={`max-w-[70%] p-3 rounded-2xl shadow-md ${isLocal ? "self-end bg-[#4a9eff90]" : "self-start bg-[#ffffff20]"
                                                }`}
                                        >
                                            {!isLocal && <div className="text-xs text-white/80 mb-1 font-semibold">{m.name}</div>}
                                            <p className="text-sm">{m.message}</p>
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
                        <Button
                            className="rounded-xl px-6 bg-[#4A9EFF] hover:bg-[#3C89E2]"
                            onClick={sendMessage}
                            disabled={!selectedDoctor}
                        >
                            Send
                        </Button>
                    </div>
                </Card>

                {/* Doctor list sidebar */}
                <div className="w-[40%] bg-[#D9D9D952] rounded-[20px] shadow-lg flex flex-col">
                    <h3 className="text-xl font-semibold text-white px-4 py-3 border-b border-white/20">Doctors</h3>

                    <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                        {loadingDoctors && <p className="text-white/60 px-2">Loading doctors...</p>}

                        {!loadingDoctors && doctors.length === 0 && (
                            <p className="text-white/60 px-2">No doctors available.</p>
                        )}

                        {!loadingDoctors &&
                            doctors.map((doc) => (
                                <div
                                    key={doc.id}
                                    onClick={() => handleSelectDoctor(doc)}
                                    className={`rounded-xl p-3 mb-3 cursor-pointer transition
                    ${selectedDoctor?.id === doc.id ? "bg-[#4A9EFF40]" : "bg-[#ffffff15] hover:bg-[#ffffff25]"}`}
                                >
                                    <p className="font-semibold">{doc.name}</p>
                                    <p className="text-sm text-gray-300">{doc.specializations.join(", ")}</p>
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
