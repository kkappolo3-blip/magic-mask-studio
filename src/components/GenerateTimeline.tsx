import { motion } from "framer-motion";
import { Check, Loader2, Video, Frame, Sparkles, Wand2 } from "lucide-react";
import { useEffect, useState } from "react";

interface GenerateTimelineProps {
  onComplete: () => void;
}

const steps = [
  { label: "Video Diunggah", icon: Video },
  { label: "Frame Ditangkap", icon: Frame },
  { label: "AI Sedang Berpikir...", icon: Sparkles },
  { label: "Merangkai Keajaiban", icon: Wand2 },
];

const GenerateTimeline = ({ onComplete }: GenerateTimelineProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setCurrentStep(1), 600),
      setTimeout(() => setCurrentStep(2), 1400),
      setTimeout(() => setCurrentStep(3), 2400),
      setTimeout(() => {
        setCurrentStep(4);
        if (navigator.vibrate) navigator.vibrate([20, 40, 20]);
        setTimeout(onComplete, 500);
      }, 3200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center px-6 pt-16 pb-20 min-h-[75vh]"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 250, damping: 25 }}
        className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mb-8"
      >
        {currentStep < 4 ? (
          <Loader2 className="w-9 h-9 text-primary animate-spin" />
        ) : (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
            <Check className="w-9 h-9 text-primary" />
          </motion.div>
        )}
      </motion.div>

      <h2 className="text-2xl font-bold text-foreground mb-1">
        {currentStep < 4 ? "Menciptakan Keajaiban..." : "Selesai! 🎉"}
      </h2>
      <p className="text-sm text-muted-foreground mb-10">
        {currentStep < 4 ? "Ini tidak akan lama" : "Transisi kamu sudah siap"}
      </p>

      <div className="w-full max-w-xs space-y-0">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const done = currentStep > i;
          const active = currentStep === i;

          return (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 250, damping: 25 }}
              className="flex items-center gap-4 relative"
            >
              {i < steps.length - 1 && (
                <div className="absolute left-5 top-10 w-0.5 h-8 bg-border">
                  <motion.div
                    className="w-full bg-primary"
                    initial={{ height: 0 }}
                    animate={{ height: done ? "100%" : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}

              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${
                  done ? "bg-primary" : active ? "bg-accent border-2 border-primary" : "bg-secondary"
                }`}
              >
                {done ? (
                  <Check className="w-5 h-5 text-primary-foreground" />
                ) : (
                  <Icon className={`w-5 h-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                )}
              </div>

              <span
                className={`text-sm font-medium py-4 ${
                  done ? "text-foreground" : active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {step.label}
                {active && (
                  <motion.span
                    className="inline-block ml-1"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    •••
                  </motion.span>
                )}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default GenerateTimeline;
