"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, Sparkles } from "lucide-react";
import { io } from "socket.io-client";
import { API_URL, backendRequest } from "@/lib/backend";

export default function VenueChat({ venueId, venueName }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!venueId) return undefined;
    let active = true;
    const socket = io(API_URL, { transports: ["websocket", "polling"] });
    socketRef.current = socket;
    socket.on("connect", () => {
      setConnected(true);
      setError("");
      socket.emit("join-venue", venueId);
      backendRequest(`/api/venues/${venueId}/chat`)
        .then(({ messages: history }) => {
          if (active) {
            setMessages(history.map((message) => ({
              ...message,
              author: message.author === "Spotwise guest" ? "Guest" : message.author,
            })));
          }
        })
        .catch(() => {
          if (active) setError("Chat history is unavailable. Check that the backend and database are running.");
        })
        .finally(() => active && setLoading(false));
    });
    socket.on("disconnect", () => setConnected(false));
    socket.on("new-message", (message) => {
      if (message.venueId !== venueId) return;
      setMessages((current) => current.some((item) => item.id === message.id)
        ? current
        : [...current, { ...message, author: message.author === "Spotwise guest" ? "Guest" : message.author }]);
    });
    backendRequest(`/api/venues/${venueId}/chat`)
      .then(({ messages: history }) => {
        if (active) setMessages(history.map((message) => ({
          ...message,
          author: message.author === "Spotwise guest" ? "Guest" : message.author,
        })));
      })
      .catch(() => {
        if (active) setError("Chat history is unavailable. Check that the backend and database are running.");
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
      socketRef.current = null;
      socket.disconnect();
    };
  }, [venueId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending || text.length > 500) return;
    setSending(true);
    setError("");
    const socket = socketRef.current;
    if (!socket?.connected) {
      setError("Chat is disconnected. Reconnect before sending a message.");
      setSending(false);
      return;
    }
    socket.emit("send-message", { venueId, text }, (result) => {
      if (result?.error) setError(result.error);
      else setInput("");
      setSending(false);
    });
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
          {connected ? "Live" : "Connecting"}
        </span>
      </div>

      {/* Message List */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3.5 bg-[#FAF8F3]">
        {error && <p role="status" className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-800">{error}</p>}
        {loading ? (
          <p className="text-center text-xs text-[#555D50]">Loading chat history…</p>
        ) : messages.length === 0 ? (
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
          maxLength={500}
          disabled={!connected || sending}
          placeholder="Ask a question or report ambient noise..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-[#F5F3EC]/70 border border-[#E8E0D2] text-sm text-[#20231F] placeholder-[#555D50]/60 focus:outline-none focus:ring-2 focus:ring-[#819477]/40 focus:bg-white"
        />
        <button
          type="submit"
          disabled={!connected || sending || !input.trim()}
          className="p-2.5 rounded-xl bg-[#26382B] hover:bg-[#20231F] disabled:opacity-50 text-[#F5F3EC] transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#819477] cursor-pointer shrink-0"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
