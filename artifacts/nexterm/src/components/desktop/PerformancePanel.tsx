import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PerformanceMetrics {
  latency: number;
  fps: number;
  bandwidth: number;
  cpuServer: number;
  ramServer: number;
}

function MiniSparkline({ value, color }: { value: number; color: string }) {
  const w = 48;
  const h = 20;
  const points = Array.from({ length: 8 }, () => Math.random() * 0.5 + value / 100 * 0.7);
  const max = Math.max(...points, 0.01);
  const pts = points.map((p, i) => `${(i / (points.length - 1)) * w},${h - (p / max) * h}`).join(" ");
  return (
    <svg width={w} height={h} className="shrink-0" style={{ color }}>
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" opacity="0.7" />
    </svg>
  );
}

export function PerformancePanel() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({ latency: 45, fps: 25, bandwidth: 4.2, cpuServer: 23, ramServer: 62 });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        latency: Math.floor(Math.random() * 40) + 20,
        fps: Math.floor(Math.random() * 15) + 20,
        bandwidth: Math.round((Math.random() * 3 + 3) * 10) / 10,
        cpuServer: Math.floor(Math.random() * 20) + 18,
        ramServer: Math.floor(Math.random() * 15) + 58,
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="absolute bottom-4 right-4 z-50 rounded-xl bg-bg-secondary border border-border-default shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
      style={{ borderColor: "rgba(255,255,255,0.10)" }}
      data-testid="performance-panel"
    >
      <button
        onClick={() => setIsExpanded((p) => !p)}
        className="flex items-center gap-2 px-3 py-2 w-full"
        data-testid="performance-panel-toggle"
      >
        <BarChart2 className="w-4 h-4 text-accent-cyan shrink-0" />
        <span className="text-xs font-medium text-text-primary flex-1 text-left">Performance</span>
        <motion.span animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
        </motion.span>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-3 border-t border-border-default" style={{ borderTopColor: "rgba(255,255,255,0.08)" }}>
              <div className="pt-2 space-y-2.5">
                {[
                  { label: "Latency", value: `${metrics.latency}ms`, rawValue: metrics.latency, max: 100, color: "#00D9FF" },
                  { label: "FPS", value: `${metrics.fps}`, rawValue: metrics.fps, max: 60, color: "#00FF88" },
                  { label: "Bandwidth", value: `${metrics.bandwidth} MB/s`, rawValue: metrics.bandwidth * 10, max: 100, color: "#A259FF" },
                  { label: "CPU (Server)", value: `${metrics.cpuServer}%`, rawValue: metrics.cpuServer, max: 100, color: "#FFB800" },
                  { label: "RAM (Server)", value: `${metrics.ramServer}%`, rawValue: metrics.ramServer, max: 100, color: "#FF4757" },
                ].map((m) => (
                  <div key={m.label} className="flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-text-muted">{m.label}</span>
                        <span className="text-[10px] font-mono font-medium" style={{ color: m.color }}>{m.value}</span>
                      </div>
                      <div className="h-1 bg-bg-tertiary rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: m.color }}
                          animate={{ width: `${Math.min((m.rawValue / m.max) * 100, 100)}%` }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                    <MiniSparkline value={m.rawValue} color={m.color} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
