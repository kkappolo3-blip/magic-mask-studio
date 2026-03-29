import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, RotateCcw } from "lucide-react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  onReset: () => void;
}

const BeforeAfterSlider = ({ beforeImage, onReset }: BeforeAfterSliderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [afterImage, setAfterImage] = useState<string>("");
  const isDragging = useRef(false);

  // Generate a mock "after" image by applying a filter
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const maxW = Math.min(window.innerWidth - 48, 400);
      const ratio = img.height / img.width;
      const w = maxW;
      const h = w * ratio;
      setDimensions({ width: w, height: h });

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Create a magical transformed version
        ctx.filter = "saturate(1.6) contrast(1.15) brightness(1.05)";
        ctx.drawImage(img, 0, 0);

        // Add a subtle blue/purple overlay for "magic" effect
        ctx.globalCompositeOperation = "overlay";
        ctx.fillStyle = "hsla(211, 100%, 50%, 0.12)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add sparkle-like highlights
        ctx.globalCompositeOperation = "screen";
        const gradient = ctx.createRadialGradient(
          canvas.width * 0.3, canvas.height * 0.4, 0,
          canvas.width * 0.3, canvas.height * 0.4, canvas.width * 0.5
        );
        gradient.addColorStop(0, "hsla(211, 100%, 80%, 0.3)");
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        setAfterImage(canvas.toDataURL());
      }
    };
    img.src = beforeImage;
  }, [beforeImage]);

  const updateSlider = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  const handleStart = (e: React.TouchEvent | React.MouseEvent) => {
    isDragging.current = true;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    updateSlider(clientX);
  };

  const handleMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging.current) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    updateSlider(clientX);
  };

  const handleEnd = () => {
    isDragging.current = false;
  };

  const handleDownload = () => {
    if (navigator.vibrate) navigator.vibrate(20);
    // Create a mock ZIP download
    const link = document.createElement("a");
    link.href = afterImage || beforeImage;
    link.download = "ai-magic-result.png";
    link.click();
  };

  if (!afterImage) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center px-6 pt-8 pb-32"
    >
      <h2 className="text-xl font-bold text-foreground mb-1">Your Magic ✨</h2>
      <p className="text-sm text-muted-foreground mb-5">Swipe to compare before & after</p>

      <div
        ref={containerRef}
        className="relative rounded-lg overflow-hidden select-none cursor-ew-resize"
        style={{ width: dimensions.width, height: dimensions.height, boxShadow: "var(--shadow-card)" }}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
      >
        {/* After (full) */}
        <img
          src={afterImage}
          alt="After"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />

        {/* Before (clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <img
            src={beforeImage}
            alt="Before"
            className="absolute inset-0 object-cover"
            style={{ width: dimensions.width, height: dimensions.height }}
            draggable={false}
          />
        </div>

        {/* Slider line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-primary-foreground/80"
          style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card flex items-center justify-center"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            <span className="text-foreground text-xs font-bold">↔</span>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-3 left-3 ios-pill bg-card/80 backdrop-blur-sm text-foreground text-xs">
          Before
        </div>
        <div className="absolute top-3 right-3 ios-pill bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs">
          After ✨
        </div>
      </div>

      <div className="flex gap-3 mt-6 w-full max-w-sm">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          className="ios-button-press flex-1 ios-pill bg-secondary text-secondary-foreground flex items-center justify-center gap-2 py-3"
        >
          <RotateCcw className="w-4 h-4" />
          New
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleDownload}
          className="ios-button-press flex-[2] ios-pill bg-primary text-primary-foreground flex items-center justify-center gap-2 py-3 font-bold"
          style={{ boxShadow: "var(--shadow-button)" }}
        >
          <Download className="w-4 h-4" />
          Download Project
        </motion.button>
      </div>
    </motion.div>
  );
};

export default BeforeAfterSlider;
