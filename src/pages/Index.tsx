import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import UploadCard from "@/components/UploadCard";
import MaskingCanvas from "@/components/MaskingCanvas";
import GenerateButton from "@/components/GenerateButton";
import GenerateTimeline from "@/components/GenerateTimeline";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";

type AppState = "upload" | "masking" | "generating" | "preview";

const Index = () => {
  const [state, setState] = useState<AppState>("upload");
  const [lastFrame, setLastFrame] = useState<string>("");
  const [, setMaskData] = useState<string>("");

  const captureLastFrame = useCallback((file: File) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;

    const url = URL.createObjectURL(file);
    video.src = url;

    video.onloadedmetadata = () => {
      // Seek to near the end
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
    <div className="min-h-screen bg-background max-w-lg mx-auto relative overflow-hidden">
      {/* Status bar spacer */}
      <div className="h-2" />

      <AnimatePresence mode="wait">
        {state === "upload" && (
          <motion.div key="upload" exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}>
            <UploadCard onVideoSelect={captureLastFrame} />
          </motion.div>
        )}

        {state === "masking" && (
          <motion.div key="masking" exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}>
            <MaskingCanvas frameImage={lastFrame} onDone={handleMaskDone} />
            <GenerateButton onGenerate={handleGenerate} />
          </motion.div>
        )}

        {state === "generating" && (
          <motion.div key="generating" exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}>
            <GenerateTimeline onComplete={handleGenerateComplete} />
          </motion.div>
        )}

        {state === "preview" && (
          <motion.div key="preview" exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <BeforeAfterSlider beforeImage={lastFrame} onReset={handleReset} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
