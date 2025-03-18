"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Trophy, Award, Medal } from "lucide-react";
import confetti from "canvas-confetti";

const FinalScore = ({ scores, userList, onClose, onPlayAgain }) => {
  const allPlayers = userList.map((user) => ({
    name: user,
    score: scores[user] || 0,
  }));

  const sortedPlayers = allPlayers
    .sort((a, b) => b.score - a.score)
    .map((player, index) => ({ ...player, rank: index + 1 }));

  React.useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Award className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-700" />;
      default:
        return null;
    }
  };

  const handlePlayAgain = () => {
    onClose();
    if (onPlayAgain) onPlayAgain();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all animate-in fade-in slide-in-from-bottom-4">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700 flex items-center justify-center">
          <Trophy className="h-8 w-8 mr-2 text-yellow-500" /> Final Scores
        </h2>

        <ul className="space-y-3 mb-6">
          {sortedPlayers.map((player, id) => (
            <li
              key={id}
              className={`flex items-center justify-between p-3 rounded-lg ${
                player.rank <= 3
                  ? "bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100"
                  : ""
              }`}
            >
              <div className="flex items-center">
                {getRankIcon(player.rank)}
                <span
                  className={`ml-2 ${
                    player.rank === 1 ? "font-bold text-lg" : ""
                  }`}
                >
                  {player.name}
                </span>
              </div>
              <span className="font-bold text-xl text-indigo-700">
                {player.score} pts
              </span>
            </li>
          ))}
        </ul>

        <div className="text-center">
          <Button
            onClick={handlePlayAgain}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full text-lg font-medium"
          >
            Play Again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FinalScore;
