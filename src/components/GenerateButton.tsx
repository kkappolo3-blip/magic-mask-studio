import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface GenerateButtonProps {
  onGenerate: () => void;
}

const GenerateButton = ({ onGenerate }: GenerateButtonProps) => {
  const handleClick = () => {
    if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
    onGenerate();
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="fixed bottom-0 left-0 right-0 p-6 pb-8 bg-gradient-to-t from-background via-background to-transparent"
    >
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className="ios-button-press w-full py-5 rounded-lg bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center gap-3 animate-shimmer"
        style={{
          boxShadow: "var(--shadow-button)",
          backgroundSize: "200% 100%",
        }}
      >
        <Sparkles className="w-6 h-6" />
        Generate Magic
      </motion.button>
    </motion.div>
  );
};

export default GenerateButton;
