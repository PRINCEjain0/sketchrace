import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { generate } from "random-words";

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
      }
    });

    return () => {
      socket.off("word-selection-time");
    };
  }, [socket, isDrawer, wordSelected]);

  useEffect(() => {
    if (timeLeft === 0) {
      const randomWord = words[Math.floor(Math.random() * words.length)];
      handleWordSelect(randomWord);
    }
  }, [timeLeft, words, wordSelected]);

  const handleWordSelect = (word) => {
    socket.emit("word-selected", { roomId, word });
    setShowModal(false);
    setWordSelected(true);
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
      <div className="bg-white p-8 rounded-lg shadow-lg text-center space-y-4">
        <h2 className="text-xl font-bold mb-4">Select a Word</h2>
        <div className="space-y-2">
          {words.map((word) => (
            <Button
              key={word}
              onClick={() => handleWordSelect(word)}
              className="w-full py-2 bg-blue-500 text-white rounded-md"
            >
              {word}
            </Button>
          ))}
        </div>
        <div className="mt-4 text-red-600 text-lg">
          Time Left: {timeLeft} seconds
        </div>
      </div>
    </div>
  );
}
