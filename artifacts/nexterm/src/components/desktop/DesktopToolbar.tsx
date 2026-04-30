import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Monitor, Keyboard, Clipboard, RefreshCw, ZoomIn, ZoomOut, Maximize2,
  Minimize2, ChevronDown, Settings, Wifi,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DesktopToolbarProps {
  isFullscreen: boolean;
  onFullscreen: () => void;
  onRefresh: () => void;
  serverName: string;
  connected: boolean;
}

export function DesktopToolbar({
  isFullscreen, onFullscreen, onRefresh, serverName, connected,
}: DesktopToolbarProps) {
  const [quality, setQuality] = useState<"low" | "medium" | "high">("high");
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [zoom, setZoom] = useState(100);

  const qualities = ["low", "medium", "high"] as const;

  const qualityColor = { low: "text-accent-amber", medium: "text-accent-green", high: "text-accent-cyan" };

  return (
    <div
      className="absolute top-3 left-1/2 -translate-x-1/2 z-50"
      data-testid="desktop-toolbar"
    >
      <div
        className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-bg-secondary border border-border-default shadow-[0_8px_24px_rgba(0,0,0,0.5)] backdrop-blur-md"
        style={{ borderColor: "rgba(255,255,255,0.12)" }}
      >
        <div className="flex items-center gap-1.5 pr-3 border-r border-border-default" style={{ borderRightColor: "rgba(255,255,255,0.10)" }}>
          <Monitor className="w-4 h-4 text-accent-cyan shrink-0" />
          <span className="text-xs text-text-primary font-medium">{serverName}</span>
          <div className="flex items-center gap-1">
            <span className="relative flex h-1.5 w-1.5">
              <span className={cn("inline-flex h-1.5 w-1.5 rounded-full", connected ? "bg-accent-green" : "bg-accent-red")} />
              {connected && <span className="absolute inline-flex h-1.5 w-1.5 rounded-full bg-accent-green opacity-75 animate-status-pulse" />}
            </span>
          </div>
        </div>

        <button className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors duration-150" title="Send Ctrl+Alt+Del">
          <Keyboard className="w-4 h-4" />
        </button>
        <button className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors duration-150" title="Clipboard">
          <Clipboard className="w-4 h-4" />
        </button>
        <button onClick={onRefresh} className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors duration-150" title="Reconnect" data-testid="desktop-refresh">
          <RefreshCw className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-border-default mx-0.5" />

        <button onClick={() => setZoom((z) => Math.max(50, z - 10))} className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors duration-150">
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-xs text-text-secondary w-9 text-center" style={{ fontVariantNumeric: "tabular-nums" }}>{zoom}%</span>
        <button onClick={() => setZoom((z) => Math.min(200, z + 10))} className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors duration-150">
          <ZoomIn className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-border-default mx-0.5" />

        <div className="relative">
          <button
            onClick={() => setShowQualityMenu((p) => !p)}
            className="flex items-center gap-1 px-2 py-1.5 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors duration-150"
            data-testid="desktop-quality-btn"
          >
            <Wifi className="w-4 h-4" />
            <span className={cn("text-xs font-medium capitalize", qualityColor[quality])}>{quality}</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          <AnimatePresence>
            {showQualityMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full mt-2 left-0 bg-bg-secondary border border-border-default rounded-lg overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.4)] z-50"
                style={{ borderColor: "rgba(255,255,255,0.10)" }}
              >
                {qualities.map((q) => (
                  <button
                    key={q}
                    onClick={() => { setQuality(q); setShowQualityMenu(false); }}
                    className={cn("flex items-center gap-2 w-full px-4 py-2 text-xs hover:bg-bg-hover transition-colors capitalize", q === quality ? qualityColor[q] : "text-text-secondary")}
                  >
                    {q}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button onClick={onFullscreen} className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors duration-150" data-testid="desktop-fullscreen">
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
        <button className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors duration-150">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
