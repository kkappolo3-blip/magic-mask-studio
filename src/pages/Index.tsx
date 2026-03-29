import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import UploadCard from "@/components/UploadCard";
import MaskingCanvas from "@/components/MaskingCanvas";
import GenerateTimeline from "@/components/GenerateTimeline";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import OnboardingOverlay from "@/components/OnboardingOverlay";
import { Sparkles } from "lucide-react";

type AppState = "upload" | "masking" | "generating" | "preview";

const spring = { type: "spring" as const, stiffness: 250, damping: 25 };

const stateLabels: Record<AppState, string> = {
  upload: "Siap",
  masking: "Mengarsir",
  generating: "Memproses",
  preview: "Selesai",
};

const Index = () => {
  const [state, setState] = useState<AppState>("upload");
  const [lastFrame, setLastFrame] = useState<string>("");
  const [maskData, setMaskData] = useState<string>("");

  const captureLastFrame = useCallback((file: File) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.src = URL.createObjectURL(file);
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
    };
  }, []);

  const handleMaskDone = (maskDataUrl: string) => { setMaskData(maskDataUrl); };
  const handleGenerate = () => { 
    if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
    setState("generating"); 
  };
  const handleGenerateComplete = useCallback(() => { setState("preview"); }, []);
  const handleReset = () => { setState("upload"); setLastFrame(""); setMaskData(""); };

  return (
    <div className="min-h-screen mesh-gradient-bg max-w-lg mx-auto relative overflow-x-hidden pb-20">
      <OnboardingOverlay />

      <div className="sticky top-0 z-50 glass-nav px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-foreground">AI Magic Studio</span>
        </div>
        <span className="text-[10px] font-bold text-primary uppercase px-3 py-1 bg-primary/10 rounded-full">
          {stateLabels[state]}
        </span>
      </div>

      <div className="px-4 pt-4">
        <AnimatePresence mode="wait">
          {state === "upload" && (
            <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={spring}>
              <UploadCard onVideoSelect={captureLastFrame} />
            </motion.div>
          )}
          {state === "masking" && (
            <motion.div key="masking" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={spring}>
              <MaskingCanvas frameImage={lastFrame} onDone={handleMaskDone} onGenerate={handleGenerate} />
            </motion.div>
          )}
          {state === "generating" && (
            <motion.div key="generating" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={spring}>
              <GenerateTimeline onComplete={handleGenerateComplete} />
            </motion.div>
          )}
          {state === "preview" && (
            <motion.div key="preview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={spring}>
              <BeforeAfterSlider beforeImage={lastFrame} maskData={maskData} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Identitas Pembuat - Versi Aman */}
      <div className="mt-12 mx-4 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] text-center mb-10 shadow-xl">
        <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest mb-1">Official Developer</p>
        <h3 className="text-xl font-extrabold text-white mb-1">Kaka Gibikey Khair</h3>
        <p className="text-xs text-white/50 mb-5">GibiKey Studio • Polsek Tolinggula</p>
        
        <div className="flex gap-3 justify-center">
          <a href="https://wa.me/6285298833350" target="_blank" className="bg-green-500/20 text-green-400 px-4 py-2 rounded-xl text-xs font-bold border border-green-500/30">
            📞 WhatsApp
          </a>
          <a href="https://www.facebook.com/search/top?q=Kaka%20Gibikey%20Khair" target="_blank" className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-xl text-xs font-bold border border-blue-500/30">
            🔵 Facebook
          </a>
        </div>
      </div>
    </div>
  );
};

export default Index;
