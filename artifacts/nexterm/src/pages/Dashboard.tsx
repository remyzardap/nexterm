import { Server, Terminal, Activity, Clock } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { LatencyChart } from "@/components/dashboard/LatencyChart";
import { RecentSessions } from "@/components/dashboard/RecentSessions";
import { ServerGroups } from "@/components/dashboard/ServerGroups";

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6 max-w-[1800px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-display text-text-primary">
          Good morning, Alex <span className="text-accent-cyan">_</span>
        </h1>
        <p className="text-sm text-text-secondary mt-1">Here's what's happening across your infrastructure.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          index={0}
          title="Servers Online"
          value={9}
          subtitle="of 12"
          icon={<Server className="w-5 h-5" />}
          accentColor="#00FF88"
          trend={{ value: 2, label: "since yesterday" }}
        />
        <StatCard
          index={1}
          title="Active Sessions"
          value={4}
          icon={<Terminal className="w-5 h-5" />}
          accentColor="#00D9FF"
          trend={{ value: 1, label: "new today" }}
        />
        <StatCard
          index={2}
          title="Avg Latency"
          value={34}
          subtitle="ms"
          icon={<Activity className="w-5 h-5" />}
          accentColor="#A259FF"
          trend={{ value: -8, label: "vs last hour" }}
        />
        <StatCard
          index={3}
          title="Uptime (prod)"
          value="99.9"
          subtitle="%"
          icon={<Clock className="w-5 h-5" />}
          accentColor="#FFB800"
        />
      </div>

      <LatencyChart serverName="web-server-01 (Production)" />

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3">
          <ServerGroups />
        </div>
        <div className="xl:col-span-2">
          <RecentSessions />
        </div>
      </div>
    </div>
  );
}
