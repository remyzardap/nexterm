import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Server, ChevronDown, Terminal, Monitor, FolderSync, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServerItem {
  id: string;
  name: string;
  ip: string;
  port: number;
  type: "ssh" | "rdp" | "sftp";
  status: "connected" | "connecting" | "disconnected";
  cpu: number;
  ram: number;
  uptime?: string;
  lastSeen: string;
  os?: string;
}

interface ServerGroup {
  id: string;
  name: string;
  color: string;
  servers: ServerItem[];
}

const mockGroups: ServerGroup[] = [
  {
    id: "prod",
    name: "Production",
    color: "#FF4757",
    servers: [
      { id: "p1", name: "web-server-01", ip: "192.168.1.10", port: 22, type: "ssh", status: "connected", cpu: 23, ram: 64, uptime: "14d 3h", lastSeen: "2m ago", os: "Ubuntu 22.04" },
      { id: "p2", name: "db-primary", ip: "192.168.1.20", port: 22, type: "ssh", status: "connected", cpu: 45, ram: 78, uptime: "14d 3h", lastSeen: "1m ago", os: "Ubuntu 22.04" },
      { id: "p3", name: "load-balancer", ip: "192.168.1.5", port: 22, type: "ssh", status: "connected", cpu: 12, ram: 32, uptime: "14d 3h", lastSeen: "3m ago", os: "Ubuntu 22.04" },
      { id: "p4", name: "db-replica", ip: "192.168.1.21", port: 22, type: "ssh", status: "disconnected", cpu: 0, ram: 0, lastSeen: "2h ago", os: "Ubuntu 22.04" },
    ],
  },
  {
    id: "staging",
    name: "Staging",
    color: "#FFB800",
    servers: [
      { id: "s1", name: "staging-web", ip: "10.0.0.50", port: 22, type: "ssh", status: "connected", cpu: 8, ram: 42, uptime: "3d 12h", lastSeen: "15m ago", os: "Ubuntu 20.04" },
      { id: "s2", name: "staging-rdp", ip: "10.0.0.60", port: 3389, type: "rdp", status: "disconnected", cpu: 0, ram: 0, lastSeen: "1 day ago", os: "Windows Server 2022" },
    ],
  },
  {
    id: "personal",
    name: "Personal VPS",
    color: "#00FF88",
    servers: [
      { id: "v1", name: "homelab", ip: "203.0.113.45", port: 22, type: "ssh", status: "connected", cpu: 15, ram: 58, uptime: "21d 7h", lastSeen: "10m ago", os: "Arch Linux" },
      { id: "v2", name: "pi-hole", ip: "192.168.0.15", port: 22, type: "ssh", status: "connected", cpu: 4, ram: 28, uptime: "60d 5h", lastSeen: "8m ago", os: "Raspberry Pi OS" },
    ],
  },
];

function StatusBadge({ status }: { status: ServerItem["status"] }) {
  const map = { connected: { text: "Online", bg: "rgba(0,255,136,0.12)", color: "#00FF88" }, connecting: { text: "Connecting", bg: "rgba(255,184,0,0.12)", color: "#FFB800" }, disconnected: { text: "Offline", bg: "rgba(255,71,87,0.12)", color: "#FF4757" } };
  const { text, bg, color } = map[status];
  return (
    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0" style={{ background: bg, color }}>
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        <span className="inline-flex h-1.5 w-1.5 rounded-full" style={{ background: color }} />
        {status === "connected" && <span className="absolute inline-flex h-1.5 w-1.5 rounded-full opacity-75 animate-status-pulse" style={{ background: color }} />}
      </span>
      {text}
    </span>
  );
}

function MiniBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-16 h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="text-[10px] font-mono text-text-muted w-7">{value}%</span>
    </div>
  );
}

function TypeIconBadge({ type }: { type: ServerItem["type"] }) {
  const map = { ssh: { icon: <Terminal className="w-3.5 h-3.5" />, color: "#00D9FF" }, rdp: { icon: <Monitor className="w-3.5 h-3.5" />, color: "#A259FF" }, sftp: { icon: <FolderSync className="w-3.5 h-3.5" />, color: "#00FF88" } };
  const { icon, color } = map[type];
  return <span style={{ color }}>{icon}</span>;
}

export function ServerGroups() {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({ prod: true, staging: false, personal: false });
  const toggleGroup = (id: string) => setExpandedGroups((p) => ({ ...p, [id]: !p[id] }));

  return (
    <div className="flex flex-col gap-3">
      {mockGroups.map((group, gi) => {
        const connectedCount = group.servers.filter((s) => s.status === "connected").length;
        return (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: gi * 0.1 + 0.15, duration: 0.35 }}
            className="bg-bg-secondary rounded-xl border border-border-default overflow-hidden"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
          >
            <button
              onClick={() => toggleGroup(group.id)}
              className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-bg-hover transition-colors duration-150"
              data-testid={`server-group-${group.id}`}
            >
              <div className="w-3 h-3 rounded-full shrink-0" style={{ background: group.color }} />
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-text-primary">{group.name}</h3>
                <span className="text-xs text-text-muted px-2 py-0.5 rounded-full bg-bg-tertiary">{connectedCount}/{group.servers.length}</span>
              </div>
              <Server className="w-4 h-4 text-text-muted shrink-0" />
              <motion.span animate={{ rotate: expandedGroups[group.id] ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-4 h-4 text-text-muted shrink-0" />
              </motion.span>
            </button>

            <AnimatePresence>
              {expandedGroups[group.id] && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                  <div className="border-t border-border-default" style={{ borderTopColor: "rgba(255,255,255,0.06)" }}>
                    {group.servers.map((server, si) => (
                      <div key={server.id} className={cn("flex items-center gap-4 px-5 py-3.5 hover:bg-bg-hover transition-all duration-150 cursor-pointer", si < group.servers.length - 1 && "border-b border-border-default")} style={{ borderBottomColor: "rgba(255,255,255,0.04)" }} data-testid={`server-item-${server.id}`}>
                        <TypeIconBadge type={server.type} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-text-primary truncate">{server.name}</span>
                            <StatusBadge status={server.status} />
                          </div>
                          <div className="text-xs text-text-muted font-mono mt-0.5">{server.ip}:{server.port} {server.os && `• ${server.os}`}</div>
                        </div>
                        {server.status === "connected" && (
                          <div className="hidden lg:flex flex-col gap-1 shrink-0">
                            <MiniBar value={server.cpu} color="#00D9FF" />
                            <MiniBar value={server.ram} color="#A259FF" />
                          </div>
                        )}
                        <div className="text-right shrink-0 hidden md:block">
                          {server.uptime && <div className="text-xs text-text-secondary">{server.uptime}</div>}
                          <div className="text-xs text-text-muted mt-0.5">{server.lastSeen}</div>
                        </div>
                        <button className="p-1.5 rounded-lg text-text-muted hover:text-accent-cyan hover:bg-bg-hover transition-colors duration-150 shrink-0 opacity-0 group-hover:opacity-100" data-testid={`server-connect-${server.id}`}>
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
