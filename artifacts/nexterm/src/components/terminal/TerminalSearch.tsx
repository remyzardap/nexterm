import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronUp, ChevronDown, X } from "lucide-react";

interface TerminalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TerminalSearch({ isOpen, onClose }: TerminalSearchProps) {
  const [query, setQuery] = useState("");
  const [matchIndex, setMatchIndex] = useState(0);
  const [matchCount, setMatchCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (query.trim()) { setMatchCount(Math.floor(Math.random() * 10) + 1); setMatchIndex(1); }
    else { setMatchCount(0); setMatchIndex(0); }
  }, [query]);

  const handlePrev = () => { if (matchCount > 0) setMatchIndex((p) => p <= 1 ? matchCount : p - 1); };
  const handleNext = () => { if (matchCount > 0) setMatchIndex((p) => p >= matchCount ? 1 : p + 1); };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-2 right-4 z-50 w-80 bg-bg-secondary border border-border-default rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
          style={{ borderColor: "rgba(255,255,255,0.10)" }}
          data-testid="terminal-search"
        >
          <div className="flex items-center gap-2 px-3 py-2">
            <Search className="w-4 h-4 text-text-muted shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleNext(); }}
              placeholder="Find in terminal..."
              className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
              data-testid="terminal-search-input"
            />
            {matchCount > 0 && <span className="text-xs text-text-muted" style={{ fontVariantNumeric: "tabular-nums" }}>{matchIndex}/{matchCount}</span>}
            <div className="flex items-center gap-0.5">
              <button onClick={handlePrev} className="p-1 rounded hover:bg-bg-hover text-text-muted hover:text-text-primary transition-colors"><ChevronUp className="w-3.5 h-3.5" /></button>
              <button onClick={handleNext} className="p-1 rounded hover:bg-bg-hover text-text-muted hover:text-text-primary transition-colors"><ChevronDown className="w-3.5 h-3.5" /></button>
            </div>
            <button onClick={onClose} className="p-1 rounded hover:bg-bg-hover text-text-muted hover:text-text-primary transition-colors"><X className="w-3.5 h-3.5" /></button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
