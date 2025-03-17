"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Pencil, Users, ArrowRight } from "lucide-react";

export default function Home() {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [activeTab, setActiveTab] = useState("create");
  const router = useRouter();

  const createRoom = () => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }
    const newRoomId = Math.random().toString(36).substring(2, 10);
    localStorage.setItem("playerName", name);
    router.push(`room/${newRoomId}`);
  };

  const joinRoom = () => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }
    if (!roomId.trim()) {
      alert("Please enter a room ID");
      return;
    }
    localStorage.setItem("playerName", name);
    router.push(`room/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-purple-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Game Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-indigo-700 mb-2">
            SketchRace
          </h1>
          <p className="text-lg text-indigo-600">Draw, Guess, and Have Fun!</p>
        </div>

        <Card className="shadow-xl border-2 border-indigo-200">
          <CardHeader>
            <div className="flex space-x-2 mb-2">
              <Button
                variant={activeTab === "create" ? "default" : "outline"}
                className={`flex-1 ${
                  activeTab === "create" ? "bg-indigo-600" : ""
                }`}
                onClick={() => setActiveTab("create")}
              >
                <Pencil className="h-4 w-4 mr-2" /> Create Room
              </Button>
              <Button
                variant={activeTab === "join" ? "default" : "outline"}
                className={`flex-1 ${
                  activeTab === "join" ? "bg-indigo-600" : ""
                }`}
                onClick={() => setActiveTab("join")}
              >
                <Users className="h-4 w-4 mr-2" /> Join Room
              </Button>
            </div>
            <CardTitle className="text-2xl text-center text-indigo-700">
              {activeTab === "create"
                ? "Create a New Game"
                : "Join Existing Game"}
            </CardTitle>
            <CardDescription className="text-center">
              {activeTab === "create"
                ? "Start a new game and invite your friends"
                : "Enter a room ID to join an existing game"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Your Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-2 border-indigo-200 focus:border-indigo-400"
              />
            </div>

            {activeTab === "join" && (
              <div>
                <label
                  htmlFor="roomId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Room ID
                </label>
                <Input
                  id="roomId"
                  type="text"
                  placeholder="Enter room ID"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="border-2 border-indigo-200 focus:border-indigo-400"
                />
              </div>
            )}
          </CardContent>

          <CardFooter>
            {activeTab === "create" ? (
              <Button
                onClick={createRoom}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-6 font-bold text-lg"
                disabled={!name.trim()}
              >
                Create Private Room <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            ) : (
              <Button
                onClick={joinRoom}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-6 font-bold text-lg"
                disabled={!name.trim() || !roomId.trim()}
              >
                Join Game <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Game Instructions */}
        <div className="mt-8 text-center text-gray-600">
          <h3 className="font-semibold text-indigo-700 mb-2">How to Play</h3>
          <p className="text-sm">
            Take turns drawing and guessing words. The faster you guess
            correctly, the more points you earn!
          </p>
        </div>
      </div>
    </div>
  );
}
