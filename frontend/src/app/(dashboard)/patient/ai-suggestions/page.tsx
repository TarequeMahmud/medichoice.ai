"use client";
import React, { useState } from "react";
import Markdown from "react-markdown";
import Spinner from "@/components/Spinner";
import Section from "@/components/Section";
import { axiosInstance } from "@/lib/axios";

const AISuggestionPage: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!prompt.trim()) return alert("Please enter a prompt.");

    setLoading(true);
    setResponse("");
    try {
      const res = await axiosInstance.post("/ai", {
        search_prompt: prompt,
      });
      setResponse(res.data.response);
    } catch (err: any) {
      console.error("Error:", err.message);
      setResponse("❌ Failed to fetch AI suggestion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section title="AI Suggestion">
      <p className="mb-6 text-center text-white">
        Ask the AI for ideas, insights, or suggestions.
      </p>

      {/* Prompt Box */}
      <div className="w-full max-w-3xl flex flex-col gap-3 bg-[#05050580] p-6 rounded-2xl shadow">
        <textarea
          className="border border-gray-300 rounded-lg w-full p-3 text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-400 bg-transparent"
          placeholder="Type your prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
        />

        <button
          onClick={analyze}
          className="bg-teal-500 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-teal-600 transition self-end"
        >
          Submit
        </button>
      </div>

      {/* Result Section */}
      <div className="w-full max-w-3xl mt-6 bg-[#05050580] p-6 rounded-2xl shadow min-h-[300px] overflow-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner />
          </div>
        ) : response ? (
          <div className="markdown text-white text-sm leading-relaxed space-y-2">
            <Markdown>{response}</Markdown>
          </div>
        ) : (
          <p className="text-gray-400 text-sm text-center">
            The AI response will appear here after you submit a prompt.
          </p>
        )}
      </div>

      <style jsx global>{`
        .markdown h1,
        .markdown h2,
        .markdown h3 {
          font-weight: bold;
          color: #ffffff;
          margin-top: 1rem;
        }
        .markdown p {
          margin-bottom: 0.5rem;
        }
        .markdown ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        .markdown ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
        }
        .markdown code {
          background-color: rgba(255, 255, 255, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
        }
        .markdown pre {
          background-color: rgba(255, 255, 255, 0.1);
          padding: 10px;
          border-radius: 6px;
          overflow-x: auto;
        }
      `}</style>
    </Section>
  );
};

export default AISuggestionPage;
