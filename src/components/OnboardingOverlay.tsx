import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Paintbrush, Sparkles, ChevronRight } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Unggah Video Kamu",
    description: "Ketuk tombol 'Pilih Video' untuk memilih video dari galeri. Kami akan otomatis menangkap frame terakhir.",
  },
  {
    icon: Paintbrush,
    title: "Arsir Objek Ajaib",
    description: "Gunakan jari atau mouse untuk mengarsir area yang ingin kamu ubah. Atur ukuran kuas sesuai kebutuhan.",
  },
  {
    icon: Sparkles,
    title: "Mulai Keajaiban!",
    description: "Tekan tombol 'Mulai Keajaiban' dan biarkan AI bekerja. Hasil bisa dilihat dan diunduh!",
  },
];

const spring = { type: "spring" as const, stiffness: 250, damping: 25 };

const OnboardingOverlay = () => {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem("ai-magic-onboarded");
    if (!seen) setVisible(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem("ai-magic-onboarded", "true");
    setVisible(false);
  };

  const next = () => {
    if (navigator.vibrate) navigator.vibrate(10);
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      dismiss();
    }
  };

  if (!visible) return null;

  const current = steps[step];
  const Icon = current.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-6"
        style={{ background: "hsla(220, 20%, 10%, 0.6)", backdropFilter: "blur(8px)" }}
      >
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={spring}
          className="glass-card max-w-sm w-full text-center"
          style={{ border: "1px solid hsla(0, 0%, 100%, 0.2)" }}
        >
          <motion.div
            initial={{ scale: 0.7 }}
            animate={{ scale: 1 }}
            transition={spring}
            className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5"
          >
            <Icon className="w-8 h-8 text-primary" />
          </motion.div>

          <h3 className="text-xl font-bold text-foreground mb-2">{current.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">{current.description}</p>

          {/* Step dots */}
          <div className="flex items-center justify-center gap-2 mb-5">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>

          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={dismiss}
              className="ios-button-press flex-1 py-3 rounded-full text-sm font-medium text-muted-foreground bg-secondary/60"
            >
              Lewati
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={next}
              className="ios-button-press flex-[2] py-3 rounded-full bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-1"
              style={{ boxShadow: "var(--shadow-button)" }}
            >
              {step < steps.length - 1 ? "Lanjut" : "Mulai!"}
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OnboardingOverlay;
