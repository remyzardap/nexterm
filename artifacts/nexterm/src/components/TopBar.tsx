import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Search, Bell, Command } from "lucide-react";
import { cn } from "@/lib/utils";

export function TopBar() {
  const [location] = useLocation();
  const [searchFocused, setSearchFocused] = useState(false);

  const tabs = [
    { label: "Terminal", path: "/terminal" },
    { label: "Remote Desktop", path: "/desktop" },
    { label: "Files", path: "/connections" },
  ];

  const pageTitle =
    location === "/" ? "Dashboard" :
    location === "/terminal" ? "Terminal" :
    location === "/desktop" ? "Remote Desktop" :
    location === "/connections" ? "Connections" :
    location === "/settings" ? "Settings" : "";

  return (
    <header className="h-12 bg-bg-secondary border-b border-border-default flex items-center px-4 shrink-0 z-50" style={{ borderBottomColor: "rgba(255,255,255,0.10)" }}>
      <div className="flex items-center gap-4">
        <div className="text-sm font-semibold text-text-primary" data-testid="topbar-page-title">{pageTitle}</div>
        <nav className="hidden md:flex items-center gap-1 bg-bg-tertiary rounded-full p-1">
          {tabs.map((tab) => {
            const isActive = location === tab.path;
            return (
              <Link
                key={tab.path}
                href={tab.path}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium transition-all duration-150",
                  isActive ? "bg-accent-cyan/15 text-accent-cyan" : "text-text-secondary hover:text-text-primary"
                )}
                data-testid={`topbar-tab-${tab.label.toLowerCase().replace(" ", "-")}`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex-1 flex justify-center">
        <div
          className={cn(
            "flex items-center gap-2 bg-bg-tertiary border border-border-default rounded-full px-3 py-1.5 transition-all duration-200",
            searchFocused ? "border-border-accent shadow-[0_0_0_3px_rgba(0,217,255,0.1)]" : ""
          )}
          style={{ width: searchFocused ? 560 : 320 }}
        >
          <Search className="w-3.5 h-3.5 text-text-muted shrink-0" />
          <input
            type="text"
            placeholder="Search servers, IPs, or tags..."
            className="bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none flex-1"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            data-testid="topbar-search"
          />
          <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] text-text-muted bg-bg-primary rounded px-1.5 py-0.5 font-mono border border-border-default">
            <Command className="w-3 h-3" /><span>K</span>
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: "rgba(0,255,136,0.1)", color: "#00FF88" }}>
          <span className="relative flex h-1.5 w-1.5">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-accent-green" />
            <span className="absolute inline-flex h-1.5 w-1.5 rounded-full bg-accent-green opacity-75 animate-status-pulse" />
          </span>
          <span>Online</span>
        </div>
        <button className="relative p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors duration-150" data-testid="topbar-notifications">
          <Bell className="w-4 h-4" />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-accent-red rounded-full border-2 border-bg-secondary" />
        </button>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold" style={{ background: "rgba(162,89,255,0.2)", color: "#A259FF", border: "1px solid rgba(162,89,255,0.3)" }}>
          AL
        </div>
      </div>
    </header>
  );
}
