import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const subStatusMessages = ["Negotiating protocol...", "Authenticating...", "Loading desktop..."];

interface LoadingStateProps {
  onCancel: () => void;
}

export function LoadingState({ onCancel }: LoadingStateProps) {
  const [subStatusIndex, setSubStatusIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSubStatusIndex((prev) => (prev + 1) % subStatusMessages.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center h-full"
    >
      <div className="relative mb-6">
        <div className="w-12 h-12 rounded-full border-4 border-t-accent-cyan animate-spin" style={{ borderColor: "rgba(0,217,255,0.2)", borderTopColor: "#00D9FF" }} />
      </div>
      <p className="text-sm text-text-primary font-medium mb-1">
        Establishing remote session
        <span className="inline-flex ml-1">
          <span className="animate-pulse">.</span>
          <span className="animate-pulse" style={{ animationDelay: "0.3s" }}>.</span>
          <span className="animate-pulse" style={{ animationDelay: "0.6s" }}>.</span>
        </span>
      </p>
      <div className="h-5 mb-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={subStatusIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-xs text-text-secondary"
          >
            {subStatusMessages[subStatusIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
      <button
        onClick={onCancel}
        className="px-4 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-all duration-150"
        data-testid="desktop-cancel-btn"
      >
        Cancel
      </button>
    </motion.div>
  );
}
