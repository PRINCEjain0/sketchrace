"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { io } from "socket.io-client";

export default function RoomPage() {
  const { roomId } = useParams();

  useEffect(() => {
    if (!roomId) return;
    const socket = io("http://localhost:4000");

    socket.on("connect", () => {
      console.log("connected to server");
      console.log("id ", socket.id);
      socket.emit("join", roomId);
    });
    socket.on("user joined", (data) => {
      console.log("user joined", data);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return <div>Welcome to the Room!</div>;
}
