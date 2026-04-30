import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LatencyPoint {
  time: string;
  value: number;
}

function generateLatencyData(count = 20): LatencyPoint[] {
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => ({
    time: new Date(now - (count - 1 - i) * 5000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }),
    value: Math.floor(Math.random() * 40) + 20,
  }));
}

interface LatencyChartProps {
  serverName?: string;
  className?: string;
}

export function LatencyChart({ serverName, className }: LatencyChartProps) {
  const [data, setData] = useState<LatencyPoint[]>(() => generateLatencyData(20));
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const next = [...prev.slice(1), {
          time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }),
          value: Math.floor(Math.random() * 40) + 20,
        }];
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const w = 600; const h = 120;
  const padL = 8; const padR = 8; const padT = 8; const padB = 24;
  const graphW = w - padL - padR;
  const graphH = h - padT - padB;
  const values = data.map((d) => d.value);
  const minVal = Math.max(0, Math.min(...values) - 10);
  const maxVal = Math.max(...values) + 10;

  const xCoord = (i: number) => padL + (i / (data.length - 1)) * graphW;
  const yCoord = (v: number) => padT + graphH - ((v - minVal) / (maxVal - minVal)) * graphH;
  const points = data.map((d, i) => `${xCoord(i)},${yCoord(d.value)}`).join(" ");
  const areaPoints = `${padL},${padT + graphH} ${points} ${xCoord(data.length - 1)},${padT + graphH}`;

  const avgLatency = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  const maxLatency = Math.max(...values);
  const minLatency = Math.min(...values);
  const currentLatency = values[values.length - 1];

  return (
    <div className={cn("bg-bg-secondary rounded-xl border border-border-default p-4 flex flex-col gap-3", className)} style={{ borderColor: "rgba(255,255,255,0.08)" }}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-text-primary">Latency Monitor</div>
          {serverName && <div className="text-xs text-text-muted mt-0.5">{serverName}</div>}
        </div>
        <div className="flex items-center gap-4">
          {[
            { label: "Current", value: `${currentLatency}ms`, color: "#00D9FF" },
            { label: "Avg", value: `${avgLatency}ms`, color: "#00FF88" },
            { label: "Max", value: `${maxLatency}ms`, color: "#FF4757" },
          ].map((m) => (
            <div key={m.label} className="text-right">
              <div className="text-xs text-text-muted">{m.label}</div>
              <div className="text-sm font-mono font-semibold" style={{ color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative flex-1">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${w} ${h}`}
          preserveAspectRatio="none"
          className="w-full"
          style={{ height: 120 }}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const relX = (e.clientX - rect.left) / rect.width;
            const idx = Math.round(relX * (data.length - 1));
            setHoverIndex(Math.max(0, Math.min(data.length - 1, idx)));
          }}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="latencyAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#00D9FF" stopOpacity="0.02" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {[0.25, 0.5, 0.75].map((f) => (
            <line key={f} x1={padL} x2={w - padR} y1={padT + graphH * (1 - f)} y2={padT + graphH * (1 - f)}
              stroke="rgba(255,255,255,0.05)" strokeDasharray="4,4" strokeWidth="1" />
          ))}

          <motion.polygon
            key={data.length}
            points={areaPoints}
            fill="url(#latencyAreaGrad)"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
          />
          <motion.polyline
            key={`line-${data.length}`}
            points={points}
            fill="none"
            stroke="#00D9FF"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            filter="url(#glow)"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeOut" }}
          />

          {hoverIndex !== null && (
            <>
              <line x1={xCoord(hoverIndex)} x2={xCoord(hoverIndex)} y1={padT} y2={padT + graphH} stroke="rgba(0,217,255,0.3)" strokeWidth="1" strokeDasharray="4,4" />
              <circle cx={xCoord(hoverIndex)} cy={yCoord(data[hoverIndex].value)} r="5" fill="#00D9FF" stroke="#0B0D10" strokeWidth="2" />
              <rect x={Math.max(padL, Math.min(xCoord(hoverIndex) - 40, w - padR - 80))} y={padT} width="80" height="32" rx="4" fill="rgba(13,16,20,0.9)" stroke="rgba(0,217,255,0.3)" strokeWidth="1" />
              <text x={Math.max(padL, Math.min(xCoord(hoverIndex) - 40, w - padR - 80)) + 40} y={padT + 13} fill="#00D9FF" fontFamily="monospace" fontSize="11" fontWeight="700" textAnchor="middle">{data[hoverIndex].value}ms</text>
              <text x={Math.max(padL, Math.min(xCoord(hoverIndex) - 40, w - padR - 80)) + 40} y={padT + 26} fill="rgba(255,255,255,0.5)" fontFamily="monospace" fontSize="9" textAnchor="middle">{data[hoverIndex].time}</text>
            </>
          )}

          <text x={padL} y={padT + graphH + 16} fill="rgba(255,255,255,0.2)" fontSize="9" fontFamily="monospace">{data[0].time}</text>
          <text x={(w / 2)} y={padT + graphH + 16} fill="rgba(255,255,255,0.2)" fontSize="9" fontFamily="monospace" textAnchor="middle">{data[Math.floor(data.length / 2)].time}</text>
          <text x={w - padR} y={padT + graphH + 16} fill="rgba(255,255,255,0.2)" fontSize="9" fontFamily="monospace" textAnchor="end">{data[data.length - 1].time}</text>
        </svg>
      </div>
    </div>
  );
}
