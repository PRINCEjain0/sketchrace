"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import socket from "@/lib/socket";
import { useRouter } from "next/navigation";

export default function Home() {
  const [name, setName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedSocketId = localStorage.getItem("socketId");

    if (storedSocketId) {
      socket.connect();
    } else {
      if (!socket.connected) socket.connect();
    }

    socket.on("connect", () => {
      console.log("User connected with ID:", socket.id);
      localStorage.setItem("socketId", socket.id);
    });

    socket.on("user joined", (data) => {
      console.log(data);
    });

    return () => {
      // socket.disconnect();
      // localStorage.removeItem("socketId");
    };
  }, []);

  const createRoom = () => {
    const roomId = Math.random().toString(36).substring(2, 10);

    if (!name.trim()) {
      alert("Please enter a name.");
      return;
    }
    socket.emit("join", { roomId, name });
    setName("");
    sessionStorage.setItem("roomId", roomId);
    sessionStorage.setItem("name", name);
    router.push(`room/${roomId}`);
  };

  return (
    <div className="flex flex-col justify-center items-center space-y-4">
      <Input
        value={name}
        placeholder="Prince,Shivam"
        onChange={(e) => setName(e.target.value)}
        className="w-96 h-12"
      />
      <Button className="w-96 h-12 bg-blue-700" onClick={createRoom}>
        Create Private Room
      </Button>
    </div>
  );
}
