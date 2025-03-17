"use client";
import { useState, useEffect } from "react";

export default function Chat({ name, socket, word, roomId, isDrawer }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [guessTimeLeft, setGuessTimeLeft] = useState(null);

  useEffect(() => {
    if (!socket) return;

    socket.on("message", (message) => {
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

  return (
    <div>
      {guessTimeLeft !== null && (
        <div className="text-red-600 mb-2">
          Guessing Time Left: {guessTimeLeft} seconds
        </div>
      )}
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            {message.name}: {message.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={guessTimeLeft === 0}
      />
      <button onClick={sendMessage} disabled={guessTimeLeft === 0}>
        Send
      </button>
    </div>
  );
}
