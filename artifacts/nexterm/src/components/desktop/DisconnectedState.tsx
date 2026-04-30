import { motion } from "framer-motion";
import { Monitor } from "lucide-react";

interface DisconnectedStateProps {
  onConnect: () => void;
}

export function DisconnectedState({ onConnect }: DisconnectedStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center h-full text-center p-8"
    >
      <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6" style={{ background: "rgba(0,217,255,0.10)" }}>
        <Monitor className="w-10 h-10 text-accent-cyan" />
      </div>
      <h2 className="text-xl font-semibold text-text-primary mb-2">No active remote desktop session</h2>
      <p className="text-sm text-text-secondary max-w-md mb-8">Connect to a server to start viewing its desktop.</p>
      <button
        onClick={onConnect}
        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-sm hover:brightness-110 active:scale-[0.97] transition-all duration-150"
        style={{ background: "#00D9FF", color: "#0B0D10", width: 200 }}
        data-testid="desktop-connect-btn"
      >
        <Monitor className="w-4 h-4" />
        Connect
      </button>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs text-text-muted">Recent:</span>
        <button onClick={onConnect} className="px-3 py-1.5 rounded-full text-xs text-text-secondary bg-bg-tertiary border border-border-default hover:bg-bg-hover hover:text-text-primary transition-colors duration-150" data-testid="desktop-recent-ubuntu">desktop-ubuntu-01</button>
        <button onClick={onConnect} className="px-3 py-1.5 rounded-full text-xs text-text-secondary bg-bg-tertiary border border-border-default hover:bg-bg-hover hover:text-text-primary transition-colors duration-150" data-testid="desktop-recent-staging">staging-rdp</button>
      </div>
    </motion.div>
  );
}
