"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, Sparkles } from "lucide-react";
import { getVenueChatMessages, sendVenueChatMessage } from "@/lib/discovery/venue-data";

export default function VenueChat({ venueId, venueName }) {
  const [messages, setMessages] = useState(() =>
    venueId ? getVenueChatMessages(venueId) : []
  );
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = sendVenueChatMessage(venueId, input.trim(), "You");
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
  };

  return (
    <div className="rounded-3xl bg-white border border-[#E8E0D2] overflow-hidden shadow-[0_4px_24px_rgba(32,35,31,0.04)] flex flex-col h-[520px] text-left">
      {/* Header */}
      <div className="p-4 sm:p-5 bg-white border-b border-[#E8E0D2] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#26382B] flex items-center justify-center text-[#F5F3EC]">
            <MessageSquare className="w-4 h-4 text-[#F5F3EC]" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-serif font-bold text-[#20231F]">
              {venueName} Channel
            </h3>
            <p className="text-[11px] text-[#555D50]">
              Real-time peer chat &amp; live room conditions
            </p>
          </div>
        </div>

        <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#F5F3EC] text-[#819477] border border-[#E8E0D2]">
          Local Demo Chat
        </span>
      </div>

      {/* Message List */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3.5 bg-[#FAF8F3]">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#555D50]">
            <Sparkles className="w-8 h-8 text-[#819477] mb-2" />
            <p className="text-sm font-semibold">No messages yet in this venue</p>
            <p className="text-xs mt-1">Be the first to share quiet tips or desk status!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.author === "You";
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-[#555D50]">
                  <span className="font-semibold text-[#20231F]">{msg.author}</span>
                  {msg.role && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-white border border-[#E8E0D2] text-[#819477]">
                      {msg.role}
                    </span>
                  )}
                  <span>·</span>
                  <span>{msg.time}</span>
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isMe
                      ? "bg-[#26382B] text-[#F5F3EC] rounded-tr-xs shadow-xs"
                      : "bg-white text-[#20231F] border border-[#E8E0D2] rounded-tl-xs shadow-xs"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={handleSend}
        className="p-3 sm:p-4 bg-white border-t border-[#E8E0D2] flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question or report ambient noise..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-[#F5F3EC]/70 border border-[#E8E0D2] text-sm text-[#20231F] placeholder-[#555D50]/60 focus:outline-none focus:ring-2 focus:ring-[#819477]/40 focus:bg-white"
        />
        <button
          type="submit"
          className="p-2.5 rounded-xl bg-[#26382B] hover:bg-[#20231F] text-[#F5F3EC] transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#819477] cursor-pointer shrink-0"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
