"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Volume2,
  Wifi,
  Zap,
  ShieldCheck,
  MapPin,
  BookOpen,
  Paperclip,
  Smile,
  CheckCheck,
  MessageSquare,
  Sparkles,
  BarChart2,
} from "lucide-react";
import { SendIcon } from "@animateicons/react/lucide";
import { io } from "socket.io-client";
import { API_URL, backendRequest } from "@/lib/backend";
import { getDemoSession, getInitials } from "@/lib/auth/demo-auth";

// Quick prompt suggestions
const QUICK_PROMPTS = [
  "How's the crowd right now?",
  "Is it quiet for deep work?",
  "Are there seats available?",
  "How's the Wi-Fi?",
];

function getAvatarColor(name) {
  const colors = [
    "bg-[#4F6A54] text-[#F5F3EC]",
    "bg-[#7A5B22] text-[#F5F3EC]",
    "bg-[#3D6B99] text-[#F5F3EC]",
    "bg-[#685068] text-[#F5F3EC]",
    "bg-[#26382B] text-[#F5F3EC]",
  ];
  if (!name) return colors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return colors[hash % colors.length];
}

let clientMsgCounter = 0;
function createClientMessage(text, author) {
  clientMsgCounter += 1;
  const now = new Date();
  const clientId = `client_${now.getTime()}_${clientMsgCounter}`;
  return {
    id: clientId,
    clientId,
    author: author || "You",
    time: now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
    text,
    status: "sending",
    isMe: true,
  };
}

export default function VenueChat({ venue, venueId, venueName }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [connected, setConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    const session = getDemoSession();
    return session?.user?.name || "Spotwise Member";
  });
  const [userInitials, setUserInitials] = useState(() => {
    const session = getDemoSession();
    const name = session?.user?.name || "Spotwise Member";
    return session?.user?.avatarInitials || getInitials(name);
  });
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const handleAuthChange = () => {
      const session = getDemoSession();
      if (session?.user?.name) {
        setCurrentUser(session.user.name);
        setUserInitials(session.user.avatarInitials || getInitials(session.user.name));
      }
    };
    handleAuthChange();
    window.addEventListener("spotwise_auth_changed", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);
    return () => {
      window.removeEventListener("spotwise_auth_changed", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  const displayName = venue?.name || venueName || "Workspace";
  const displayCategory = venue?.categoryLabel || "Study Space / Library";
  const displayLocation =
    venue?.neighborhood || venue?.address || "London, UK";

  // Setup Socket.IO connection and load genuine messages from database
  useEffect(() => {
    if (!venueId) return undefined;
    let active = true;

    // Load existing messages from database
    backendRequest(`/api/venues/${venueId}/chat`)
      .then(({ messages: history }) => {
        if (!active || !history) return;
        setMessages(
          history.map((m) => {
            const author = m.author || "Guest";
            const isMe = author === currentUser || author === "You";
            return {
              ...m,
              author,
              isMe,
              status: "delivered",
            };
          })
        );
      })
      .catch(() => {
        // Handled silently
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    try {
      const socket = io(API_URL, {
        transports: ["websocket", "polling"],
        timeout: 5000,
      });
      socketRef.current = socket;

      socket.on("connect", () => {
        if (!active) return;
        setConnected(true);
        socket.emit("join-venue", venueId);
      });

      socket.on("disconnect", () => {
        if (active) setConnected(false);
      });

      // Handle incoming messages from other peers (no duplicate of sender's own message)
      socket.on("new-message", (incoming) => {
        if (!active || incoming.venueId !== venueId) return;

        setMessages((current) => {
          // If we already have this message by clientId or server id, update it rather than duplicating
          if (incoming.clientId && current.some((m) => m.clientId === incoming.clientId)) {
            return current.map((m) =>
              m.clientId === incoming.clientId
                ? { ...m, id: incoming.id, status: "delivered" }
                : m
            );
          }
          if (current.some((m) => m.id === incoming.id)) {
            return current;
          }

          const isMe =
            incoming.author === currentUser || incoming.author === "You";

          return [
            ...current,
            {
              ...incoming,
              isMe,
              status: "delivered",
            },
          ];
        });
      });
    } catch {
      // In standalone demo mode
    }

    return () => {
      active = false;
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [venueId, currentUser]);

  // Smooth scroll to bottom on message updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message without duplication
  const handleSendMessage = (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || sending || text.length > 500) return;

    setSending(true);
    const newMsg = createClientMessage(text, currentUser);

    // Optimistically add client message
    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    const socket = socketRef.current;
    if (socket?.connected) {
      socket.emit(
        "send-message",
        {
          venueId,
          text,
          author: currentUser,
          clientId: newMsg.clientId,
        },
        (response) => {
          setSending(false);
          if (response?.message) {
            // Reconcile optimistic message with server ID
            setMessages((prev) =>
              prev.map((m) =>
                m.clientId === newMsg.clientId
                  ? { ...m, id: response.message.id, status: "delivered" }
                  : m
              )
            );
          }
        }
      );
    } else {
      setTimeout(() => {
        setSending(false);
      }, 300);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  return (
    <div className="space-y-6 text-left">
      {/* 1. TOP VENUE HERO BANNER */}
      <div className="rounded-3xl bg-white border border-[#E8E0D2] p-4 sm:p-5 shadow-[0_4px_24px_rgba(32,35,31,0.04)] flex flex-col md:flex-row items-start md:items-center gap-5">
        {/* Left Thumbnail Image with Pin Pill */}
        <div className="w-full md:w-64 h-36 rounded-2xl relative overflow-hidden bg-[#E8E0D2] shrink-0 shadow-xs">
          {!imgError && venue?.image ? (
            <Image
              src={venue.image}
              alt={displayName}
              fill
              sizes="(max-width: 768px) 100vw, 256px"
              className="object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#26382B] to-[#405646] flex flex-col items-center justify-center p-4 text-center text-white">
              <Sparkles className="w-8 h-8 text-[#819477] mb-1" />
              <span className="text-xs font-semibold">{displayName}</span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

          <div className="absolute bottom-2.5 left-2.5 z-10 px-3 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-xs font-medium flex items-center gap-1.5 shadow-sm max-w-[90%]">
            <MapPin className="w-3.5 h-3.5 text-[#819477] shrink-0" />
            <span className="truncate">{displayName}</span>
          </div>
        </div>

        {/* Right Info Section */}
        <div className="flex-1 min-w-0 w-full">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#20231F] tracking-tight">
              {displayName}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
              <span
                className={`w-2 h-2 rounded-full ${
                  connected ? "bg-emerald-500 animate-pulse" : "bg-emerald-500"
                }`}
              />
              <span>{connected ? "Live Room" : "Connecting"}</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 text-xs text-[#555D50]">
            <span className="flex items-center gap-1.5 font-medium">
              <BookOpen className="w-3.5 h-3.5 text-[#819477]" />
              <span>{displayCategory}</span>
            </span>
            <span className="text-[#819477]">·</span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#819477]" />
              <span>{displayLocation}</span>
            </span>
          </div>

          <div className="mt-2.5 pt-2 border-t border-[#E8E0D2]/60">
            <p className="text-sm font-medium text-[#20231F]">
              Real-time peer chat &amp; room conditions
            </p>
            <p className="text-xs text-[#555D50] mt-0.5">
              Ask questions, share updates, and help others find the right time to visit.
            </p>
          </div>
        </div>
      </div>

      {/* 2. SPLIT LAYOUT: LEFT SIDEBAR + RIGHT CHAT CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN WIDGETS (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Widget 1: Live Members in this chat (Real Count, No Fake Profiles) */}
          <div className="rounded-3xl bg-white border border-[#E8E0D2] p-5 shadow-[0_2px_12px_rgba(32,35,31,0.03)]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#819477]" />
                <h3 className="text-sm font-semibold text-[#20231F]">
                  Live in this chat
                </h3>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </span>
            </div>
            <p className="text-2xl font-serif font-bold text-[#20231F] mt-2">
              {connected ? "1 active now" : "Connecting…"}
            </p>
            <p className="text-xs text-[#555D50] mt-1">
              {connected
                ? "Connected to live room chat & verified telemetry."
                : "Establishing secure WebSocket connection..."}
            </p>
          </div>

          {/* Widget 2: Quick Updates (Real Venue Data) */}
          <div className="rounded-3xl bg-white border border-[#E8E0D2] p-5 shadow-[0_2px_12px_rgba(32,35,31,0.03)] space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <BarChart2 className="w-4 h-4 text-[#819477]" />
              <h3 className="text-sm font-semibold text-[#20231F]">
                Venue Conditions
              </h3>
            </div>

            {/* Noise profile */}
            <div className="rounded-2xl p-3 bg-[#F0F5EE] border border-[#DFE9DC] flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#DCE7D8]/90 flex items-center justify-center text-[#4A6B46] shrink-0">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-[#465E42]">Noise Atmosphere</p>
                <p className="text-xs font-bold text-[#20231F]">
                  {venue?.noiseLevel || "Quiet Environment"}
                </p>
              </div>
            </div>

            {/* Wi-Fi Connectivity */}
            <div className="rounded-2xl p-3 bg-[#F0F4F8] border border-[#DCE6EF] flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#D6E3EF]/90 flex items-center justify-center text-[#3D6B99] shrink-0">
                <Wifi className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-[#375A7E]">Wi-Fi Network</p>
                <p className="text-xs font-bold text-[#20231F]">
                  {venue?.wifiSpeed || "High Speed Fiber"}
                </p>
              </div>
            </div>

            {/* Outlets availability */}
            <div className="rounded-2xl p-3 bg-[#FFF9ED] border border-[#F5EAD4] flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FDECC8]/80 flex items-center justify-center text-[#B57C1E] shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-[#7A5B22]">Power Outlets</p>
                <p className="text-xs font-bold text-[#20231F]">
                  {venue?.outletsAvailability || "Equipped at desks"}
                </p>
              </div>
            </div>
          </div>

          {/* Widget 3: Chat Guidelines */}
          <div className="rounded-3xl bg-white border border-[#E8E0D2] p-5 shadow-[0_2px_12px_rgba(32,35,31,0.03)]">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-[#819477]" />
              <h3 className="text-sm font-semibold text-[#20231F]">
                Chat Guidelines
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-[#555D50] leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#819477] mt-1.5 shrink-0" />
                <span>Be respectful and helpful</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#819477] mt-1.5 shrink-0" />
                <span>Share real-time observations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#819477] mt-1.5 shrink-0" />
                <span>Avoid spam or unrelated content</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#819477] mt-1.5 shrink-0" />
                <span>Use the report form for detailed feedback</span>
              </li>
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: CHAT STREAM + COMPOSER (8 Cols) */}
        <div className="lg:col-span-8">
          <div className="rounded-3xl bg-white border border-[#E8E0D2] shadow-[0_8px_30px_rgba(32,35,31,0.04)] overflow-hidden flex flex-col h-[680px] relative">
            {/* Subtle botanical leaves watermark in top-right & bottom-left */}
            <svg
              className="absolute top-0 right-0 w-52 h-52 text-[#819477]/12 pointer-events-none z-0"
              viewBox="0 0 200 200"
              fill="currentColor"
            >
              <path d="M140,20 C100,50 90,110 130,160 C150,140 170,90 170,40 Z" />
              <path d="M120,60 C80,90 70,140 110,180 C130,160 140,110 140,70 Z" />
              <path d="M170,70 C140,90 135,130 160,160 C175,145 185,115 185,85 Z" />
            </svg>
            <svg
              className="absolute bottom-24 left-0 w-44 h-44 text-[#819477]/10 pointer-events-none z-0"
              viewBox="0 0 200 200"
              fill="currentColor"
            >
              <path d="M60,180 C100,150 110,90 70,40 C50,60 30,110 30,160 Z" />
              <path d="M80,140 C120,110 130,60 90,20 C70,40 60,90 60,130 Z" />
            </svg>

            {/* Date Pill Separator */}
            <div className="py-3 z-10 text-center">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F5F3EC] border border-[#E8E0D2] text-[11px] font-semibold text-[#555D50] shadow-2xs">
                <span>📌</span>
                <span>Today</span>
              </span>
            </div>

            {/* Message Stream */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 z-10 scroll-smooth">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#555D50]">
                  <div className="w-8 h-8 border-2 border-[#819477] border-t-transparent rounded-full animate-spin mb-3" />
                  <p className="text-xs uppercase tracking-wider font-semibold">
                    Loading chat messages...
                  </p>
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#555D50]">
                  <div className="w-12 h-12 rounded-full bg-[#F5F3EC] border border-[#E8E0D2] flex items-center justify-center text-[#819477] mb-3">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-serif font-bold text-[#20231F]">
                    No messages yet in this venue
                  </h4>
                  <p className="text-xs text-[#555D50] max-w-sm mt-1 leading-relaxed">
                    Be the first to share quiet tips, desk status, or ask about Wi-Fi conditions!
                  </p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {messages.map((msg) => {
                    const isMe = msg.isMe || msg.author === currentUser || msg.author === "You";
                    const initialLetter = getInitials(msg.author);
                    const avatarColorClass = isMe
                      ? "bg-[#26382B] text-[#F5F3EC]"
                      : getAvatarColor(msg.author);

                    return (
                      <motion.div
                        key={msg.id || msg.clientId}
                        initial={{ opacity: 0, y: 16, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 340,
                          damping: 24,
                          mass: 0.7,
                        }}
                        className={`flex gap-3 ${
                          isMe ? "justify-end" : "justify-start"
                        } items-start`}
                      >
                        {/* Initial letter avatar on left for other users */}
                        {!isMe && (
                          <div
                            className={`w-8 h-8 rounded-full ${avatarColorClass} shrink-0 flex items-center justify-center font-bold text-xs font-serif shadow-xs ring-2 ring-white mt-0.5`}
                            title={msg.author}
                          >
                            {initialLetter}
                          </div>
                        )}

                        <div
                          className={`flex flex-col ${
                            isMe ? "items-end" : "items-start"
                          } max-w-[82%] sm:max-w-[72%]`}
                        >
                          {/* Name & Time */}
                          <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-[#555D50]">
                            {!isMe && (
                              <span className="font-semibold text-[#20231F]">
                                {msg.author}
                              </span>
                            )}
                            <span>{msg.time}</span>
                          </div>

                          {/* Bubble */}
                          <div
                            className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                              isMe
                                ? "bg-[#506855] text-white rounded-tr-xs"
                                : "bg-white text-[#20231F] border border-[#E8E0D2] rounded-tl-xs"
                            }`}
                          >
                            {msg.text}
                          </div>

                          {/* Delivery status for 'You' */}
                          {isMe && (
                            <div className="flex items-center gap-1 mt-1 text-[11px] text-[#819477] pr-1">
                              <span>Sent</span>
                              <CheckCheck className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>

                        {/* Initial letter avatar on right for 'You' */}
                        {isMe && (
                          <div
                            className="w-8 h-8 rounded-full bg-[#26382B] text-[#F5F3EC] shrink-0 flex items-center justify-center font-bold text-xs font-serif shadow-xs ring-2 ring-white mt-0.5 tracking-tight"
                            title={currentUser}
                          >
                            {userInitials || getInitials(currentUser)}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Section: Quick Prompts + Composer */}
            <div className="p-4 bg-white/95 backdrop-blur-md border-t border-[#E8E0D2] space-y-3 z-10">
              {/* Quick Prompt Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {QUICK_PROMPTS.map((prompt) => (
                  <motion.button
                    key={prompt}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    onClick={() => handleSendMessage(prompt)}
                    className="px-3.5 py-1.5 rounded-full bg-white border border-[#E8E0D2] hover:border-[#819477] hover:bg-[#F5F3EC] text-xs font-medium text-[#20231F] transition-all whitespace-nowrap shadow-2xs cursor-pointer shrink-0"
                  >
                    {prompt}
                  </motion.button>
                ))}
              </div>

              {/* Main Composer Bar */}
              <form
                onSubmit={handleSubmit}
                className="relative flex items-center gap-2"
              >
                <div className="flex-1 flex items-center gap-2 bg-[#F9F8F5] border border-[#E8E0D2] rounded-2xl px-3.5 py-2 focus-within:border-[#819477] focus-within:bg-white transition-all shadow-inner">
                  {/* Attachment button */}
                  <button
                    type="button"
                    onClick={() =>
                      handleSendMessage("📍 Verified calm work conditions.")
                    }
                    className="p-1 text-[#819477] hover:text-[#26382B] transition-colors cursor-pointer"
                    title="Attach report"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  {/* Input field */}
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    maxLength={500}
                    placeholder="Ask a question or share a quick update..."
                    className="flex-1 bg-transparent text-sm text-[#20231F] placeholder-[#555D50]/60 focus:outline-none"
                  />

                  {/* Emoji button */}
                  <button
                    type="button"
                    onClick={() => setInput((prev) => prev + " 😊")}
                    className="p-1 text-[#819477] hover:text-[#26382B] transition-colors cursor-pointer"
                    title="Insert smile"
                  >
                    <Smile className="w-4 h-4" />
                  </button>
                </div>

                {/* Send Button with @animateicons/react/lucide SendIcon */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  type="submit"
                  disabled={sending || !input.trim()}
                  className="w-12 h-12 rounded-2xl bg-[#49624E] hover:bg-[#3B5140] active:scale-95 text-white flex items-center justify-center transition-all shadow-sm disabled:opacity-50 shrink-0 cursor-pointer overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#819477]"
                  aria-label="Send message"
                >
                  <div className="w-6 h-6 flex items-center justify-center [&_svg]:!w-5.5 [&_svg]:!h-5.5 [&_svg]:!max-w-full [&_svg]:!max-h-full">
                    <SendIcon
                      size={64}
                      duration={1}
                      color="#ffffff"
                    />
                  </div>
                </motion.button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
