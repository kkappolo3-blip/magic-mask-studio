import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Eraser, Paintbrush, Undo2, Sparkles } from "lucide-react";

interface MaskingCanvasProps {
  frameImage: string;
  onDone: (maskDataUrl: string) => void;
  onGenerate: () => void;
}

const MaskingCanvas = ({ frameImage, onDone, onGenerate }: MaskingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const [brushSize, setBrushSize] = useState(30);
  const [isDrawing, setIsDrawing] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const historyRef = useRef<ImageData[]>([]);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const maxW = Math.min(window.innerWidth - 48, 400);
      const ratio = img.height / img.width;
      const w = maxW;
      const h = w * ratio;
      setDimensions({ width: w, height: h });

      requestAnimationFrame(() => {
        const canvas = canvasRef.current;
        const maskCanvas = maskCanvasRef.current;
        if (!canvas || !maskCanvas) return;
        canvas.width = w;
        canvas.height = h;
        maskCanvas.width = w;
        maskCanvas.height = h;

        const ctx = canvas.getContext("2d");
        if (ctx) ctx.drawImage(img, 0, 0, w, h);
      });
    };
    img.src = frameImage;
  }, [frameImage]);

  const saveHistory = () => {
    const ctx = maskCanvasRef.current?.getContext("2d");
    if (ctx && maskCanvasRef.current) {
      const data = ctx.getImageData(0, 0, maskCanvasRef.current.width, maskCanvasRef.current.height);
      historyRef.current.push(data);
      if (historyRef.current.length > 20) historyRef.current.shift();
    }
  };

  const getPos = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = maskCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const drawLine = useCallback((from: { x: number; y: number }, to: { x: number; y: number }) => {
    const ctx = maskCanvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = "hsl(211 100% 50%)";
    ctx.strokeStyle = "hsl(211 100% 50%)";
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalCompositeOperation = "source-over";
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(to.x, to.y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
  }, [brushSize]);

  const draw = useCallback((x: number, y: number) => {
    const ctx = maskCanvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = "hsl(211 100% 50%)";
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
  }, [brushSize]);

  const handleStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    saveHistory();
    setIsDrawing(true);
    const pos = getPos(e);
    lastPosRef.current = pos;
    draw(pos.x, pos.y);
  };

  const handleMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getPos(e);
    if (lastPosRef.current) drawLine(lastPosRef.current, pos);
    lastPosRef.current = pos;
  };

  const handleEnd = () => {
    setIsDrawing(false);
    lastPosRef.current = null;
  };

  const clearMask = () => {
    if (navigator.vibrate) navigator.vibrate(15);
    saveHistory();
    const ctx = maskCanvasRef.current?.getContext("2d");
    if (ctx && maskCanvasRef.current) ctx.clearRect(0, 0, maskCanvasRef.current.width, maskCanvasRef.current.height);
  };

  const undo = () => {
    if (navigator.vibrate) navigator.vibrate(10);
    const ctx = maskCanvasRef.current?.getContext("2d");
    if (ctx && maskCanvasRef.current && historyRef.current.length > 0) {
      const prev = historyRef.current.pop()!;
      ctx.putImageData(prev, 0, 0);
    }
  };

  const handleGenerate = () => {
    if (maskCanvasRef.current) onDone(maskCanvasRef.current.toDataURL());
    onGenerate();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center px-6 pt-6 pb-48"
    >
      <h2 className="text-xl font-bold text-foreground mb-1">Kanvas Ajaib</h2>
      <p className="text-sm text-muted-foreground mb-5">Arsir objek yang ingin kamu ubah</p>

      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ width: dimensions.width, height: dimensions.height, boxShadow: "var(--shadow-card)" }}
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ width: dimensions.width, height: dimensions.height }} />
        <canvas
          ref={maskCanvasRef}
          className="absolute inset-0 w-full h-full mask-brush"
          style={{ width: dimensions.width, height: dimensions.height }}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
        />
      </div>

      {/* Brush Size Slider */}
      <div className="w-full max-w-sm mt-5 glass-card">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-foreground flex items-center gap-2">
            <Paintbrush className="w-4 h-4 text-primary" />
            Ukuran Kuas
          </span>
          <span className="text-sm font-bold text-primary">{brushSize}px</span>
        </div>
        <input
          type="range"
          min={8}
          max={80}
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          className="w-full accent-primary h-2 rounded-full appearance-none bg-secondary"
        />
      </div>

      {/* Bottom Control Pill */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-6">
        <div className="max-w-lg mx-auto">
          <div className="glass-pill p-2 flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={undo}
              className="ios-button-press flex items-center justify-center gap-1.5 px-4 py-3 rounded-full text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors"
            >
              <Undo2 className="w-4 h-4" />
              Urung
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={clearMask}
              className="ios-button-press flex items-center justify-center gap-1.5 px-4 py-3 rounded-full text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors"
            >
              <Eraser className="w-4 h-4" />
              Hapus
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={handleGenerate}
              className="ios-button-press flex-1 py-3 rounded-full bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 animate-shimmer animate-glow"
              style={{ backgroundSize: "200% 100%" }}
            >
              <Sparkles className="w-4 h-4" />
              Mulai Keajaiban
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MaskingCanvas;
