import { motion } from "framer-motion";
import { Terminal, Monitor, FolderSync, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Session {
  id: string;
  serverName: string;
  ip: string;
  type: "ssh" | "rdp" | "sftp";
  duration: string;
  timeAgo: string;
  status: "active" | "ended";
}

const mockSessions: Session[] = [
  { id: "s1", serverName: "web-server-01", ip: "192.168.1.10", type: "ssh", duration: "2h 34m", timeAgo: "Active", status: "active" },
  { id: "s2", serverName: "db-primary", ip: "192.168.1.20", type: "ssh", duration: "45m", timeAgo: "5m ago", status: "active" },
  { id: "s3", serverName: "staging-rdp", ip: "10.0.0.60", type: "rdp", duration: "1h 12m", timeAgo: "2h ago", status: "ended" },
  { id: "s4", serverName: "homelab", ip: "203.0.113.45", type: "ssh", duration: "22m", timeAgo: "Yesterday", status: "ended" },
  { id: "s5", serverName: "media-server", ip: "192.168.0.20", type: "sftp", duration: "8m", timeAgo: "2 days ago", status: "ended" },
  { id: "s6", serverName: "pi-hole", ip: "192.168.0.15", type: "ssh", duration: "3m", timeAgo: "3 days ago", status: "ended" },
];

function TypeIcon({ type }: { type: Session["type"] }) {
  const cls = "w-4 h-4";
  const map = { ssh: { icon: <Terminal className={cls} />, color: "#00D9FF" }, rdp: { icon: <Monitor className={cls} />, color: "#A259FF" }, sftp: { icon: <FolderSync className={cls} />, color: "#00FF88" } };
  const { icon, color } = map[type];
  return <span style={{ color }}>{icon}</span>;
}

export function RecentSessions() {
  return (
    <div className="bg-bg-secondary rounded-xl border border-border-default overflow-hidden" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-default" style={{ borderBottomColor: "rgba(255,255,255,0.08)" }}>
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Recent Sessions</h3>
          <p className="text-xs text-text-muted mt-0.5">Last 7 days</p>
        </div>
        <button className="text-xs text-text-secondary hover:text-accent-cyan transition-colors duration-150" data-testid="sessions-view-all">View all</button>
      </div>
      <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        {mockSessions.map((session, i) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 + 0.2, duration: 0.3 }}
            className="flex items-center gap-3 px-5 py-3 hover:bg-bg-hover transition-all duration-150 cursor-pointer group"
            data-testid={`session-row-${session.id}`}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-bg-tertiary">
              <TypeIcon type={session.type} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-text-primary truncate">{session.serverName}</span>
                {session.status === "active" && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: "rgba(0,255,136,0.15)", color: "#00FF88" }}>LIVE</span>
                )}
              </div>
              <div className="text-xs text-text-muted font-mono">{session.ip}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="flex items-center gap-1 text-xs text-text-secondary justify-end">
                <Clock className="w-3 h-3" />
                <span>{session.duration}</span>
              </div>
              <div className="text-xs text-text-muted mt-0.5">{session.timeAgo}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
