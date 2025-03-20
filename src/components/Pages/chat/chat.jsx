import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { motion } from "framer-motion";
import { Send, User } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useParams } from "react-router-dom";
import { FaRocketchat } from "react-icons/fa";

const Chat = () => {
  const { id } = useParams();
  const Roomid = decodeURIComponent(id);
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [user, setUser] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [typingUser, setTypingUser] = useState(null);
  const [showDelete, setShowDelete] = useState(null);

  const Token = sessionStorage.getItem("AccessToken");

  useEffect(() => {
    if (Token) {
      const decoded = jwtDecode(Token);
      setUser(decoded?.id || "Guest");
      setProfileImage(decoded?.id); // Assuming ID is an image URL
    } else {
      console.error("AccessToken not found");
    }

    const newSocket = io(import.meta.env.VITE_API_URL);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      newSocket.emit("joinRoom", Roomid);
      newSocket.on("previousMessages", (prevMessages) => {
        console.log(prevMessages);

        setChat(prevMessages);
      });

      newSocket.on("userTyping", (username) => {
        if (username !== user) setTypingUser(username);
      });

      newSocket.on("userStoppedTyping", () => {
        setTypingUser(null);
      });
    });

    newSocket.on("UpdatedMessages", (update) => {
      console.log("UpdatedMessages payload:", update);
      if (Array.isArray(update)) {
        setChat(update);
        setShowDelete(false);
      } else {
        console.error("Invalid payload for UpdatedMessages:", update);
      }
    });

    newSocket.on("receiveMessage", (data) => {
      console.log(data);
      setChat(data);
    });

    return () => {
      newSocket.emit("leaveRoom", Roomid);
      newSocket.disconnect();
    };
  }, [Roomid, Token]);

  const toggleDelete = (index, sender) => {
    if (sender == user) {
      setShowDelete((prev) => (prev === index ? null : index));
    }
  };

  const deleteMessage = (index, id) => {
    const data = { id: id, room: Roomid };
    socket.emit("deleteMessage", data);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === "") return;

    const newMessage = { text: message, sender: user, room: Roomid };
    if (socket) {
      socket.emit("sendMessage", newMessage);
      if (newMessage.sender != user) {
        setChat((prevChat) => [...prevChat, newMessage]);
      }

      setMessage("");
    }
  };

  const handleTyping = () => {
    if (socket) {
      socket.emit("typing", { room: Roomid, username: user });

      setTimeout(() => {
        socket.emit("stopTyping", { room: Roomid, username: user });
      }, 2000);
    }
  };

  return (
    <>
      <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="w-full max-w-lg h-[85vh] bg-white bg-opacity-20 backdrop-blur-lg shadow-2xl rounded-3xl flex flex-col overflow-hidden m-4">
          {/* Header with Background Image */}
          <div
            className="relative h-24 flex items-center justify-between p-4 text-white rounded-t-3xl"
            style={{
              backgroundImage: `url(${profileImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h2 className="flex items-center gap-2 font-bold text-xl bg-black bg-opacity-50 p-2 rounded-lg">
              <FaRocketchat /> Chat Room
            </h2>
            <div className="flex items-center gap-2 bg-black bg-opacity-50 p-2 rounded-lg">
              <User className="w-5 h-5 text-white" />
              <span className="text-sm">{user || "Not Connected"}</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
            {chat.map((msg, index) => {
              const date = msg.timestamp ? new Date(msg.timestamp) : new Date();
              const formattedTime = date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              });
              const formattedDate = date.toLocaleDateString();

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`relative flex ${
                    msg.sender === user ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-3 max-w-xs rounded-2xl shadow-md cursor-pointer 
          ${
            msg.sender === user
              ? "bg-blue-500 text-white"
              : "bg-gray-800 text-gray-300"
          }`}
                    onClick={() => toggleDelete(index, msg.sender)}
                  >
                    <span className="text-xs font-semibold text-gray-400 block">
                      {msg.sender === user ? "You" : msg.sender}
                    </span>
                    <p className="text-sm">{msg.text}</p>
                    <span className="text-xs text-gray-400 block text-right mt-1">
                      {formattedDate} - {formattedTime}
                    </span>
                  </div>

                  {/* Delete Button (Toggles on Click) */}
                  {showDelete === index && (
                    <motion.button
                      onClick={() => deleteMessage(index, msg._id)}
                      className="absolute  bg-white text-white p-1 rounded-full text-xs shadow-md"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      ❌
                    </motion.button>
                  )}
                </motion.div>
              );
            })}

            {typingUser && (
              <motion.div
                className="text-gray-300 flex items-center gap-1 self-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                {typingUser} is typing...
              </motion.div>
            )}
          </div>

          {/* Chat Input */}
          <form
            onSubmit={sendMessage}
            className="bg-white bg-opacity-10 p-3 flex items-center gap-3 rounded-b-3xl"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  handleTyping();
                }}
                placeholder="Type a message..."
                className="w-full p-3 pl-4 pr-12 border rounded-2xl focus:ring-2 focus:ring-white bg-white bg-opacity-20 text-black placeholder-gray-300 transition-all duration-200 focus:bg-opacity-30 outline-none"
              />
            </div>

            <button
              type="submit"
              className="p-3 rounded-full bg-blue-500 text-white transition-all duration-200 hover:bg-blue-400 hover:scale-110 focus:ring-2 focus:ring-blue-300"
            >
              <Send className="w-6 h-6" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Chat;
