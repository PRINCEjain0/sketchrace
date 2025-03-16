"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const [name, setName] = useState("");
  const router = useRouter();

  const createRoom = () => {
    const roomId = Math.random().toString(36).substring(2, 10);
    router.push(`room/${roomId}`);
  };

  return (
    <div className="flex flex-col justify-center items-center space-y-4">
      <Button className="w-96 h-12 bg-blue-700" onClick={createRoom}>
        Create Private Room
      </Button>
    </div>
  );
}
