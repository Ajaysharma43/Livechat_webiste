import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { motion } from "framer-motion";
import { Send, User } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useParams } from "react-router-dom";

const Chat = () => {
  const { id } = useParams();
  const Roomid = decodeURIComponent(id); // Use the image ID as the room ID
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [user, setUser] = useState("");
  const [typingUser, setTypingUser] = useState(null);

  const Token = sessionStorage.getItem("AccessToken");
  let decoded;
  if (Token) {
    decoded = jwtDecode(Token);
  } else {
    console.error("AccessToken not found");
  }

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_URL);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to server:", newSocket.id);
      setUser(decoded?.id || "Guest");

      newSocket.on("userTyping", (username) => {
        if (username !== user) setTypingUser(username);
      });
  
      newSocket.on("userStoppedTyping", () => {
        setTypingUser(null);
      });

      // Join the room
      newSocket.emit("joinRoom", Roomid);

      // Load previous messages
      newSocket.on("previousMessages", (prevMessages) => {
        setChat(prevMessages);
      });
    });

    newSocket.on("receiveMessage", (data) => {
      setChat((prevChat) => [...prevChat, data]);
    });

    return () => {
      newSocket.emit("leaveRoom", Roomid);
      newSocket.disconnect();
    };
  }, [Roomid, user]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === "") return;

    const newMessage = { text: message, sender: user, room: Roomid };
    if (socket) {
      socket.emit("sendMessage", newMessage);
      if(user != newMessage.sender)
      {
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
    <div className="max-w-lg mx-auto p-4 bg-gray-800 rounded-2xl shadow-xl h-[80vh] flex flex-col">
      <div className="flex items-center justify-between text-white p-4">
        <h2 className="text-lg font-semibold">Chat Room</h2>
        <div className="flex items-center gap-2">
          <User className="w-5 h-5" />
          <span className="text-sm">{user || "Not Connected"}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white p-3 rounded-b-2xl flex flex-col space-y-2">
        {chat.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-lg shadow-md ${
              msg.sender === user
                ? "bg-gray-700 text-white self-end"
                : "bg-gray-900 text-gray-300 self-start"
            }`}
          >
            <span className="text-xs font-semibold text-gray-400">
              {msg.sender === user ? "You" : msg.sender}
            </span>
            <p className="text-sm">{msg.text}</p>
          </motion.div>
        ))}
        {typingUser && (
          <motion.div
            className="text-gray-500 flex items-center gap-1 self-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            {typingUser} is typing...
          </motion.div>
        )}
      </div>

      

      <form onSubmit={sendMessage} className="mt-3 flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => {setMessage(e.target.value); handleTyping()}}
          placeholder="Type a message..."
          className="flex-1 p-3 border rounded-lg"
        />
        <button type="submit" className="bg-white text-black px-4 py-2 rounded-lg ml-2">
          <Send className="w-7 h-7" />
        </button>
      </form>
    </div>
  );
};

export default Chat;
