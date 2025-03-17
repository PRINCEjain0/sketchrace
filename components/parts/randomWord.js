"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { generate } from "random-words";
import { Clock } from "lucide-react";

export default function RandomWordPicker({ socket, roomId, isDrawer }) {
  const [words, setWords] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [wordSelected, setWordSelected] = useState(false);

  useEffect(() => {
    if (!isDrawer) return;

    socket.on("word-selection-time", (time) => {
      if (!wordSelected) {
        if (time >= 0) {
          setShowModal(true);
          setTimeLeft(time);
        } else {
          setShowModal(false);
        }
      } else {
        setTimeLeft(0);
        setShowModal(false);
      }
    });

    return () => {
      socket.off("word-selection-time");
    };
  }, [socket, isDrawer, wordSelected]);

  useEffect(() => {
    if (timeLeft === 0 && showModal && !wordSelected) {
      const randomWord = words[Math.floor(Math.random() * words.length)];
      handleWordSelect(randomWord);
    }
  }, [timeLeft, words, wordSelected, showModal]);

  const handleWordSelect = (word) => {
    setWordSelected(true);
    setShowModal(false);

    socket.emit("word-selected", { roomId, word });

    socket.emit("force-end-timer", roomId);
  };

  useEffect(() => {
    if (isDrawer) {
      const words = generate(3);
      setWords(words);
      setWordSelected(false);
    }
  }, [isDrawer]);

  if (!isDrawer || !showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-indigo-700">
          Choose a Word to Draw!
        </h2>

        <div className="grid gap-3">
          {words.map((word) => (
            <Button
              key={word}
              onClick={() => handleWordSelect(word)}
              className="w-full py-6 text-lg font-bold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg transition-transform hover:scale-105"
            >
              {word}
            </Button>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center text-red-600 font-bold text-xl">
          <Clock className="h-5 w-5 mr-2 animate-pulse" />
          <span>{timeLeft} seconds left</span>
        </div>

        <p className="mt-4 text-gray-500 text-sm">
          If you don't choose, a random word will be selected for you.
        </p>
      </div>
    </div>
  );
}
