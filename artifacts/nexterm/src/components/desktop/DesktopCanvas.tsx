import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

interface DesktopCanvasProps {
  serverName: string;
}

function generateFakeDesktop(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = "#2C3E50";
  ctx.fillRect(0, 0, w, h);

  const dotSize = 1.5;
  const spacing = 24;
  ctx.fillStyle = "rgba(255,255,255,0.04)";
  for (let x = 0; x < w; x += spacing) {
    for (let y = 0; y < h; y += spacing) {
      ctx.beginPath();
      ctx.arc(x, y, dotSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const taskbarH = 32;
  ctx.fillStyle = "#1a1f2b";
  ctx.fillRect(0, h - taskbarH, w, taskbarH);
  const startSize = 24;
  ctx.fillStyle = "#3498DB";
  ctx.fillRect(4, h - taskbarH + 4, startSize, startSize);
  ctx.fillStyle = "white";
  ctx.font = "bold 11px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("⊞", 4 + startSize / 2, h - taskbarH + 17);

  const apps = ["📁", "🌐", "⚙️", "📊"];
  apps.forEach((icon, i) => {
    const x = 36 + i * 40;
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.beginPath();
    ctx.roundRect(x, h - taskbarH + 2, 30, 28, 4);
    ctx.fill();
    ctx.font = "16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(icon, x + 15, h - taskbarH + 19);
  });

  ctx.fillStyle = "rgba(30,39,46,0.96)";
  ctx.beginPath();
  ctx.roundRect(40, 40, Math.min(500, w - 80), Math.min(300, h - 120), 8);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = 1;
  ctx.stroke();
  const winH = Math.min(300, h - 120);
  const winW = Math.min(500, w - 80);
  ctx.fillStyle = "rgba(15,20,25,0.6)";
  ctx.fillRect(40, 40, winW, 32);
  ["#FF5F57", "#FEBC2E", "#28C840"].forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(58 + i * 20, 56, 6, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = "12px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("Terminal — bash", 115, 60);
  ctx.fillStyle = "#00FF88";
  ctx.font = "13px monospace";
  const lines = ["$ ls -la /var/www/", "total 48", "drwxr-xr-x 4 www-data  4096 Apr 28 09:32 .", "drwxr-xr-x 8 root      4096 Apr 15 14:21 ..", "drwxr-xr-x 3 www-data  4096 Apr 26 16:20 html", "drwxr-xr-x 2 www-data  4096 Apr 28 08:11 logs", "$ docker ps", "NAMES       IMAGE     STATUS     PORTS", "app-server  node:18   Up 3 days  3000/tcp", "$ _"];
  lines.forEach((line, i) => {
    ctx.fillStyle = i === 0 || i === 7 || i === 9 ? "#00FF88" : i === 6 ? "#00FF88" : "rgba(232,236,241,0.85)";
    ctx.fillText(line, 50, 90 + i * 18);
  });

  const dx = 40 + winW + 30;
  if (dx + 280 < w) {
    ctx.fillStyle = "rgba(30,39,46,0.92)";
    ctx.beginPath();
    ctx.roundRect(dx, 40, 280, 200, 8);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = "rgba(15,20,25,0.6)";
    ctx.fillRect(dx, 40, 280, 32);
    ["#FF5F57", "#FEBC2E", "#28C840"].forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(dx + 18 + i * 20, 56, 6, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("System Monitor", dx + 75, 61);
    const bars = [{ l: "CPU", v: 0.23, c: "#00D9FF" }, { l: "RAM", v: 0.62, c: "#A259FF" }, { l: "Disk", v: 0.45, c: "#00FF88" }, { l: "Net", v: 0.15, c: "#FFB800" }];
    bars.forEach((b, i) => {
      const by = 90 + i * 38;
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.font = "11px sans-serif";
      ctx.fillText(b.l, dx + 14, by);
      ctx.fillText(`${Math.round(b.v * 100)}%`, dx + 250, by);
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      ctx.beginPath();
      ctx.roundRect(dx + 14, by + 8, 220, 10, 4);
      ctx.fill();
      ctx.fillStyle = b.c;
      ctx.beginPath();
      ctx.roundRect(dx + 14, by + 8, 220 * b.v, 10, 4);
      ctx.fill();
    });
  }

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = "12px sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(timeStr, w - 10, h - taskbarH + 19);
}

export function DesktopCanvas({ serverName }: DesktopCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isCustomCursor, setIsCustomCursor] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const draw = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      canvas.width = w;
      canvas.height = h;
      generateFakeDesktop(ctx, w, h);
    };
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(container);
    return () => observer.disconnect();
  }, [serverName]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      style={{ cursor: "none" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsCustomCursor(true)}
      onMouseLeave={() => setIsCustomCursor(false)}
      data-testid="desktop-canvas"
    >
      <canvas ref={canvasRef} className="w-full h-full" style={{ imageRendering: "crisp-edges" }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(11,13,16,0.10)" }} />
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.03) 3px, rgba(0,0,0,0.03) 4px)", backgroundSize: "100% 4px" }} />
      {isCustomCursor && (
        <div
          className="absolute pointer-events-none z-50 w-5 h-5 rounded-full border-2 border-accent-cyan"
          style={{ left: cursorPos.x - 10, top: cursorPos.y - 10, background: "rgba(0,217,255,0.15)", boxShadow: "0 0 8px rgba(0,217,255,0.4)" }}
        />
      )}
    </div>
  );
}
