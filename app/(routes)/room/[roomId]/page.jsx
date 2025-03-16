"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { io } from "socket.io-client";
import Canvas from "@/components/parts/canvas";

export default function RoomPage() {
  const { roomId } = useParams();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!roomId) return;

    const newSocket = io("http://localhost:4000");

    newSocket.on("connect", () => {
      console.log("connected to server");
      console.log("id ", newSocket.id);
      newSocket.emit("join", roomId);
    });

    newSocket.on("user joined", (data) => {
      console.log("user joined", data);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      console.log("Socket disconnected");
    };
  }, [roomId]);

  return (
    <div>
      Welcome to the Room!
      {socket && <Canvas socket={socket} roomId={roomId} />}
    </div>
  );
}
