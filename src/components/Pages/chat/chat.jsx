import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { motion } from "framer-motion";
import { Send, User } from "lucide-react";
import {jwtDecode} from "jwt-decode";

const Chat = () => {
    const socketRef = useRef();
    const typingTimeoutRef = useRef();
    const chatContainerRef = useRef(null);

    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const [typing, setTyping] = useState(null);
    const [user, setUser] = useState("");

    const Token = sessionStorage.getItem("AccessToken");
    let decoded;
    if (Token) {
        decoded = jwtDecode(Token);
    } else {
        console.error("AccessToken not found");
    }

    useEffect(() => {
        socketRef.current = io(`${import.meta.env.VITE_API_URL}`);

        socketRef.current.on("connect", () => {
            console.log("Connected to server:", socketRef.current.id);
            setUser(decoded?.id || "Guest");
        });

        socketRef.current.on("previousMessages", (prevMessages) => {
          setChat(prevMessages);
      });

        socketRef.current.on("userTyping", (username) => {
            if (username !== user) {
                setTyping(username);
            }
        });

        socketRef.current.on("userStoppedTyping", () => {
            setTyping(null);
        });

        socketRef.current.on("receiveMessage", (data) => {
            if (data.sender !== user) {
                setChat((prevChat) => [...prevChat, data]);
            }
        });

        socketRef.current.on("disconnect", () => {
            console.log("Disconnected from server");
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [user]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
                chatContainerRef.current.scrollHeight;
        }
    }, [chat, typing]);

    const handleTyping = () => {
        socketRef.current.emit("typing", user);
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socketRef.current.emit("stopTyping", user);
            setTyping(null);
        }, 2000);
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (message.trim() === "") return;

        const newMessage = { text: message, sender: user };
        socketRef.current.emit("sendMessage", newMessage);
        setChat((prevChat) => [...prevChat, newMessage]);
        setMessage("");
    };

    return (
        <div className="max-w-lg mx-auto p-4 bg-gradient-to-br from-gray-400 via-gray-600 to-gray-800 rounded-2xl shadow-xl h-[80vh] flex flex-col border border-gray-700">
            {/* Chat Header */}
            <div className="flex items-center justify-between bg-transparent text-white p-4 rounded-t-2xl border-b border-gray-700">
                <h2 className="text-lg font-semibold">Live Chat</h2>
                <div className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    <span className="text-sm">{user ? user : "Not Connected"}</span>
                </div>
            </div>

            {/* Chat Messages */}
            <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto bg-white p-3 border-x border-gray-700 rounded-b-2xl flex flex-col space-y-2"
            >
                {chat.map((msg, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-2 items-center max-w-[70%] p-3 rounded-lg shadow-md border border-gray-700 ${
                            msg.sender === user
                                ? "bg-gradient-to-r from-gray-700 to-gray-800 text-white self-end"
                                : "bg-gray-900 text-gray-300 self-start"
                        }`}
                    >
                        <span className="text-xs font-semibold text-gray-400">
                            {msg.sender === user ? "You" : msg.sender}
                        </span>
                        <p className="text-sm">{msg.text}</p>
                    </motion.div>
                ))}

                {typing && typing !== user && (
                    <motion.div
                        className="text-gray-500 flex items-center gap-1 self-start"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ repeat: Infinity, duration: 1 }}
                    >
                        {typing} is typing
                        <motion.span
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                        >
                            ...
                        </motion.span>
                    </motion.div>
                )}
            </div>

            {/* Chat Input */}
            <form onSubmit={sendMessage} className="mt-3 flex items-center">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value);
                        handleTyping();
                    }}
                    placeholder="Type a message..."
                    className="flex-1 p-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <button
                    type="submit"
                    className="bg-white text-black px-4 py-2 rounded-lg ml-2 flex items-center gap-1 hover:from-gray-600 hover:to-gray-700 transition"
                >
                    <Send className="w-7 h-7" />
                </button>
            </form>
        </div>
    );
};

export default Chat;