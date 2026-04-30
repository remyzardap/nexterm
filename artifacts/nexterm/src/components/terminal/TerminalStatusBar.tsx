import { useState, useEffect } from "react";
import { Wifi, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface TerminalStatusBarProps {
  connected?: boolean;
  serverName?: string;
}

export function TerminalStatusBar({ connected = true, serverName }: TerminalStatusBarProps) {
  const [latency, setLatency] = useState(34);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(Math.random() * 20) + 25);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-8 bg-bg-secondary border-t border-border-default flex items-center px-4 shrink-0" style={{ borderTopColor: "rgba(255,255,255,0.10)" }}>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className={cn("inline-flex h-2 w-2 rounded-full", connected ? "bg-accent-green" : "bg-accent-red")} />
            {connected && <span className="absolute inline-flex h-2 w-2 rounded-full bg-accent-green opacity-75 animate-status-pulse" />}
          </span>
          <span className={cn("text-xs font-medium", connected ? "text-accent-green" : "text-accent-red")}>
            {connected ? "Connected" : "Disconnected"}
          </span>
        </div>
        {serverName && <span className="text-xs text-text-secondary">{serverName}</span>}
        <div className="flex items-center gap-1 text-text-secondary">
          <Wifi className="w-3 h-3" />
          <span className="text-xs" style={{ fontFamily: "monospace" }}>{latency}ms</span>
        </div>
        <span className="text-xs text-text-muted">UTF-8</span>
      </div>
      <div className="flex-1 flex items-center justify-end gap-3">
        <span className="text-xs text-text-muted">80×24</span>
        <button className="p-1 rounded hover:bg-bg-hover text-text-muted hover:text-text-primary transition-colors duration-150" data-testid="terminal-settings">
          <Settings className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
