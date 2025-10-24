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
type Doctor = { id: string; name: string; specializations?: string[] };
type Patient = { id: string; name: string; room: string };

const MessagesPage: React.FC = () => {
    const { user, token } = useUser();
    const [contacts, setContacts] = useState<Doctor[] | Patient[]>([]);
    const [selectedContact, setSelectedContact] = useState<Doctor | Patient | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const socketRef = useRef<Socket | null>(null);
    const [loadingContacts, setLoadingContacts] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // auto-scroll to bottom on new messages / contact change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [messages, selectedContact]);

    // Fetch contacts depending on role
    useEffect(() => {
        const fetchContacts = async () => {
            setLoadingContacts(true);
            try {
                if (user?.role === "doctor") {
                    // Doctor: fetch only chat rooms with patients
                    const res = await axiosInstance.get("/doctors/me/chats");
                    const data = res.data as any[];

                    // Extract unique patients from chats
                    const patientsMap = new Map<string, Patient>();
                    data.forEach((chat) => {
                        const otherId = chat.senderid === user.userId ? chat.receiverid : chat.senderid;
                        const otherName = chat.senderid === user.userId ? chat.receivername : chat.sendername;
                        const room = chat.room;

                        if (!patientsMap.has(otherId)) {
                            patientsMap.set(otherId, { id: otherId, name: otherName, room });
                        } else {
                            // keep latest room if multiple entries — the server should provide consistent room though
                            const existing = patientsMap.get(otherId)!;
                            if (!existing.room && room) existing.room = room;
                        }
                    });

                    setContacts(Array.from(patientsMap.values()));
                } else {
                    // Patient: fetch all doctors
                    const res = await axiosInstance.get("/doctors");
                    setContacts(res.data as Doctor[]);
                }
            } catch (err) {
                console.error("Failed to fetch contacts:", err);
            } finally {
                setLoadingContacts(false);
            }
        };
        fetchContacts();
    }, [user?.role, user?.userId]);

    // Create socket and attach handlers for a room
    const connectAndJoin = (contact: Doctor | Patient) => {
        if (!token) {
            alert("No token found. Please login again.");
            return;
        }

        // Disconnect previous socket
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

        socket.on("connect", () => {
            console.log("Socket connected:", socket.id);

            // FIX: always send the other user's id as `receiverId` so the server can construct the room.
            // For both roles the other user's id is `contact.id`.
            const otherUserId = contact.id;
            socket.emit("joinRoom", { receiverId: otherUserId });
        });

        socket.on("disconnect", (reason) => console.log("Socket disconnected:", reason));
        socket.on("connect_error", (err) => console.error("Socket connect error:", err));

        socket.on("receivePreviousMessages", (payload: ChatMessage[]) => {
            if (Array.isArray(payload)) {
                setMessages(payload);
            }
        });

        socket.on("receiveMessage", (payload: ChatMessage) => {
            if (!payload) return;
            setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last && last.senderId === payload.senderId && last.message === payload.message) {
                    return prev;
                }
                return [...prev, payload];
            });
        });
    };

    const handleSelectContact = (contact: Doctor | Patient) => {
        setSelectedContact(contact);
        setMessages([]);
        connectAndJoin(contact);
    };

    const sendMessage = () => {
        if (!input.trim() || !socketRef.current || !selectedContact || !user) return;

        const receiverId = (selectedContact as Doctor | Patient).id;

        const payload = {
            senderId: user.userId,
            receiverId,
            content: input.trim(),
        };
        socketRef.current.emit("sendMessage", payload);
        setInput("");
    };

    // Cleanup on unmount
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
                        <CardTitle className="text-2xl text-white">
                            {selectedContact ? selectedContact.name : "Select a contact to start"}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="flex-1 overflow-y-scroll p-4 space-y-4 custom-scrollbar">
                        {selectedContact ? (
                            <>
                                {messages.length === 0 && (
                                    <p className="text-sm text-white/60">No messages yet. Say hello 👋</p>
                                )}
                                {messages.map((m, i) => {
                                    const isUser = m.senderId === user?.userId;
                                    return (
                                        <div key={i} className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
                                            <div
                                                className={`max-w-[70%] p-3 rounded-2xl shadow-md ${isUser ? "bg-[#4A9EFF90] text-right" : "bg-[#ffffff20]"
                                                    }`}
                                            >
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
                                <p>Select a contact from the right to begin a secure chat.</p>
                            </div>
                        )}
                    </CardContent>

                    {/* Input */}
                    <div className="flex items-center gap-2 border-t border-white/20 p-3">
                        <Input
                            type="text"
                            placeholder={selectedContact ? "Type a message..." : "Select a contact first"}
                            className="flex-1 bg-[#ffffff15] text-white border-none focus:ring-0 placeholder:text-white/50"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage();
                                }
                            }}
                            disabled={!selectedContact}
                        />
                        <Button
                            className="rounded-xl px-6 bg-[#4A9EFF] hover:bg-[#3C89E2]"
                            onClick={sendMessage}
                            disabled={!selectedContact}
                        >
                            Send
                        </Button>
                    </div>
                </Card>

                {/* Contacts sidebar */}
                <div className="w-[40%] bg-[#D9D9D952] rounded-[20px] shadow-lg flex flex-col">
                    <h3 className="text-xl font-semibold text-white px-4 py-3 border-b border-white/20">
                        {user?.role === "doctor" ? "Patients" : "Doctors"}
                    </h3>

                    <div className="flex-1 overflow-y-scroll p-2 custom-scrollbar">
                        {loadingContacts && <p className="text-white/60 px-2">Loading...</p>}
                        {!loadingContacts && contacts.length === 0 && (
                            <p className="text-white/60 px-2">No contacts available.</p>
                        )}
                        {!loadingContacts &&
                            contacts.map((c) => (
                                <div
                                    key={c.id}
                                    onClick={() => handleSelectContact(c)}
                                    className={`rounded-xl p-3 mb-3 cursor-pointer transition ${selectedContact?.id === c.id ? "bg-[#4A9EFF40]" : "bg-[#ffffff15] hover:bg-[#ffffff25]"
                                        }`}
                                >
                                    <p className="font-semibold">{c.name}</p>
                                    {user?.role === "patient" && (
                                        <p className="text-sm text-gray-300">{(c as Doctor).specializations?.join?.(", ") || ""}</p>
                                    )}
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
