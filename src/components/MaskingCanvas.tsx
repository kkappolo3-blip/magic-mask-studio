import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Eraser, Paintbrush } from "lucide-react";

interface MaskingCanvasProps {
  frameImage: string;
  onDone: (maskDataUrl: string) => void;
}

const MaskingCanvas = ({ frameImage, onDone }: MaskingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const [brushSize, setBrushSize] = useState(30);
  const [isDrawing, setIsDrawing] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

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
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
        }
      });
    };
    img.src = frameImage;
  }, [frameImage]);

  const getPos = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = maskCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const draw = useCallback((x: number, y: number) => {
    const ctx = maskCanvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = "hsl(211, 100%, 50%)";
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
  }, [brushSize]);

  const handleStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const { x, y } = getPos(e);
    draw(x, y);
  };

  const handleMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getPos(e);
    draw(x, y);
  };

  const handleEnd = () => setIsDrawing(false);

  const clearMask = () => {
    const ctx = maskCanvasRef.current?.getContext("2d");
    if (ctx && maskCanvasRef.current) {
      ctx.clearRect(0, 0, maskCanvasRef.current.width, maskCanvasRef.current.height);
    }
  };

  const handleDone = () => {
    if (maskCanvasRef.current) {
      onDone(maskCanvasRef.current.toDataURL());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center px-6 pt-8 pb-32"
    >
      <h2 className="text-xl font-bold text-foreground mb-1">Magic Mask</h2>
      <p className="text-sm text-muted-foreground mb-5">Paint over the objects to transform</p>

      <div
        className="relative rounded-lg overflow-hidden"
        style={{ width: dimensions.width, height: dimensions.height, boxShadow: "var(--shadow-card)" }}
      >
        <canvas ref={canvasRef} className="absolute inset-0" />
        <canvas
          ref={maskCanvasRef}
          className="absolute inset-0 mask-brush"
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
        />
      </div>

      {/* Brush size slider */}
      <div className="w-full max-w-sm mt-6 ios-card">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-foreground flex items-center gap-2">
            <Paintbrush className="w-4 h-4 text-accent-foreground" />
            Brush Size
          </span>
          <span className="text-sm font-semibold text-accent-foreground">{brushSize}px</span>
        </div>
        <input
          type="range"
          min={8}
          max={80}
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          className="w-full accent-primary h-2 rounded-full appearance-none bg-accent"
        />
      </div>

      <div className="flex gap-3 mt-4 w-full max-w-sm">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={clearMask}
          className="ios-button-press flex-1 ios-pill bg-secondary text-secondary-foreground flex items-center justify-center gap-2 py-3"
        >
          <Eraser className="w-4 h-4" />
          Clear
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleDone}
          className="ios-button-press flex-[2] ios-pill bg-primary text-primary-foreground flex items-center justify-center gap-2 py-3 font-bold"
          style={{ boxShadow: "var(--shadow-button)" }}
        >
          Continue ✨
        </motion.button>
      </div>
    </motion.div>
  );
};

export default MaskingCanvas;
