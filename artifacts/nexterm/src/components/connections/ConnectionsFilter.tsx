import { useState } from "react";
import { Search, Filter, Plus, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

type FilterType = "all" | "ssh" | "rdp" | "sftp" | "favorites";
type SortBy = "name" | "status" | "lastConnected" | "type";

interface ConnectionsFilterProps {
  filter: FilterType;
  onFilterChange: (f: FilterType) => void;
  sortBy: SortBy;
  onSortChange: (s: SortBy) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  totalCount: number;
  filteredCount: number;
  onAdd: () => void;
}

export function ConnectionsFilter({
  filter, onFilterChange, sortBy, onSortChange,
  searchQuery, onSearchChange, totalCount, filteredCount, onAdd,
}: ConnectionsFilterProps) {
  const [searchFocused, setSearchFocused] = useState(false);

  const types: { key: FilterType; label: string }[] = [
    { key: "all", label: "All" },
    { key: "favorites", label: "★ Favorites" },
    { key: "ssh", label: "SSH" },
    { key: "rdp", label: "RDP" },
    { key: "sftp", label: "SFTP" },
  ];

  const sorts: { key: SortBy; label: string }[] = [
    { key: "name", label: "Name" },
    { key: "status", label: "Status" },
    { key: "lastConnected", label: "Last Connected" },
    { key: "type", label: "Type" },
  ];

  return (
    <div className="flex flex-col gap-3 mb-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold font-display text-text-primary">Connections</h2>
          <p className="text-xs text-text-muted mt-0.5">
            {filteredCount === totalCount ? `${totalCount} connections` : `${filteredCount} of ${totalCount} connections`}
          </p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 active:scale-[0.97]"
          style={{ background: "#00D9FF", color: "#0B0D10" }}
          data-testid="connections-add-btn"
        >
          <Plus className="w-4 h-4" />
          New Connection
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div
          className={cn(
            "flex items-center gap-2 bg-bg-secondary border border-border-default rounded-full px-3 py-2 transition-all duration-200",
            searchFocused ? "border-border-accent" : ""
          )}
          style={{ width: 280 }}
        >
          <Search className="w-3.5 h-3.5 text-text-muted shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search connections..."
            className="bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none flex-1"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            data-testid="connections-search"
          />
        </div>

        <div className="flex items-center gap-1 bg-bg-secondary border border-border-default rounded-full p-1">
          {types.map((t) => (
            <button
              key={t.key}
              onClick={() => onFilterChange(t.key)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-all duration-150",
                filter === t.key ? "bg-accent-cyan/15 text-accent-cyan" : "text-text-secondary hover:text-text-primary"
              )}
              data-testid={`connections-filter-${t.key}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          <SlidersHorizontal className="w-3.5 h-3.5 text-text-muted" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortBy)}
            className="bg-bg-secondary border border-border-default text-text-secondary text-xs rounded-lg px-2 py-1.5 outline-none cursor-pointer"
            data-testid="connections-sort"
          >
            {sorts.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}
