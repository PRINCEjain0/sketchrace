"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { io } from "socket.io-client";
import Canvas from "@/components/parts/canvas";
import { Button } from "@/components/ui/button";
import RandomWordPicker from "@/components/parts/randomWord";
import Chat from "@/components/parts/guessChat";
import FinalScore from "@/components/parts/finalScore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Crown, Pencil, Clock } from "lucide-react";

export default function RoomPage() {
  const { roomId } = useParams();
  const [socket, setSocket] = useState(null);
  const [name, setName] = useState("");
  const [userList, setUserList] = useState([]);
  const [owner, setOwner] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [drawerId, setDrawerId] = useState(null);
  const [word, setWord] = useState(null);
  const [wordHint, setWordHint] = useState(null);
  const [scores, setScores] = useState({});
  const [finalScores, setFinalScores] = useState(null);
  const [showFinalScore, setShowFinalScore] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hintMessage, setHintMessage] = useState("");
  const [showHintAnimation, setShowHintAnimation] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("playerName");

    if (storedName) {
      setName(storedName);
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (!roomId || !name) return;

    const newSocket = io("http://localhost:4000");

    newSocket.on("connect", () => {
      console.log("connected to server");
      console.log("id ", newSocket.id);
      newSocket.emit("join", { roomId, name });
    });

    newSocket.on("final-scores", (scores) => {
      setFinalScores(scores);
      setShowFinalScore(true);
    });

    newSocket.on(
      "user-list",
      ({ users, ownerId, gamestarted, currentRound }) => {
        setUserList(users);
        setOwner(ownerId === newSocket.id);
        setGameStarted(gamestarted);
      }
    );

    newSocket.on("scores-reset", () => {
      setScores({});
    });

    newSocket.on("drawer-selected", ({ drawerId, name }) => {
      setDrawerId(drawerId);
      setWordHint(null);
      setHintMessage("");
      setShowHintAnimation(false);
      console.log(`It's ${name}'s turn to draw!`);
    });

    newSocket.on("word-to-guess", (word) => {
      setWord(word);
      setWordHint(null);
      setHintMessage("");
    });

    newSocket.on("word-hint", ({ hint, message }) => {
      console.log("HINT RECEIVED:", hint, message);
      setWordHint(hint);
      setHintMessage(message);
      setShowHintAnimation(true);
      setTimeout(() => setShowHintAnimation(false), 3000);
    });

    newSocket.on("game-ended", () => {
      setGameStarted(false);
      setWord(null);
      setWordHint(null);
      setDrawerId(null);
      setHintMessage("");
    });

    setSocket(newSocket);
    newSocket.on("game started", () => {
      setGameStarted(true);
    });

    newSocket.on("scores-update", (updatedScores) => {
      setScores(updatedScores);
    });

    return () => {
      newSocket.disconnect();
      console.log("Socket disconnected");
    };
  }, [roomId, name]);

  const handleGameStart = () => {
    if (userList.length < 2) {
      alert("You need at least 2 players to start the game.");
    } else {
      socket.emit("start-game", roomId);
    }
  };

  const handleCloseFinalScore = () => {
    setShowFinalScore(false);
  };

  const handlePlayAgain = () => {
    if (owner) {
      socket.emit("reset-game", roomId);
      socket.emit("start-game", roomId);
    } else {
      alert("Waiting for the room owner to start a new game.");
    }
  };

  const displayWordOrHint = () => {
    if (socket?.id === drawerId) {
      return (
        <div className="text-xl font-bold mt-2 bg-indigo-600 text-white py-2 px-4 rounded-full inline-block">
          Your word: <span className="text-yellow-300">{word}</span>
        </div>
      );
    } else if (wordHint) {
      return (
        <div
          className={`text-xl font-bold mt-2 bg-indigo-600 text-white py-2 px-4 rounded-full inline-block ${
            showHintAnimation ? "animate-pulse" : ""
          }`}
        >
          <span className="text-red-300 mr-2">
            <Clock className="inline h-5 w-5 mr-1" />
            HINT:
          </span>
          <span className="text-yellow-300 tracking-wider">{wordHint}</span>
        </div>
      );
    } else if (word) {
      return (
        <div className="text-xl font-bold mt-2 bg-indigo-600 text-white py-2 px-4 rounded-full inline-block">
          Word length:{" "}
          <span className="text-yellow-300">
            {word.replace(/[a-zA-Z]/g, "_ ")}
          </span>
        </div>
      );
    }
    return null;
  };

  if (!name) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-purple-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-2 border-indigo-200">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-indigo-700">
              Loading...
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p>Please wait while we connect you to the room.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-purple-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Game Header */}
        <div className="mb-6 text-center">
          <h1
            className="text-3xl font-bold text-indigo-800 mb-2"
            onClick={handleCopy}
          >
            SketchRace Room: {roomId}
          </h1>

          {displayWordOrHint()}
        </div>

        {!gameStarted ? (
          <div className="flex flex-col items-center justify-center space-y-6 my-12">
            <Card className="w-full max-w-md shadow-lg">
              <CardHeader>
                <CardTitle className="text-center text-2xl text-indigo-700">
                  Waiting for players...
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="mb-4 text-gray-600">
                  Share this room ID with friends:{" "}
                  <span
                    className="font-bold cursor-pointer hover:text-blue-500"
                    onClick={handleCopy}
                  >
                    {roomId}
                  </span>
                </p>

                <Button
                  onClick={handleGameStart}
                  disabled={!owner}
                  className={`px-6 py-3 rounded-full text-lg font-bold ${
                    owner
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {owner ? "Start Game" : "Waiting for host to start..."}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Game Area */}
            <div className="lg:col-span-3 space-y-4">
              <Canvas
                socket={socket}
                roomId={roomId}
                isDrawer={socket?.id === drawerId}
              />
              <RandomWordPicker
                socket={socket}
                roomId={roomId}
                isDrawer={socket?.id === drawerId}
              />
            </div>

            <div className="lg:col-span-1 space-y-6">
              {/* Players List */}
              <Card className="shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-xl text-indigo-700">
                    <Users className="mr-2 h-5 w-5" /> Players
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {userList.map((user) => (
                      <li
                        key={user.id}
                        className={`flex items-center justify-between p-2 rounded-lg ${
                          user.id === drawerId
                            ? "bg-indigo-100 border-l-4 border-indigo-500"
                            : "bg-white"
                        }`}
                      >
                        <div className="flex items-center">
                          {user.id === drawerId && (
                            <Pencil className="h-4 w-4 mr-2 text-indigo-600" />
                          )}
                          {socket && user.id === socket.id && (
                            <span className="font-bold">(You)</span>
                          )}
                          <span
                            className={`${
                              user.id === drawerId ? "font-semibold" : ""
                            } ml-1`}
                          >
                            {user.name}
                          </span>
                          {owner && user.id === socket.id && (
                            <Crown className="h-4 w-4 ml-1 text-yellow-500" />
                          )}
                        </div>
                        <span className="font-bold text-indigo-700">
                          {scores[user.name] || 0}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Chat */}
              <Card className="shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-indigo-700">
                    Chat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Chat
                    name={name}
                    socket={socket}
                    word={word}
                    roomId={roomId}
                    isDrawer={socket?.id === drawerId}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {showFinalScore && finalScores && (
        <FinalScore
          scores={finalScores}
          onClose={handleCloseFinalScore}
          onPlayAgain={handlePlayAgain}
          userList={userList.map((user) => user.name)}
        />
      )}
      {copied && (
        <div className="flex justify-center items-center">
          <p className="text-green-500 text-lg z-30">
            Room ID copied to clipboard!
          </p>
        </div>
      )}
    </div>
  );
}
