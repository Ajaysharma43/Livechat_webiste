import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { motion } from "framer-motion";
import { Send, User } from "lucide-react";

const Chat = () => {
    const socket = io(`${import.meta.env.VITE_SOCKET_URL}`); // Connect to the backend
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const [typing, setTyping] = useState(null);
    const [user, setUser] = useState("");
    const chatContainerRef = useRef(null);
    let typingTimeout;

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected to server:", socket.id);
            setUser(`User_${Date.now()}`);
        });

        socket.on("userTyping", (username) => {
            if (username !== user) {
                setTyping(username);
            }
        });

        socket.on("userStoppedTyping", () => {
            setTyping(null);
        });

        socket.on("receiveMessage", (data) => {
            if (data.sender !== user) {
                setChat((prevChat) => [...prevChat, data]);
            }
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from server");
        });

        return () => {
            socket.off("connect");
            socket.off("receiveMessage");
            socket.off("disconnect");
            socket.off("userTyping");
            socket.off("userStoppedTyping");
        };
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chat, typing]);

    const handleTyping = () => {
        socket.emit("typing", user);
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            socket.emit("stopTyping", user);
            setTyping(null);
        }, 2000);
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (message.trim() === "") return;

        const newMessage = { text: message, sender: user };
        socket.emit("sendMessage", newMessage);
        if(newMessage.sender != user)
        {
            setChat((prevChat) => [...prevChat, newMessage]);
        }
        setMessage("");
    };

    return (
        <div className="max-w-lg mx-auto p-4 bg-gray-100 rounded-lg shadow-lg h-[80vh] flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between bg-blue-600 text-white p-3 rounded-t-lg">
                <h2 className="text-lg font-bold">Live Chat</h2>
                <div className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    <span className="text-sm">{user}</span>
                </div>
            </div>

            {/* Chat Messages */}
            <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto bg-white p-3 border rounded-lg flex flex-col space-y-2"
            >
                {chat.map((msg, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`max-w-[70%] p-3 rounded-lg ${
                            msg.sender === user
                                ? "bg-blue-500 text-white self-end"
                                : "bg-gray-300 text-black self-start"
                        }`}
                    >
                        <span className="text-sm font-semibold">
                            {msg.sender === user ? "You" : msg.sender}
                        </span>
                        <p>{msg.text}</p>
                    </motion.div>
                ))}

                {/* Typing Indicator */}
                {typing && (
                    <motion.div
                        className="text-gray-500 flex items-center gap-1 self-start"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ repeat: Infinity, duration: 1 }}
                    >
                        {typing} is typing
                        <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }}>
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
                    className="flex-1 p-2 border rounded-lg focus:outline-none"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-2 flex items-center gap-1 hover:bg-blue-600 transition"
                >
                    <Send className="w-4 h-4" />
                </button>
            </form>
        </div>
    );
};

export default Chat;
