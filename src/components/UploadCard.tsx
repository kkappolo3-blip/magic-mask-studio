import { motion } from "framer-motion";
import { Upload, Video } from "lucide-react";
import { useRef } from "react";

interface UploadCardProps {
  onVideoSelect: (file: File) => void;
}

const spring = { type: "spring" as const, stiffness: 250, damping: 25 };

const UploadCard = ({ onVideoSelect }: UploadCardProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (navigator.vibrate) navigator.vibrate(20);
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onVideoSelect(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring, delay: 0.1 }}
      className="flex flex-col items-center justify-center px-6 pt-16"
    >
      <motion.div
        className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...spring, delay: 0.2 }}
      >
        <Video className="w-8 h-8 text-primary" />
      </motion.div>

      <motion.h1
        className="text-3xl font-extrabold tracking-tight text-foreground mb-2 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.25 }}
      >
        AI Magic ✨
      </motion.h1>
      <motion.p
        className="text-muted-foreground text-base mb-10 text-center max-w-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        Transisi mulus, ditenagai oleh AI
      </motion.p>

      <motion.button
        onClick={handleClick}
        className="glass-card ios-button-press w-full max-w-sm flex flex-col items-center gap-5 py-14 cursor-pointer"
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...spring, delay: 0.4 }}
      >
        <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center animate-ios-pulse">
          <Upload className="w-8 h-8 text-accent-foreground" />
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-foreground">Pilih Video</p>
          <p className="text-sm text-muted-foreground mt-1">Ketuk untuk memilih dari galeri</p>
        </div>
      </motion.button>

      <motion.p
        className="text-xs text-muted-foreground/60 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Mendukung MP4, MOV, WebM
      </motion.p>

      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleChange}
      />
    </motion.div>
  );
};

export default UploadCard;
