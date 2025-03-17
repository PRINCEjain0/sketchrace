"use client";
import { useEffect, useRef, useState } from "react";

export default function Canvas({ socket, roomId, isDrawer }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 800;
    canvas.height = 600;

    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    socket.on("drawing", ({ prevX, prevY, x, y, brushColor, brushSize }) => {
      if (!ctxRef.current) return;
      ctxRef.current.beginPath();
      ctxRef.current.moveTo(prevX, prevY);
      ctxRef.current.lineTo(x, y);
      ctxRef.current.strokeStyle = brushColor;
      ctxRef.current.lineWidth = brushSize;
      ctxRef.current.stroke();
      ctxRef.current.closePath();
    });

    socket.on("clear-canvas", clearCanvas);

    return () => {
      socket.off("drawing");
      socket.off("clear-canvas");
    };
  }, [socket]);

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    if (!isDrawer) return; // Stop if user is not the drawer
    const { x, y } = getMousePos(e);
    setIsDrawing(true);

    const ctx = ctxRef.current;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;

    ctx.prevX = x;
    ctx.prevY = y;
  };

  const draw = (e) => {
    if (!isDrawing || !isDrawer) return; // Stop if user is not the drawer

    const { x, y } = getMousePos(e);
    const ctx = ctxRef.current;

    ctx.lineTo(x, y);
    ctx.stroke();

    socket.emit("drawing", {
      roomId,
      prevX: ctx.prevX,
      prevY: ctx.prevY,
      x,
      y,
      brushColor,
      brushSize,
    });

    ctx.prevX = x;
    ctx.prevY = y;
  };

  const stopDrawing = () => {
    if (!isDrawer) return; // Stop if user is not the drawer
    setIsDrawing(false);
    ctxRef.current.closePath();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleClearCanvas = () => {
    if (!isDrawer) return;
    clearCanvas();
    socket.emit("clear-canvas", roomId);
  };

  return (
    <div className="p-4 space-y-4 flex flex-col justify-center items-center">
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{
          border: "1px solid black",
          cursor: isDrawer ? "crosshair" : "not-allowed",
        }}
      />

      {isDrawer && (
        <div className="flex items-center space-x-4 mt-4">
          <input
            type="color"
            value={brushColor}
            onChange={(e) => setBrushColor(e.target.value)}
            className="border rounded-md"
          />
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(e.target.value)}
            className="w-24"
          />
          <button
            onClick={handleClearCanvas}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
