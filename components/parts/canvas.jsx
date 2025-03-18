"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Eraser } from "lucide-react";

export default function Canvas({ socket, roomId, isDrawer }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);

  const colorOptions = [
    "#000000",
    "#FFFFFF",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FFA500",
    "#800080",
    "#008000",
    "#800000",
    "#008080",
    "#000080",
    "#FFC0CB",
  ];

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
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e) => {
    if (!isDrawer) return;
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
    if (!isDrawing || !isDrawer) return;

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
    if (!isDrawer) return;
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

  const handleSetEraser = () => {
    if (!isDrawer) return;
    setBrushColor("#FFFFFF");
  };

  return (
    <Card className="shadow-xl overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="w-full h-full bg-white rounded-t-lg"
            style={{
              cursor: isDrawer ? "crosshair" : "not-allowed",
            }}
          />

          {!isDrawer && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-indigo-600 bg-opacity-70 text-white px-4 py-2 rounded-full text-lg font-bold">
                Guess the word!
              </div>
            </div>
          )}
        </div>

        {isDrawer && (
          <div className="bg-gray-100 p-4 border-t border-gray-200">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  onClick={() => setBrushColor(color)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    brushColor === color
                      ? "border-indigo-600"
                      : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Select ${color} color`}
                />
              ))}

              <Button
                onClick={handleSetEraser}
                variant="outline"
                className="ml-2"
                size="icon"
              >
                <Eraser className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Brush Size:</span>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={brushSize}
                  onChange={(e) => setBrushSize(e.target.value)}
                  className="w-32"
                />
                <span className="text-sm font-medium">{brushSize}px</span>
              </div>

              <Button
                onClick={handleClearCanvas}
                variant="destructive"
                size="sm"
                className="flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-1" /> Clear
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
