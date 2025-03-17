"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { io } from "socket.io-client";
import Canvas from "@/components/parts/canvas";
import { Button } from "@/components/ui/button";
import RandomWordPicker from "@/components/parts/randomWord";
import Chat from "@/components/parts/guessChat";
export default function RoomPage() {
  const { roomId } = useParams();
  const [socket, setSocket] = useState(null);
  const [name, setName] = useState("");
  const [nameTrue, setNameTrue] = useState(false);
  const [userList, setUserList] = useState([]);
  const [owner, setOwner] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [drawerId, setDrawerId] = useState(null);
  const [word, setWord] = useState(null);
  const [scores, setScores] = useState({});
  useEffect(() => {
    if (!roomId || !nameTrue) return;

    const newSocket = io("http://localhost:4000");

    newSocket.on("connect", () => {
      console.log("connected to server");
      console.log("id ", newSocket.id);
      newSocket.emit("join", { roomId, name });
    });

    newSocket.on("user-list", ({ users, ownerId, gamestarted }) => {
      setUserList(users);
      setOwner(ownerId === newSocket.id);
      setGameStarted(gamestarted);
    });

    newSocket.on("drawer-selected", ({ drawerId, name }) => {
      setDrawerId(drawerId);
      console.log(`It's ${name}'s turn to draw!`);
    });

    newSocket.on("word-to-guess", (word) => {
      setWord(word);
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
  }, [roomId, nameTrue]);

  const handleGmaeStart = () => {
    socket.emit("start-game", roomId);
  };
  const nextTurn = () => {
    socket.emit("next-turn", roomId);
  };
  return (
    <div>
      {word && (
        <div className="text-lg font-bold mt-4 text-center">
          The selected word is: {word}
        </div>
      )}
      {nameTrue ? (
        !gameStarted ? (
          <Button
            onClick={handleGmaeStart}
            disabled={!owner}
            className={`px-4 py-2 rounded-md ${
              owner
                ? "bg-blue-500 text-white"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
          >
            Start Game
          </Button>
        ) : (
          <>
            <RandomWordPicker
              socket={socket}
              roomId={roomId}
              isDrawer={socket.id === drawerId}
            />
            <Chat
              name={name}
              socket={socket}
              word={word}
              roomId={roomId}
              isDrawer={socket.id === drawerId}
            />

            <Canvas
              socket={socket}
              roomId={roomId}
              isDrawer={socket.id === drawerId}
            />
          </>
        )
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter your name"
            onChange={(e) => setName(e.target.value)}
          />
          <Button onClick={() => setNameTrue(true)}>Submit</Button>
        </>
      )}
      <ul className="mt-4">
        {userList.map((user) => (
          <li key={user.id} className="mb-1">
            {user.name} - Score: {scores[user.name] || 0}
          </li>
        ))}
      </ul>
      {socket && socket.id === drawerId && (
        <Button onClick={nextTurn}>Next Turn</Button>
      )}
    </div>
  );
}
