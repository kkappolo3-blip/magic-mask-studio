import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import UploadCard from "@/components/UploadCard";
import MaskingCanvas from "@/components/MaskingCanvas";
import GenerateTimeline from "@/components/GenerateTimeline";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import { Sparkles } from "lucide-react";

type AppState = "upload" | "masking" | "generating" | "preview";

const spring = { type: "spring" as const, stiffness: 250, damping: 25 };

const Index = () => {
  const [state, setState] = useState<AppState>("upload");
  const [lastFrame, setLastFrame] = useState<string>("");
  const [maskData, setMaskData] = useState<string>("");

  const captureLastFrame = useCallback((file: File) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;

    const url = URL.createObjectURL(file);
    video.src = url;

    video.onloadedmetadata = () => {
      video.currentTime = Math.max(0, video.duration - 0.1);
    };

    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        setLastFrame(canvas.toDataURL("image/png"));
        setState("masking");
      }
      URL.revokeObjectURL(url);
    };
  }, []);

  const handleMaskDone = (maskDataUrl: string) => {
    setMaskData(maskDataUrl);
  };

  const handleGenerate = () => {
    if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
    setState("generating");
  };

  const handleGenerateComplete = useCallback(() => {
    setState("preview");
  }, []);

  const handleReset = () => {
    setState("upload");
    setLastFrame("");
    setMaskData("");
  };

  return (
    <div className="min-h-screen mesh-gradient-bg max-w-lg mx-auto relative overflow-hidden">
      {/* Top Nav */}
      <div className="sticky top-0 z-50 glass-nav px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-foreground tracking-tight">AI Magic</span>
        </div>
        <span className="text-xs font-medium text-muted-foreground ios-pill bg-secondary/60">
          {state === "upload" && "Ready"}
          {state === "masking" && "Masking"}
          {state === "generating" && "Processing"}
          {state === "preview" && "Complete"}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {state === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={spring}
          >
            <UploadCard onVideoSelect={captureLastFrame} />
          </motion.div>
        )}

        {state === "masking" && (
          <motion.div
            key="masking"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={spring}
          >
            <MaskingCanvas
              frameImage={lastFrame}
              onDone={handleMaskDone}
              onGenerate={handleGenerate}
            />
          </motion.div>
        )}

        {state === "generating" && (
          <motion.div
            key="generating"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={spring}
          >
            <GenerateTimeline onComplete={handleGenerateComplete} />
          </motion.div>
        )}

        {state === "preview" && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={spring}
          >
            <BeforeAfterSlider
              beforeImage={lastFrame}
              maskData={maskData}
              onReset={handleReset}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
