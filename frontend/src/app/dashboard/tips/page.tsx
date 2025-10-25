"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Section from "@/components/Section";
import { axiosInstance } from "@/lib/axios";
import { Loader2 } from "lucide-react";

interface Tip {
    id: string;
    content: string;
    category?: string;
    createdAt?: string;
}

const TipsPage: React.FC = () => {
    const [tip, setTip] = useState<Tip | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchRandomTip = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/tips/random");
            setTip(res.data);
        } catch (err) {
            console.error("Failed to load tip:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRandomTip();
    }, []);

    return (
        <Section title="Health Tips">
            <div className="relative w-[70%] mx-auto flex flex-col gap-6 bg-[#05050580] rounded-[25px] p-6 shadow-lg backdrop-blur-md border border-white/10 text-white">
                <Card className="bg-[#D9D9D952] border-none rounded-[20px] shadow-lg overflow-hidden">
                    <CardHeader className="border-b border-white/20">
                        <CardTitle className="text-2xl font-semibold text-white">
                            {tip?.category ? `Tip on ${tip.category}` : "Health Tip for you today"}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="p-6 min-h-[150px] flex flex-col justify-center items-center text-center">
                        {loading ? (
                            <Loader2 className="animate-spin text-white w-6 h-6" />
                        ) : tip ? (
                            <p className="text-lg text-white/90 leading-relaxed">{tip.content}</p>
                        ) : (
                            <p className="text-white/60">No tip available right now. Try again!</p>
                        )}
                    </CardContent>
                </Card>

                <div className="flex justify-center mt-2">
                    <Button
                        onClick={fetchRandomTip}
                        disabled={loading}
                        className="rounded-xl px-6 py-2 bg-[#4A9EFF] hover:bg-[#3C89E2] text-white transition"
                    >
                        {loading ? "Loading..." : "New Tip"}
                    </Button>
                </div>
            </div>
        </Section>
    );
};

export default TipsPage;
