import { useState, useMemo } from "react";
import { ConnectionCard, type Connection } from "@/components/connections/ConnectionCard";
import { ConnectionsFilter } from "@/components/connections/ConnectionsFilter";

const mockConnections: Connection[] = [
  { id: "c1", name: "web-server-01", host: "192.168.1.10", port: 22, type: "ssh", username: "alex", authMethod: "key", status: "connected", group: "Production", tags: ["Ubuntu", "Docker", "Nginx"], lastConnected: "2 min ago", favorite: true, description: "Primary web server running Nginx + Node.js app.", os: "Ubuntu 22.04" },
  { id: "c2", name: "web-server-02", host: "192.168.1.11", port: 22, type: "ssh", username: "alex", authMethod: "key", status: "connected", group: "Production", tags: ["Ubuntu", "Nginx"], lastConnected: "5 min ago", favorite: false, os: "Ubuntu 22.04" },
  { id: "c3", name: "db-primary", host: "192.168.1.20", port: 22, type: "ssh", username: "postgres", authMethod: "key", status: "connected", group: "Production", tags: ["PostgreSQL", "Primary"], lastConnected: "1 min ago", favorite: true, description: "Primary PostgreSQL database server.", os: "Ubuntu 22.04" },
  { id: "c4", name: "db-replica", host: "192.168.1.21", port: 22, type: "ssh", username: "postgres", authMethod: "key", status: "disconnected", group: "Production", tags: ["PostgreSQL", "Replica"], lastConnected: "2 hrs ago", favorite: false, os: "Ubuntu 22.04" },
  { id: "c5", name: "staging-web", host: "10.0.0.50", port: 22, type: "ssh", username: "deploy", authMethod: "agent", status: "connected", group: "Staging", tags: ["Ubuntu", "Staging"], lastConnected: "15 min ago", favorite: false, description: "Staging environment for web app testing.", os: "Ubuntu 20.04" },
  { id: "c6", name: "staging-rdp", host: "10.0.0.60", port: 3389, type: "rdp", username: "administrator", authMethod: "password", status: "disconnected", group: "Staging", tags: ["Windows", "RDP"], lastConnected: "1 day ago", favorite: false, os: "Windows Server 2022" },
  { id: "c7", name: "homelab", host: "203.0.113.45", port: 22, type: "ssh", username: "alex", authMethod: "key", status: "connected", group: "Personal VPS", tags: ["Arch", "K8s", "Personal"], lastConnected: "10 min ago", favorite: true, description: "Home lab server with K8s cluster.", os: "Arch Linux" },
  { id: "c8", name: "pi-hole", host: "192.168.0.15", port: 22, type: "ssh", username: "pi", authMethod: "key", status: "connected", group: "Personal VPS", tags: ["Raspberry Pi", "DNS"], lastConnected: "8 min ago", favorite: false, os: "Raspberry Pi OS" },
  { id: "c9", name: "media-server", host: "192.168.0.20", port: 22, type: "sftp", username: "alex", authMethod: "password", status: "disconnected", group: "Personal VPS", tags: ["Jellyfin", "Media"], lastConnected: "3 days ago", favorite: false, os: "Ubuntu 20.04" },
];

type FilterType = "all" | "ssh" | "rdp" | "sftp" | "favorites";
type SortBy = "name" | "status" | "lastConnected" | "type";

export default function Connections() {
  const [connections, setConnections] = useState<Connection[]>(mockConnections);
  const [filter, setFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    let result = connections;
    if (filter === "favorites") result = result.filter((c) => c.favorite);
    else if (filter !== "all") result = result.filter((c) => c.type === filter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        c.host.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q)) ||
        c.group.toLowerCase().includes(q)
      );
    }
    const statusOrder: Record<string, number> = { connected: 0, connecting: 1, disconnected: 2 };
    return [...result].sort((a, b) => {
      switch (sortBy) {
        case "name": return a.name.localeCompare(b.name);
        case "status": return (statusOrder[a.status] ?? 3) - (statusOrder[b.status] ?? 3);
        case "type": return a.type.localeCompare(b.type);
        default: return 0;
      }
    });
  }, [connections, filter, sortBy, searchQuery]);

  const handleToggleFavorite = (id: string) =>
    setConnections((prev) => prev.map((c) => c.id === id ? { ...c, favorite: !c.favorite } : c));

  const handleDelete = (id: string) =>
    setConnections((prev) => prev.filter((c) => c.id !== id));

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <ConnectionsFilter
        filter={filter}
        onFilterChange={setFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={connections.length}
        filteredCount={filtered.length}
        onAdd={() => {}}
      />

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-text-muted">
          <p className="text-sm">No connections found.</p>
          <p className="text-xs mt-1 text-text-muted opacity-60">Try a different search or filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((conn, i) => (
            <ConnectionCard
              key={conn.id}
              connection={conn}
              index={i}
              onToggleFavorite={handleToggleFavorite}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
