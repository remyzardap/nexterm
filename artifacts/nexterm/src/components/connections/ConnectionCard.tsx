import { motion } from "framer-motion";
import { Terminal, Monitor, FolderSync, ExternalLink, Edit, Trash2, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Connection {
  id: string;
  name: string;
  host: string;
  port: number;
  type: "ssh" | "rdp" | "sftp";
  username: string;
  authMethod: "password" | "key" | "agent";
  status: "connected" | "disconnected" | "connecting";
  group: string;
  tags: string[];
  lastConnected?: string;
  favorite: boolean;
  description?: string;
  os?: string;
}

const typeMap = {
  ssh: { icon: Terminal, label: "SSH", color: "#00D9FF" },
  rdp: { icon: Monitor, label: "RDP", color: "#A259FF" },
  sftp: { icon: FolderSync, label: "SFTP", color: "#00FF88" },
};

interface ConnectionCardProps {
  connection: Connection;
  index?: number;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onConnect?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
}

export function ConnectionCard({ connection, index = 0, onEdit, onDelete, onConnect, onToggleFavorite }: ConnectionCardProps) {
  const { icon: TypeIcon, label, color } = typeMap[connection.type];
  const statusColor = { connected: "#00FF88", disconnected: "#5A6270", connecting: "#FFB800" }[connection.status];
  const authLabels = { password: "Password", key: "SSH Key", agent: "SSH Agent" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="bg-bg-secondary rounded-xl border border-border-default hover:border-border-accent transition-all duration-300 overflow-hidden group"
      style={{ borderColor: "rgba(255,255,255,0.08)" }}
      data-testid={`connection-card-${connection.id}`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}18` }}>
              <TypeIcon className="w-5 h-5" style={{ color }} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-text-primary truncate">{connection.name}</span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ background: `${color}18`, color }}>{label}</span>
              </div>
              <div className="text-xs text-text-muted font-mono mt-0.5 truncate">{connection.username}@{connection.host}:{connection.port}</div>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onToggleFavorite?.(connection.id)}
              className={cn("p-1.5 rounded-lg transition-colors duration-150", connection.favorite ? "text-accent-amber" : "text-text-muted hover:text-accent-amber hover:bg-bg-hover")}
              data-testid={`connection-fav-${connection.id}`}
            >
              <Star className={cn("w-4 h-4", connection.favorite && "fill-accent-amber")} />
            </button>
            <button onClick={() => onEdit?.(connection.id)} className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors duration-150 opacity-0 group-hover:opacity-100" data-testid={`connection-edit-${connection.id}`}>
              <Edit className="w-4 h-4" />
            </button>
            <button onClick={() => onDelete?.(connection.id)} className="p-1.5 rounded-lg text-text-muted hover:text-accent-red hover:bg-bg-hover transition-colors duration-150 opacity-0 group-hover:opacity-100" data-testid={`connection-delete-${connection.id}`}>
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {connection.description && <p className="text-xs text-text-secondary mt-3">{connection.description}</p>}

        <div className="flex flex-wrap items-center gap-2 mt-3">
          <div className="flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="inline-flex h-2 w-2 rounded-full" style={{ background: statusColor }} />
              {connection.status === "connected" && <span className="absolute inline-flex h-2 w-2 rounded-full opacity-75 animate-status-pulse" style={{ background: statusColor }} />}
            </span>
            <span className="text-[10px] text-text-muted capitalize">{connection.status}</span>
          </div>
          <span className="text-[10px] text-text-muted px-2 py-0.5 rounded-full bg-bg-tertiary">{authLabels[connection.authMethod]}</span>
          {connection.os && <span className="text-[10px] text-text-muted px-2 py-0.5 rounded-full bg-bg-tertiary">{connection.os}</span>}
          {connection.tags.map((tag) => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: `${color}12`, color }}>{tag}</span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-border-default" style={{ borderTopColor: "rgba(255,255,255,0.06)" }}>
        <div className="text-[10px] text-text-muted">{connection.lastConnected ? `Last: ${connection.lastConnected}` : "Never connected"}</div>
        <button
          onClick={() => onConnect?.(connection.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 active:scale-95"
          style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}
          data-testid={`connection-connect-${connection.id}`}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Connect
        </button>
      </div>
    </motion.div>
  );
}
