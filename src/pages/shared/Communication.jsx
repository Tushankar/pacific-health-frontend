import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Send,
  User,
  Search,
  Phone,
  MoreHorizontal,
  ArrowLeft,
  MessageSquare,
  CheckCheck,
  Loader2,
  Edit2,
  Trash2,
  X,
  MoreVertical,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import {
  getChatUsers,
  getMessageHistory,
  markAsRead,
} from "../../api/chat.api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const Communication = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [message, setMessage] = useState("");
  const [realtimeMessages, setRealtimeMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [activeMessageOptions, setActiveMessageOptions] = useState(null); // to track which message has options open
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    show: "below",
  });
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const dropdownRef = useRef(null);
  const queryClient = useQueryClient();

  const user = useMemo(
    () => JSON.parse(localStorage.getItem("user") || "{}"),
    [],
  );
  const token = localStorage.getItem("token");
  const isAdmin = user.role === "admin";

  // Fetch users/contacts
  const { data: contacts = [], isLoading: loadingContacts } = useQuery({
    queryKey: ["chatUsers"],
    queryFn: getChatUsers,
    retry: 1, // Minimize retries on failure to reduce noise
  });

  // Fetch message history when contact is selected
  const {
    data: history = [],
    isLoading: loadingHistory,
    isError: historyError,
  } = useQuery({
    queryKey: ["chatHistory", selectedContact?._id],
    queryFn: () => getMessageHistory(selectedContact?._id),
    enabled: !!selectedContact?._id,
    retry: 1,
  });

  // Combine history and real-time messages
  const allMessages = useMemo(() => {
    return [...history, ...realtimeMessages];
  }, [history, realtimeMessages]);

  const clearChatState = () => {
    setRealtimeMessages([]);
    setMessage("");
    setEditingMessageId(null);
    setActiveMessageOptions(null);
  };

  // Reset realtime messages when contact changes
  useEffect(() => {
    clearChatState();
  }, [selectedContact?._id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timer);
  }, [allMessages, selectedContact]);

  // Socket setup
  useEffect(() => {
    if (token) {
      const socket = io("http://localhost:5996", {
        auth: { token },
        transports: ["websocket", "polling"],
      });
      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("Connected to chat server");
      });

      socket.on("receive_message", (newMessage) => {
        const currentSelectedId = selectedContact?._id;
        const currentRoom = [user._id, currentSelectedId].sort().join("-");

        // 1. If message is for the currently selected chat
        if (newMessage.room === currentRoom) {
          setRealtimeMessages((prev) => [...prev, newMessage]);
          // Mark as read on backend if we're receiving it in active room
          if (newMessage.sender._id !== user._id) {
            markAsRead(newMessage.sender._id).catch(console.error);
          }
        }

        // 2. Update contacts list for sorting and unread count
        queryClient.setQueryData(["chatUsers"], (oldContacts = []) => {
          return oldContacts.map((c) => {
            const isTargetContact =
              c._id === newMessage.sender._id || c._id === newMessage.recipient;
            const isFromContact = c._id === newMessage.sender._id;

            if (isTargetContact) {
              return {
                ...c,
                lastMessage: {
                  content: newMessage.message,
                  createdAt: newMessage.createdAt,
                  sender: newMessage.sender._id,
                },
                unreadCount:
                  isFromContact && newMessage.room !== currentRoom
                    ? (c.unreadCount || 0) + 1
                    : c.unreadCount,
              };
            }
            return c;
          });
        });
      });

      socket.on("message_edited", (data) => {
        setRealtimeMessages((prev) =>
          prev.map((m) =>
            m._id === data._id
              ? { ...m, message: data.message, isEdited: true }
              : m,
          ),
        );
        queryClient.setQueryData(
          ["chatHistory", selectedContact?._id],
          (old = []) =>
            old.map((m) =>
              m._id === data._id
                ? { ...m, message: data.message, isEdited: true }
                : m,
            ),
        );
      });

      socket.on("message_deleted_everyone", (data) => {
        setRealtimeMessages((prev) =>
          prev.map((m) =>
            m._id === data._id ? { ...m, deletedForEveryone: true } : m,
          ),
        );
        queryClient.setQueryData(
          ["chatHistory", selectedContact?._id],
          (old = []) =>
            old.map((m) =>
              m._id === data._id ? { ...m, deletedForEveryone: true } : m,
            ),
        );
      });

      socket.on("message_deleted_me", (data) => {
        setRealtimeMessages((prev) =>
          prev.map((m) =>
            m._id === data.messageId ? { ...m, isDeletedForMe: true } : m,
          ),
        );
        queryClient.setQueryData(
          ["chatHistory", selectedContact?._id],
          (old = []) =>
            old.map((m) =>
              m._id === data.messageId ? { ...m, isDeletedForMe: true } : m,
            ),
        );
      });

      socket.on("messages_read", (data) => {
        setRealtimeMessages((prev) =>
          prev.map((m) =>
            m.sender?._id === data.readerId || m.sender === data.readerId
              ? m
              : { ...m, isRead: true },
          ),
        );
        queryClient.setQueryData(
          ["chatHistory", selectedContact?._id],
          (old = []) =>
            old.map((m) =>
              m.sender?._id === data.readerId || m.sender === data.readerId
                ? m
                : { ...m, isRead: true },
            ),
        );
      });

      socket.on("connect_error", (err) => {
        console.error("Socket Connection Error:", err.message);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [token, selectedContact?._id, user._id, queryClient]);

  // Mark as read when selecting contact
  useEffect(() => {
    if (selectedContact?._id) {
      markAsRead(selectedContact._id)
        .then(() => {
          // Update local cache to clear unread count
          queryClient.setQueryData(["chatUsers"], (oldContacts = []) => {
            return oldContacts.map((c) =>
              c._id === selectedContact._id ? { ...c, unreadCount: 0 } : c,
            );
          });

          if (socketRef.current) {
            socketRef.current.emit("mark_read", {
              senderId: selectedContact._id,
            });
          }
        })
        .catch(console.error);
    }
  }, [selectedContact?._id, queryClient]);

  // Join room when contact changes
  useEffect(() => {
    if (selectedContact && socketRef.current) {
      socketRef.current.emit("join_room", { otherUserId: selectedContact._id });
    }
  }, [selectedContact]);

  const handleSendMessage = () => {
    if (message.trim() && selectedContact && socketRef.current) {
      const messageToSend = message.trim();
      if (editingMessageId) {
        socketRef.current.emit("edit_message", {
          messageId: editingMessageId,
          newMessage: messageToSend,
        });
        setEditingMessageId(null);
      } else {
        socketRef.current.emit("send_message", {
          recipientId: selectedContact._id,
          message: messageToSend,
        });
      }
      setMessage("");
      setActiveMessageOptions(null);
    }
  };

  const cancelEdit = () => {
    setEditingMessageId(null);
    setMessage("");
  };

  const startEdit = (msg) => {
    setEditingMessageId(msg._id);
    setMessage(msg.message);
    setActiveMessageOptions(null);
  };

  const deleteForMe = (msgId) => {
    if (socketRef.current) {
      socketRef.current.emit("delete_message_me", { messageId: msgId });
    }
    setActiveMessageOptions(null);
  };

  const deleteForEveryone = (msgId) => {
    if (socketRef.current) {
      socketRef.current.emit("delete_message_everyone", { messageId: msgId });
    }
    setActiveMessageOptions(null);
  };

  const sortedContacts = useMemo(() => {
    return [...contacts].sort((a, b) => {
      const dateA = a.lastMessage?.createdAt
        ? new Date(a.lastMessage.createdAt)
        : new Date(0);
      const dateB = b.lastMessage?.createdAt
        ? new Date(b.lastMessage.createdAt)
        : new Date(0);
      return dateB - dateA;
    });
  }, [contacts]);

  const filteredContacts = sortedContacts.filter((c) =>
    c.fullName?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="h-[calc(100vh-87px)] bg-[#F4F7F9] p-4 md:p-6 lg:p-8 font-inter overflow-hidden flex flex-col">
      <div className="max-w-[1400px] w-full mx-auto h-full flex gap-6">
        {/* Left Sidebar - Contacts List */}
        <div
          className={`w-full md:w-[350px] lg:w-[400px] bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 flex flex-col overflow-hidden transition-all duration-300 ${selectedContact ? "hidden md:flex" : "flex"}`}
        >
          {/* Header & Search */}
          <div className="p-6 border-b border-slate-100 flex-shrink-0 bg-white z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/50 flex items-center justify-center text-blue-600 shadow-[2px_4px_12px_rgba(37,99,235,0.05)]">
                <MessageSquare size={22} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-[22px] font-black text-slate-800 tracking-tight leading-none">
                  Messages
                </h2>
                <p className="text-[12px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                  Team Communication
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search
                  size={16}
                  strokeWidth={2.5}
                  className="text-slate-400 group-focus-within:text-blue-500 transition-colors"
                />
              </div>
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100/80 rounded-xl pl-11 pr-4 py-3.5 text-[13px] font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] placeholder:text-slate-400 placeholder:font-semibold"
              />
            </div>
          </div>

          {/* Contacts List */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 custom-scrollbar">
            {loadingContacts ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400">
                <Loader2 className="animate-spin text-blue-500" size={24} />
                <span className="text-sm font-semibold tracking-wide">
                  Syncing chats...
                </span>
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <Search
                  size={32}
                  className="mb-3 opacity-30 text-slate-500"
                  strokeWidth={2}
                />
                <span className="text-sm font-semibold tracking-wide">
                  No conversations found
                </span>
              </div>
            ) : (
              filteredContacts.map((contact) => {
                const isSelected = selectedContact?._id === contact._id;
                // Generate Avatar URL using ui-avatars
                const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.fullName || "User")}&background=f1f5f9&color=475569&bold=true&size=128`;

                return (
                  <button
                    key={contact._id}
                    onClick={() => setSelectedContact(contact)}
                    className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300 text-left group border ${
                      isSelected
                        ? "bg-blue-50/80 border-blue-100/50 shadow-[0_4px_12px_rgba(37,99,235,0.06)] scale-[0.98]"
                        : "bg-transparent border-transparent hover:bg-slate-50 hover:border-slate-100/50"
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <div
                        className={`w-[46px] h-[46px] rounded-full overflow-hidden transition-all duration-300 shadow-sm ${isSelected ? "ring-2 ring-blue-500 ring-offset-2" : "group-hover:ring-2 group-hover:ring-slate-200 group-hover:ring-offset-1"}`}
                      >
                        {contact.profilePicture ? (
                          <img
                            src={`http://localhost:5996${contact.profilePicture}`}
                            alt={contact.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={avatarUrl}
                            alt={contact.fullName}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></div>
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex justify-between items-center mb-1">
                        <h3
                          className={`font-bold truncate text-[14px] tracking-tight transition-colors ${isSelected ? "text-blue-900" : "text-slate-800"}`}
                        >
                          {contact.fullName}
                        </h3>
                        {contact.lastMessage && (
                          <span
                            className={`text-[10px] whitespace-nowrap ml-2 font-bold uppercase tracking-widest ${contact.unreadCount > 0 ? "text-blue-600" : "text-slate-400"}`}
                          >
                            {new Date(
                              contact.lastMessage.createdAt,
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={`text-[12.5px] truncate font-semibold leading-snug tracking-wide ${isSelected ? "text-blue-700/80" : contact.unreadCount > 0 ? "text-slate-800 font-bold" : "text-slate-500"}`}
                        >
                          {contact.lastMessage
                            ? contact.lastMessage.content
                            : contact.role === "admin"
                              ? "Administrator"
                              : "Contact"}
                        </p>
                        {contact.unreadCount > 0 && (
                          <div className="flex-shrink-0 bg-blue-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[20px] text-center shadow-[0_2px_6px_rgba(37,99,235,0.3)]">
                            {contact.unreadCount > 99
                              ? "99+"
                              : contact.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Area - Chat Window */}
        <div
          className={`flex-1 bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 overflow-hidden flex flex-col transition-all duration-300 relative ${!selectedContact ? "hidden md:flex" : "flex"}`}
        >
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100 bg-white z-20 relative shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="md:hidden p-2 -ml-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-full transition-colors focus:ring-2 focus:ring-blue-500/20 outline-none"
                  >
                    <ArrowLeft size={20} strokeWidth={2.5} />
                  </button>

                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      <div className="w-[42px] h-[42px] rounded-full overflow-hidden shadow-sm border border-slate-100">
                        {selectedContact.profilePicture ? (
                          <img
                            src={`http://localhost:5996${selectedContact.profilePicture}`}
                            alt={selectedContact.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedContact.fullName || "User")}&background=2563eb&color=fff&bold=true&size=128`}
                            alt={selectedContact.fullName}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></div>
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800 tracking-tight leading-tight text-[16px]">
                        {selectedContact.fullName}
                      </h3>
                      <div className="flex items-center gap-1.5 opacity-90 mt-0.5">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_4px_rgba(16,185,129,0.5)]"></span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                          {selectedContact.role === "admin"
                            ? "Administrator"
                            : "Online"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-1.5">
                  <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl transition-all duration-300">
                    <Phone size={18} strokeWidth={2.5} />
                  </button>
                  <div className="w-px h-6 bg-slate-100 mx-1"></div>
                  <button className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50/80 rounded-xl transition-all duration-300">
                    <MoreHorizontal size={18} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* Chat Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/30 custom-scrollbar relative">
                {/* Optional subtle background pattern */}
                <div
                  className="absolute inset-0 opacity-[0.015] pointer-events-none"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 2px 2px, #0f172a 1px, transparent 0)",
                    backgroundSize: "16px 16px",
                  }}
                ></div>

                {loadingHistory ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400">
                    <Loader2 className="animate-spin text-blue-500" size={32} />
                    <span className="text-sm font-semibold tracking-wide">
                      Loading history...
                    </span>
                  </div>
                ) : allMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center max-w-sm mx-auto">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-5 shadow-[0_4px_20px_rgba(37,99,235,0.08)] transform -rotate-6">
                      <MessageSquare
                        size={28}
                        strokeWidth={2}
                        className="transform rotate-6"
                      />
                    </div>
                    <h3 className="text-[18px] font-black text-slate-800 tracking-tight mb-2">
                      Say Hello 👋
                    </h3>
                    <p className="text-slate-500 text-[13px] font-medium leading-relaxed">
                      It's quiet in here. Send a message to start the
                      conversation with {selectedContact.fullName.split(" ")[0]}
                      .
                    </p>
                  </div>
                ) : (
                  allMessages.map((msg, index) => {
                    const isMe =
                      msg.sender._id === user._id || msg.sender === user._id;
                    const isLastInGroup =
                      index === allMessages.length - 1 ||
                      (allMessages[index + 1] &&
                        (allMessages[index + 1].sender._id ||
                          allMessages[index + 1].sender) !==
                          (msg.sender._id || msg.sender));

                    return (
                      <div
                        key={msg._id || index}
                        className={`flex flex-col ${isMe ? "items-end" : "items-start"} w-full z-10 relative`}
                      >
                        <div
                          className={`flex items-center gap-2 max-w-[80%] lg:max-w-[65%] group ${isMe ? "flex-row-reverse" : "flex-row"}`}
                        >
                          <div
                            className={`px-5 py-3 shadow-[0_2px_10px_rgba(0,0,0,0.03)] relative
                              ${
                                isMe
                                  ? `bg-blue-600 text-white ${isLastInGroup ? "rounded-[20px] rounded-br-[4px]" : "rounded-[20px]"}`
                                  : `bg-white text-slate-800 border border-slate-100 ${isLastInGroup ? "rounded-[20px] rounded-bl-[4px]" : "rounded-[20px]"}`
                              }`}
                          >
                            {msg.deletedForEveryone ||
                            msg.isDeletedForMe ||
                            msg.deletedForMe?.includes(user._id) ? (
                              <p
                                className={`text-[14px] font-medium leading-[1.6] tracking-wide break-words whitespace-pre-wrap italic opacity-80 flex items-center gap-2 ${isMe ? "text-blue-200" : "text-slate-500"}`}
                              >
                                <Trash2 size={14} className="opacity-70" />{" "}
                                {isMe
                                  ? "You deleted this message"
                                  : "This message was deleted"}
                              </p>
                            ) : (
                              <p className="text-[14px] font-medium leading-[1.6] tracking-wide break-words whitespace-pre-wrap">
                                {msg.message}
                              </p>
                            )}

                            <div
                              className={`flex items-center gap-1.5 mt-1.5 ${isMe ? "justify-end text-blue-200" : "justify-start text-slate-400"}`}
                            >
                              <span className="text-[9.5px] font-bold tracking-widest uppercase">
                                {new Date(msg.createdAt).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
                              </span>
                              {msg.isEdited &&
                                !(
                                  msg.deletedForEveryone ||
                                  msg.isDeletedForMe ||
                                  msg.deletedForMe?.includes(user._id)
                                ) && (
                                  <span className="text-[9.5px] font-bold tracking-widest uppercase italic">
                                    (edited)
                                  </span>
                                )}
                              {isMe && (
                                <CheckCheck
                                  size={14}
                                  strokeWidth={2.5}
                                  className={`leading-none transition-colors ${msg.isRead ? "text-red-500" : "opacity-50 text-slate-400"}`}
                                />
                              )}
                            </div>
                          </div>

                          {/* Message Actions */}
                          {!msg.deletedForEveryone &&
                            !msg.isDeletedForMe &&
                            !msg.deletedForMe?.includes(user._id) && (
                              <div className="relative flex-shrink-0">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (activeMessageOptions === msg._id) {
                                      setActiveMessageOptions(null);
                                    } else {
                                      const buttonRect =
                                        e.currentTarget.getBoundingClientRect();
                                      const viewportHeight = window.innerHeight;
                                      const spaceBelow =
                                        viewportHeight - buttonRect.bottom;
                                      const dropdownHeight = 150; // Approximate dropdown height

                                      setDropdownPosition({
                                        top: buttonRect.top,
                                        left: isMe
                                          ? buttonRect.left - 180
                                          : buttonRect.right,
                                        show:
                                          spaceBelow > dropdownHeight
                                            ? "below"
                                            : "above",
                                      });
                                      setActiveMessageOptions(msg._id);
                                    }
                                  }}
                                  className={`p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all duration-200 ${activeMessageOptions === msg._id ? "opacity-100 bg-slate-100" : "opacity-0 group-hover:opacity-100"}`}
                                >
                                  <MoreVertical size={16} />
                                </button>
                              </div>
                            )}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} className="h-2" />
              </div>

              {/* Dropdown Menu (Fixed Position) */}
              {activeMessageOptions && (
                <>
                  <div
                    className="fixed inset-0 z-[100]"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMessageOptions(null);
                    }}
                  ></div>
                  <div
                    ref={dropdownRef}
                    style={{
                      position: "fixed",
                      top:
                        dropdownPosition.show === "below"
                          ? `${dropdownPosition.top + 30}px`
                          : `${dropdownPosition.top - 150}px`,
                      left: `${dropdownPosition.left}px`,
                      zIndex: 150,
                    }}
                    className="bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.18)] border border-slate-100/80 py-1.5 min-w-[180px]"
                  >
                    {(() => {
                      const msg = allMessages.find(
                        (m) => m._id === activeMessageOptions,
                      );
                      const isMyMessage =
                        msg &&
                        (msg.sender._id === user._id ||
                          msg.sender === user._id);
                      return (
                        <>
                          {isMyMessage && (
                            <>
                              <button
                                onClick={() => startEdit(msg)}
                                className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-slate-50 text-[13px] font-semibold text-slate-700 transition-colors text-left"
                              >
                                <Edit2 size={14} className="text-blue-500" />{" "}
                                Edit Message
                              </button>
                              <button
                                onClick={() => deleteForEveryone(msg._id)}
                                className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-slate-50 text-[13px] font-semibold text-red-600 transition-colors text-left"
                              >
                                <Trash2 size={14} /> Delete for everyone
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => deleteForMe(msg?._id)}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-slate-50 text-[13px] font-semibold text-slate-700 transition-colors text-left"
                          >
                            <X size={14} className="text-slate-500" /> Delete
                            for me
                          </button>
                        </>
                      );
                    })()}
                  </div>
                </>
              )}

              {/* Chat Input */}
              <div className="p-4 md:p-5 bg-white border-t border-slate-100/80 z-20 shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
                {editingMessageId && (
                  <div className="max-w-4xl mx-auto mb-3 px-4 py-2.5 bg-blue-50/50 rounded-[12px] border border-blue-100/50 flex flex-row items-center justify-between text-[13px] text-blue-800 font-semibold shadow-sm">
                    <div className="flex items-center gap-2">
                      <Edit2 size={15} className="text-blue-500" />
                      <span>Editing message...</span>
                    </div>
                    <button
                      onClick={cancelEdit}
                      className="p-1 hover:bg-blue-100 rounded-full text-blue-600 transition-colors"
                    >
                      <X size={15} />
                    </button>
                  </div>
                )}
                <div
                  className="flex items-end gap-3 max-w-4xl mx-auto bg-slate-50 p-1.5 rounded-[20px] border border-slate-200/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400/50 focus-within:bg-white transition-all cursor-text"
                  onClick={(e) => {
                    const textarea = e.currentTarget.querySelector("textarea");
                    if (textarea) textarea.focus();
                  }}
                >
                  <textarea
                    key={selectedContact?._id}
                    placeholder={
                      editingMessageId
                        ? "Edit your message..."
                        : "Type your message..."
                    }
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1 bg-transparent text-slate-800 placeholder:text-slate-400 px-4 py-3 text-[14px] font-medium focus:outline-none resize-none min-h-[44px] max-h-[120px] custom-scrollbar"
                    rows={1}
                  />

                  <div className="flex items-center gap-2 pb-1 pr-1">
                    <button
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white p-3 rounded-[14px] transition-all duration-300 shadow-[0_4px_12px_rgba(37,99,235,0.2)] disabled:shadow-none flex items-center justify-center transform active:scale-95 disabled:active:scale-100 group"
                    >
                      <Send
                        size={18}
                        strokeWidth={2.5}
                        className={`${message.trim() ? "group-hover:translate-x-0.5 group-hover:-translate-y-0.5" : ""} transition-transform duration-300`}
                      />
                    </button>
                  </div>
                </div>
                <div className="text-center mt-3 hidden lg:block">
                  <span className="text-[9.5px] uppercase font-bold tracking-widest text-slate-300">
                    Press <span className="text-slate-400">ENTER</span> to send,{" "}
                    <span className="text-slate-400">SHIFT+ENTER</span> for new
                    line
                  </span>
                </div>
              </div>
            </>
          ) : (
            // Empty State
            <div className="flex-1 flex items-center justify-center bg-slate-50/50 relative">
              <div
                className="absolute inset-0 opacity-[0.015] pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 2px 2px, #0f172a 1px, transparent 0)",
                  backgroundSize: "16px 16px",
                }}
              ></div>
              <div className="text-center max-w-sm px-6 animate-in fade-in duration-700 slide-in-from-bottom-4">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center text-blue-600">
                    <MessageSquare size={32} strokeWidth={2} />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">
                  Secure Messaging
                </h3>
                <p className="text-slate-500 text-[14px] font-medium leading-relaxed">
                  Select a conversation from the sidebar to chat, or start a new
                  conversation to connect with your contacts securely.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scrollbar hide style component for the chat area specifically if needed */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #94a3b8;
        }
      `,
        }}
      />
    </div>
  );
};

export default Communication;
