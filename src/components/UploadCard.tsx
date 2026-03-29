import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { useRef } from "react";

interface UploadCardProps {
  onVideoSelect: (file: File) => void;
}

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
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col items-center justify-center px-6 pt-20"
    >
      <motion.h1
        className="text-3xl font-bold tracking-tight text-foreground mb-2 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        AI Magic ✨
      </motion.h1>
      <motion.p
        className="text-muted-foreground text-base mb-10 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Seamless transitions, powered by AI
      </motion.p>

      <motion.button
        onClick={handleClick}
        className="ios-card ios-button-press w-full max-w-sm flex flex-col items-center gap-5 py-12 cursor-pointer"
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
      >
        <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center animate-ios-pulse">
          <Upload className="w-8 h-8 text-accent-foreground" />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">Upload Video</p>
          <p className="text-sm text-muted-foreground mt-1">Tap to select a video file</p>
        </div>
      </motion.button>

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
