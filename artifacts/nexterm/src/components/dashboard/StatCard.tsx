import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  accentColor?: string;
  trend?: { value: number; label: string };
  index?: number;
}

export function StatCard({ title, value, subtitle, icon, accentColor = "#00D9FF", trend, index = 0 }: StatCardProps) {
  const isPositive = trend && trend.value > 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="relative bg-bg-secondary rounded-xl border border-border-default p-5 overflow-hidden hover:border-border-accent transition-all duration-300 cursor-default group"
      style={{ borderColor: "rgba(255,255,255,0.08)" }}
      data-testid={`stat-card-${title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ background: `radial-gradient(circle at 80% 20%, ${accentColor}08 0%, transparent 60%)` }} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-text-muted uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold font-display" style={{ color: accentColor }}>{value}</span>
            {subtitle && <span className="text-xs text-text-muted">{subtitle}</span>}
          </div>
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <span className={cn("text-xs font-medium", isPositive ? "text-accent-green" : "text-accent-red")}>
                {isPositive ? "▲" : "▼"} {Math.abs(trend.value)}
              </span>
              <span className="text-xs text-text-muted">{trend.label}</span>
            </div>
          )}
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${accentColor}18` }}>
          <span style={{ color: accentColor }}>{icon}</span>
        </div>
      </div>
    </motion.div>
  );
}
