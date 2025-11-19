import { useState, useEffect, useRef } from "react";
import { Button, TextInput } from "flowbite-react";
import { useMessageStore } from "../store/messageStore";
import { useAuthStore } from "../store/authStore";
import { useSocket } from "../context/SocketContext";

export default function ChatWindow() {
  const { selectedUser, messages, receiveMessage, setLocalMessage } =
    useMessageStore();
  const socket = useSocket();

  const user = useAuthStore((s) => s.user);
  const [input, setInput] = useState("");
  const chatRef = useRef(null);

  useEffect(() => {
    if (!socket) return;
    socket.on("receive_message", (msg) => {
      console.log({ revMes: msg });
      receiveMessage(msg);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [socket]);

  // Auto-scroll to bottom on messages update
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  if (!selectedUser) {
    return (
      <div className="flex flex-1 items-center justify-center text-gray-500">
        Select a user to start chat
      </div>
    );
  }

const sendMessage = () => {
    if (!input.trim()) return;

    if (!socket || !socket.connected) {
      console.log("⚠ Socket is not connected. Message not sent.");
      // The Socket.IO client will automatically try to reconnect 
      return; 
    }

    const msg = {
      message: input,
      toUserId: selectedUser._id,
      fromUserId: user._id,
    };
    setLocalMessage(msg);
    socket.emit("send_message", msg);
    setInput("");
  };

  return (
    <div className="flex flex-col flex-1 bg-gray-50 p-4">
      <h2 className="text-lg font-bold mb-3">Chat with {selectedUser.name}</h2>

      <div ref={chatRef} className="flex-1 overflow-y-auto mb-4 pr-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`mb-2 flex ${
              m.fromUserId === user?._id ? "justify-end" : "justify-start"
            }`}
          >
            <p
              className={`p-2 rounded-lg text-white max-w-xs ${
                m.fromUserId === user?._id ? "bg-blue-600" : "bg-gray-700"
              }`}
            >
              {m.message}
            </p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <TextInput
          className="flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message…"
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
}
