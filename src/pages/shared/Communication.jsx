import React, { useState, useEffect, useRef } from "react";
import { Send, User, Search, Phone, MoreHorizontal, Loader2, ArrowLeft } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import { getChatUsers, getMessageHistory, markAsRead } from "../../api/chat.api";
import { toast } from "sonner";

const Communication = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [message, setMessage] = useState("");
  const [realtimeMessages, setRealtimeMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

  const user = React.useMemo(() => JSON.parse(localStorage.getItem("user") || "{}"), []);
  const token = localStorage.getItem("token");
  const isAdmin = user.role === "admin";

  // Fetch users/contacts
  const { data: contacts = [], isLoading: loadingContacts } = useQuery({
    queryKey: ["chatUsers"],
    queryFn: getChatUsers,
    retry: 1, // Minimize retries on failure to reduce noise
  });

  // Fetch message history when contact is selected
  const { data: history = [], isLoading: loadingHistory, isError: historyError } = useQuery({
    queryKey: ["chatHistory", selectedContact?._id],
    queryFn: () => getMessageHistory(selectedContact?._id),
    enabled: !!selectedContact?._id,
    retry: 1,
  });

  // Combine history and real-time messages
  const allMessages = React.useMemo(() => {
    // If contact changed, we should probably clear realtimeMessages or filter them
    // But since join_room and setRealtimeMessages are handled below, 
    // we'll just concat for now.
    return [...history, ...realtimeMessages];
  }, [history, realtimeMessages]);

  const clearChatState = () => {
    setRealtimeMessages([]);
  };

  // Reset realtime messages when contact changes
  useEffect(() => {
    clearChatState();
  }, [selectedContact?._id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages, selectedContact]);

  // Socket setup
  useEffect(() => {
    if (token) {
      const socket = io("http://localhost:5000", {
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
          return oldContacts.map(c => {
            const isTargetContact = (c._id === newMessage.sender._id || c._id === newMessage.recipient);
            const isFromContact = c._id === newMessage.sender._id;
            
            if (isTargetContact) {
              return {
                ...c,
                lastMessage: {
                  content: newMessage.message,
                  createdAt: newMessage.createdAt,
                  sender: newMessage.sender._id
                },
                unreadCount: (isFromContact && newMessage.room !== currentRoom) 
                  ? (c.unreadCount || 0) + 1 
                  : c.unreadCount
              };
            }
            return c;
          });
        });
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
            return oldContacts.map(c => 
              c._id === selectedContact._id ? { ...c, unreadCount: 0 } : c
            );
          });
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
      socketRef.current.emit("send_message", {
        recipientId: selectedContact._id,
        message: message.trim(),
      });
      setMessage("");
    }
  };

  const sortedContacts = React.useMemo(() => {
    return [...contacts].sort((a, b) => {
      const dateA = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt) : new Date(0);
      const dateB = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt) : new Date(0);
      return dateB - dateA;
    });
  }, [contacts]);

  const filteredContacts = sortedContacts.filter((c) =>
    c.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-full bg-gray-50 border border-gray-200 overflow-hidden rounded-xl">
      {/* Sidebar - Contacts List */}
      <div className={`w-full md:w-1/3 bg-white md:border-r border-gray-200 flex flex-col ${selectedContact ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 bg-blue-800 text-white">
          <h2 className="text-xl font-semibold mb-4">Communications</h2>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search contacts"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white text-gray-900 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map((contact) => (
            <div
              key={contact._id}
              onClick={() => setSelectedContact(contact)}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-blue-50 cursor-pointer ${
                selectedContact?._id === contact._id ? "bg-blue-50" : ""
              }`}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <User size={24} className="text-gray-600" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-green-500"></div>
              </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center mb-0.5">
                    <h3 className="font-medium text-gray-900 truncate">{contact.fullName}</h3>
                    {contact.unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                        {contact.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500 truncate flex-1">
                      {contact.lastMessage ? contact.lastMessage.content : contact.role}
                    </p>
                    {contact.lastMessage && (
                      <span className="text-[10px] text-gray-400 ml-2 whitespace-nowrap">
                        {new Date(contact.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`w-full md:flex-1 flex flex-col ${!selectedContact ? 'hidden md:flex' : 'flex'}`}>
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="bg-blue-800 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setSelectedContact(null)}
                  className="md:hidden mr-1 p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <User size={20} className="text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium text-white">{selectedContact.fullName}</h3>
                  <p className="text-xs opacity-80">{selectedContact.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-white">
                <button className="hover:bg-white/10 p-2 rounded-full transition-colors">
                  <Phone size={20} />
                </button>
                <button className="hover:bg-white/10 p-2 rounded-full transition-colors">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {allMessages.map((msg, index) => {
                const isMe = msg.sender._id === user._id || msg.sender === user._id;
                return (
                  <div
                    key={msg._id || index}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        isMe
                          ? "bg-blue-800 text-white"
                          : "bg-white text-gray-900 border"
                      }`}
                    >
                      <p className="text-sm shadow-none">{msg.message}</p>
                      <p
                        className={`text-[10px] mt-1 ${isMe ? "text-blue-100 text-right" : "text-gray-500 focus:text-left"}`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-3">
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 bg-gray-100 text-gray-900 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="bg-blue-800 hover:bg-blue-900 disabled:bg-gray-400 text-white p-2 rounded-full transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <User size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a contact to start communicating
              </h3>
              <p className="text-gray-500">
                Choose a contact from the sidebar to begin your conversation.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Add MessageSquare to imports
const MessageSquare = ({ size }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

export default Communication;
