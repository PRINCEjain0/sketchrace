"use client";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Clock } from "lucide-react";

export default function Chat({ name, socket, word, roomId, isDrawer }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [guessTimeLeft, setGuessTimeLeft] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    socket.on("message", (message) => {
      console.log("Received message:", message);
      setMessages((messages) => [...messages, message]);
    });

    socket.on("word-guessing-time", (time) => {
      setGuessTimeLeft(time);
    });

    return () => {
      socket.off("message");
      socket.off("word-guessing-time");
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (message.trim() === "" || guessTimeLeft === 0) return;
    console.log("sending message", message);
    if (message.trim() === word && !isDrawer) {
      socket.emit("correct-guess", { name, roomId });
      socket.emit("message", {
        message: `${name} guessed the word!`,
        name,
        roomId,
      });
    } else {
      socket.emit("message", { message, name, roomId });
    }

    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const getMessageStyle = (msg) => {
    if (msg.message.includes("guessed the word!")) {
      return "bg-green-100 text-green-800 font-medium";
    }
    if (msg.name === name) {
      return "bg-indigo-100";
    }
    return "bg-gray-100";
  };

  return (
    <div className="flex flex-col h-[400px]">
      {guessTimeLeft !== null && (
        <div className="flex items-center justify-center text-red-600 mb-2 font-bold bg-red-50 py-1 px-2 rounded-md">
          <Clock className="h-4 w-4 mr-1" /> {guessTimeLeft} seconds left
        </div>
      )}

      <div className="flex-1 overflow-y-auto mb-3 space-y-2 pr-1">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 italic py-4">
            No messages yet. Start chatting!
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index} className={`p-2 rounded-lg ${getMessageStyle(msg)}`}>
            <span className="font-semibold">{msg.name}: </span>
            <span>{msg.message}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex space-x-2">
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={guessTimeLeft === 0}
          placeholder={
            isDrawer
              ? "You can&apos;t guess while drawing"
              : "Type your guess here..."
          }
          className="flex-1"
        />
        <Button
          onClick={sendMessage}
          disabled={guessTimeLeft === 0 || message.trim() === ""}
          size="icon"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {isDrawer && (
        <div className="text-center text-sm text-gray-500 mt-2">
          You can&apos;t guess while drawing
        </div>
      )}
    </div>
  );
}
