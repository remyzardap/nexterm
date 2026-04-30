import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Terminal,
  Monitor,
  FolderSync,
  Server,
  Plus,
  LayoutDashboard,
  Link2,
  Settings,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { NexTermLogo, NexTermWordmark } from "./Logo";
import { cn } from "@/lib/utils";

export interface ServerItem {
  id: string;
  name: string;
  ip: string;
  port: number;
  type: "ssh" | "rdp" | "sftp";
  status: "connected" | "connecting" | "disconnected" | "never";
  tags: string[];
  lastSeen?: string;
}

export interface ServerGroup {
  id: string;
  name: string;
  servers: ServerItem[];
}

const mockGroups: ServerGroup[] = [
  {
    id: "prod",
    name: "Production",
    servers: [
      { id: "p1", name: "web-server-01", ip: "192.168.1.10", port: 22, type: "ssh", status: "connected", tags: ["Ubuntu", "Docker"], lastSeen: "2 min ago" },
      { id: "p2", name: "web-server-02", ip: "192.168.1.11", port: 22, type: "ssh", status: "connected", tags: ["Ubuntu", "Nginx"], lastSeen: "5 min ago" },
      { id: "p3", name: "db-primary", ip: "192.168.1.20", port: 22, type: "ssh", status: "connected", tags: ["PostgreSQL"], lastSeen: "1 min ago" },
      { id: "p4", name: "db-replica", ip: "192.168.1.21", port: 22, type: "ssh", status: "disconnected", tags: ["PostgreSQL"], lastSeen: "2 hrs ago" },
      { id: "p5", name: "load-balancer", ip: "192.168.1.5", port: 22, type: "ssh", status: "connected", tags: ["HAProxy"], lastSeen: "3 min ago" },
    ],
  },
  {
    id: "staging",
    name: "Staging",
    servers: [
      { id: "s1", name: "staging-web", ip: "10.0.0.50", port: 22, type: "ssh", status: "connected", tags: ["Ubuntu"], lastSeen: "15 min ago" },
      { id: "s2", name: "staging-db", ip: "10.0.0.51", port: 22, type: "ssh", status: "connecting", tags: ["MySQL"], lastSeen: "Just now" },
      { id: "s3", name: "staging-rdp", ip: "10.0.0.60", port: 3389, type: "rdp", status: "disconnected", tags: ["Windows"], lastSeen: "1 day ago" },
    ],
  },
  {
    id: "personal",
    name: "Personal VPS",
    servers: [
      { id: "v1", name: "homelab", ip: "203.0.113.45", port: 22, type: "ssh", status: "connected", tags: ["Arch", "K8s"], lastSeen: "10 min ago" },
      { id: "v2", name: "pi-hole", ip: "192.168.0.15", port: 22, type: "ssh", status: "connected", tags: ["Raspberry Pi"], lastSeen: "8 min ago" },
      { id: "v3", name: "media-server", ip: "192.168.0.20", port: 22, type: "sftp", status: "disconnected", tags: ["Jellyfin"], lastSeen: "3 days ago" },
    ],
  },
];

function StatusDot({ status }: { status: ServerItem["status"] }) {
  const colorMap = {
    connected: "bg-accent-green shadow-glow-green",
    connecting: "bg-accent-amber",
    disconnected: "bg-accent-red",
    never: "bg-text-muted",
  };
  return (
    <span className="relative flex h-2 w-2">
      <span className={cn("inline-flex h-2 w-2 rounded-full", colorMap[status])} />
      {status === "connected" && (
        <span className="absolute inline-flex h-2 w-2 rounded-full bg-accent-green opacity-75 animate-status-pulse" />
      )}
    </span>
  );
}

function ConnectionIcon({ type }: { type: ServerItem["type"] }) {
  const cls = "w-4 h-4 text-text-secondary";
  if (type === "ssh") return <Terminal className={cls} />;
  if (type === "rdp") return <Monitor className={cls} />;
  return <FolderSync className={cls} />;
}

const navItems = [
  { path: "/", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { path: "/terminal", label: "Terminal", icon: <Terminal className="w-4 h-4" /> },
  { path: "/desktop", label: "Remote Desktop", icon: <Monitor className="w-4 h-4" /> },
  { path: "/connections", label: "Connections", icon: <Link2 className="w-4 h-4" /> },
  { path: "/settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
];

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const [location] = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    prod: true,
    staging: false,
    personal: false,
  });
  const [activeServer, setActiveServer] = useState<string | null>("p1");

  const toggleGroup = (id: string) => {
    setExpandedGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <aside
      className="flex flex-col bg-bg-secondary border-r border-border-default transition-all duration-300"
      style={{
        width: collapsed ? 60 : 280,
        borderRightColor: "rgba(255,255,255,0.10)",
        flexShrink: 0,
      }}
    >
      <div className="h-12 flex items-center px-4 border-b border-border-default shrink-0" style={{ borderBottomColor: "rgba(255,255,255,0.10)" }}>
        {collapsed ? <NexTermLogo className="w-7 h-7 mx-auto" /> : <NexTermWordmark className="h-7" />}
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {mockGroups.map((group) => (
          <div key={group.id} className="mb-1">
            <button
              onClick={() => toggleGroup(group.id)}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors duration-150",
                collapsed && "justify-center px-1"
              )}
              data-testid={`sidebar-group-${group.id}`}
            >
              {!collapsed && (
                <>
                  <Server className="w-4 h-4 shrink-0" />
                  <span className="flex-1 text-left truncate">{group.name}</span>
                  <motion.span animate={{ rotate: expandedGroups[group.id] ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-3.5 h-3.5 shrink-0" />
                  </motion.span>
                </>
              )}
              {collapsed && <Server className="w-5 h-5" />}
            </button>

            <AnimatePresence>
              {expandedGroups[group.id] && !collapsed && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  {group.servers.map((server) => (
                    <button
                      key={server.id}
                      onClick={() => setActiveServer(server.id)}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-bg-hover transition-all duration-150 relative border-l-[3px]",
                        activeServer === server.id ? "bg-bg-hover border-l-accent-cyan" : "border-l-transparent"
                      )}
                      data-testid={`sidebar-server-${server.id}`}
                    >
                      <StatusDot status={server.status} />
                      <ConnectionIcon type={server.type} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-text-primary truncate">{server.name}</div>
                        <div className="text-xs text-text-muted truncate">{server.ip}:{server.port}</div>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="border-t border-border-default shrink-0" style={{ borderTopColor: "rgba(255,255,255,0.10)" }}>
        <nav className="py-2">
          {navItems.map((item) => {
            const isActive = item.path === "/" ? location === "/" : location.startsWith(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 mx-2 rounded-lg text-sm font-medium transition-all duration-150 border-l-[3px]",
                  isActive
                    ? "bg-bg-hover text-text-primary border-l-accent-cyan"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-hover border-l-transparent",
                  collapsed && "justify-center px-1 mx-1"
                )}
                title={collapsed ? item.label : undefined}
                data-testid={`sidebar-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <span className={isActive ? "text-accent-cyan" : "text-text-muted"}>{item.icon}</span>
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="px-2 pb-2 flex gap-1">
          <button
            className={cn(
              "flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors duration-150",
              collapsed && "justify-center px-1"
            )}
            data-testid="sidebar-add-server"
          >
            <Plus className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Add Server</span>}
          </button>
          <button
            onClick={onToggle}
            className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors duration-150"
            data-testid="sidebar-toggle"
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </aside>
  );
}
