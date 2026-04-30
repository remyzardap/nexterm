import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TerminalSession } from "./mockData";

interface TerminalTabsProps {
  sessions: TerminalSession[];
  activeId: string;
  onSwitch: (id: string) => void;
  onClose: (id: string) => void;
  onNew: () => void;
}

export function TerminalTabs({ sessions, activeId, onSwitch, onClose, onNew }: TerminalTabsProps) {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  return (
    <div className="h-10 bg-bg-secondary border-b border-border-default flex items-center px-1 overflow-x-auto shrink-0" style={{ borderBottomColor: "rgba(255,255,255,0.10)" }}>
      <div className="flex items-center gap-0.5 flex-1 min-w-0">
        <AnimatePresence mode="popLayout">
          {sessions.map((session) => {
            const isActive = session.id === activeId;
            return (
              <motion.button
                key={session.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, width: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => onSwitch(session.id)}
                onMouseEnter={() => setHoveredTab(session.id)}
                onMouseLeave={() => setHoveredTab(null)}
                className={cn(
                  "relative flex items-center gap-1.5 h-8 min-w-[120px] max-w-[200px] px-3 rounded-t-lg text-xs font-medium transition-colors duration-150 shrink-0",
                  isActive ? "text-text-primary" : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
                )}
                style={isActive ? { background: "rgba(0,217,255,0.10)" } : {}}
                data-testid={`terminal-tab-${session.id}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ background: "#00D9FF" }}
                    transition={{ duration: 0.25 }}
                  />
                )}
                <Terminal className="w-3 h-3 shrink-0 opacity-70" />
                <span className="truncate flex-1 text-left">{session.name}</span>
                <span
                  onClick={(e) => { e.stopPropagation(); onClose(session.id); }}
                  className={cn(
                    "w-4 h-4 flex items-center justify-center rounded transition-all duration-150 shrink-0",
                    hoveredTab === session.id || isActive ? "opacity-100 hover:bg-accent-red/20 hover:text-accent-red" : "opacity-0"
                  )}
                >
                  <X className="w-3 h-3" />
                </span>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
      <button
        onClick={onNew}
        className="flex items-center justify-center w-8 h-8 rounded-lg text-text-muted hover:text-accent-cyan hover:bg-bg-hover transition-colors duration-150 shrink-0 ml-1"
        title="New Tab"
        data-testid="terminal-new-tab"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
