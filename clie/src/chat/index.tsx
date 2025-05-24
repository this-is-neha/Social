
// chat/index.tsx
import { useEffect, useState } from "react";
import socket from "../Socket";
import Header from "../common/header";
import Footer from "../common/footer";
import axios from "axios";
const baseUrl= import.meta.env.VITE_API_BASE_URL
const Chat = ({ userId: recipientUserId }: { userId: string }) => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ from: string; message: string }[]>([]);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [recipientInfo, setRecipientInfo] = useState<{ name: string; image?: string } | null>(null);

  useEffect(() => {
    if (!loggedInUserId) return;
    socket.emit("register", loggedInUserId);
  }, [loggedInUserId]);

  useEffect(() => {
    socket.on("receiveMessage", ({ from, message }) => {
      setChat(prev => [...prev, { from, message }]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  useEffect(() => {
    const getLoggedInUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.log("No token found in localStorage");
          return;
        }

        const response = await axios.get(`${baseUrl}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setLoggedInUserId(response.data.result._id);
      } catch (exception) {
        console.log("Error loading logged-in user:", exception);
      }
    };

    getLoggedInUser();
  }, []);

  useEffect(() => {
    const fetchRecipientInfo = async () => {
      try {
        const response = await axios.get(`${baseUrl}/auth/single/${recipientUserId}`);
        setRecipientInfo(response.data.result);
      } catch (error) {
        console.error("Failed to load recipient info", error);
      }
    };

    if (recipientUserId) {
      fetchRecipientInfo();
    }
  }, [recipientUserId]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!loggedInUserId || !recipientUserId) return;
      try {
        const response = await axios.get(
          `${baseUrl}/auth/history/${loggedInUserId}/${recipientUserId}`
        );
        setChat(response.data.result || []);
      } catch (err) {
        console.error("Failed to fetch chat history", err);
      }
    };

    fetchChatHistory();
  }, [loggedInUserId, recipientUserId]);

  const handleSend = () => {
    if (!loggedInUserId) {
      alert("You must be logged in to send messages.");
      return;
    }

    const msgData = {
      from: loggedInUserId,
      to: recipientUserId,
      message,
    };

    socket.emit("sendMessage", msgData);

    setChat((prev) => [...prev, { from: loggedInUserId, message }]);
    setMessage("");
  };

  return (
    <>
      <Header />
      <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto shadow border rounded mt-4">
     
        {recipientInfo && (
          <div className="flex items-center gap-4 p-4 border-b bg-gray-100">
            <img
              src={
                recipientInfo.image
                  ? `${baseUrl}/uploads/${recipientInfo.image}`
                  : "/default-avatar.png"
              }
              alt={recipientInfo.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h2 className="text-lg font-semibold">{recipientInfo.name}</h2>
              <p className="text-sm text-gray-500">Online</p>
            </div>
          </div>
        )}

       
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-white">
          {chat.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.from === loggedInUserId ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs ${
                  msg.from === loggedInUserId
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.message}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t flex items-center gap-2 bg-gray-50">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Chat;
