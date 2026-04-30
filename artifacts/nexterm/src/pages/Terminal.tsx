import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { TerminalTabs } from "@/components/terminal/TerminalTabs";
import { XtermTerminal } from "@/components/terminal/XtermTerminal";
import { TerminalStatusBar } from "@/components/terminal/TerminalStatusBar";
import { SftpPanel } from "@/components/terminal/SftpPanel";
import { TerminalSearch } from "@/components/terminal/TerminalSearch";
import { initialSessions, createSession, type TerminalSession } from "@/components/terminal/mockData";

export default function Terminal() {
  const [sessions, setSessions] = useState<TerminalSession[]>(initialSessions);
  const [activeSessionId, setActiveSessionId] = useState<string>(initialSessions[0].id);
  const [sftpOpen, setSftpOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? sessions[0];

  const handleCloseTab = useCallback((id: string) => {
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      if (filtered.length === 0) return prev;
      if (activeSessionId === id) setActiveSessionId(filtered[filtered.length - 1].id);
      return filtered;
    });
  }, [activeSessionId]);

  const handleNewTab = useCallback(() => {
    const newSession = createSession(`session-${sessions.length + 1}`, "10.0.0.50");
    setSessions((prev) => [...prev, newSession]);
    setActiveSessionId(newSession.id);
  }, [sessions.length]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "f") {
      e.preventDefault();
      setSearchOpen((p) => !p);
    }
  };

  return (
    <div className="flex flex-col h-full" onKeyDown={handleKeyDown} tabIndex={0} style={{ outline: "none" }}>
      <TerminalTabs
        sessions={sessions}
        activeId={activeSessionId}
        onSwitch={setActiveSessionId}
        onClose={handleCloseTab}
        onNew={handleNewTab}
      />

      <div className="flex-1 flex relative min-h-0">
        <div className="flex-1 relative min-w-0">
          <AnimatePresence>
            {searchOpen && (
              <TerminalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {sessions.map((session) => (
              <motion.div
                key={session.id}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: session.id === activeSessionId ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                style={{ pointerEvents: session.id === activeSessionId ? "auto" : "none", zIndex: session.id === activeSessionId ? 1 : 0 }}
              >
                <XtermTerminal session={session} active={session.id === activeSessionId} />
              </motion.div>
            ))}
          </AnimatePresence>

          {!sftpOpen && (
            <button
              onClick={() => setSftpOpen(true)}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-6 h-16 bg-bg-secondary border border-border-default rounded-l-lg text-text-muted hover:text-accent-cyan hover:bg-bg-hover transition-colors duration-150"
              title="Open SFTP Panel"
              data-testid="sftp-open-btn-main"
            >
              <span className="text-xs">⟨</span>
            </button>
          )}
        </div>

        <AnimatePresence>
          {sftpOpen && (
            <SftpPanel
              isOpen={sftpOpen}
              onToggle={() => setSftpOpen(!sftpOpen)}
              serverName={activeSession?.name}
            />
          )}
        </AnimatePresence>
      </div>

      <TerminalStatusBar connected={activeSession?.connected ?? true} serverName={activeSession?.name} />
    </div>
  );
}
