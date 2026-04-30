import { useState } from "react";
import { motion } from "framer-motion";
import {
  Terminal, Monitor, Shield, Bell, Palette, User, Database, Key, ChevronRight,
} from "lucide-react";
import { SettingsSection, SettingsRow, Toggle, Select } from "@/components/settings/SettingsSection";
import { cn } from "@/lib/utils";

type SettingsTab = "appearance" | "terminal" | "security" | "notifications" | "profile" | "storage";

const tabs: { key: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { key: "appearance", label: "Appearance", icon: <Palette className="w-4 h-4" /> },
  { key: "terminal", label: "Terminal", icon: <Terminal className="w-4 h-4" /> },
  { key: "security", label: "Security", icon: <Shield className="w-4 h-4" /> },
  { key: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
  { key: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
  { key: "storage", label: "Storage", icon: <Database className="w-4 h-4" /> },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("appearance");

  const [settings, setSettings] = useState({
    compactMode: false,
    animations: true,
    theme: "dark",
    fontSize: "13",
    fontFamily: "jetbrains",
    cursorStyle: "block",
    cursorBlink: true,
    scrollbackLines: "10000",
    bellEnabled: false,
    saveHistory: true,
    twoFactor: false,
    autoLock: true,
    lockTimeout: "15",
    sessionNotifications: true,
    disconnectNotifications: true,
    alertNotifications: true,
    notificationSound: false,
    username: "alex",
    email: "alex@example.com",
    displayName: "Alex L.",
    storageAutoClean: true,
    logRetention: "30",
  });

  const set = <K extends keyof typeof settings>(key: K, val: typeof settings[K]) =>
    setSettings((p) => ({ ...p, [key]: val }));

  return (
    <div className="flex h-full">
      <div className="w-52 bg-bg-secondary border-r border-border-default flex flex-col py-4 shrink-0" style={{ borderRightColor: "rgba(255,255,255,0.10)" }}>
        <div className="px-4 mb-3">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Settings</span>
        </div>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-150 border-l-[3px] mx-2 rounded-r-lg text-left",
              activeTab === tab.key
                ? "bg-bg-hover text-text-primary border-l-accent-cyan"
                : "text-text-secondary hover:text-text-primary hover:bg-bg-hover border-l-transparent"
            )}
            data-testid={`settings-tab-${tab.key}`}
          >
            <span className={activeTab === tab.key ? "text-accent-cyan" : "text-text-muted"}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="space-y-5 max-w-2xl">

          {activeTab === "appearance" && (
            <>
              <SettingsSection title="Theme & Display">
                <SettingsRow label="Theme" description="Application color scheme">
                  <Select value={settings.theme} onChange={(v) => set("theme", v)} options={[{ value: "dark", label: "Dark (default)" }, { value: "darker", label: "Darker" }]} testId="settings-theme" />
                </SettingsRow>
                <SettingsRow label="Compact Mode" description="Reduce padding and spacing across the UI">
                  <Toggle checked={settings.compactMode} onChange={(v) => set("compactMode", v)} testId="settings-compact" />
                </SettingsRow>
                <SettingsRow label="Animations" description="Enable smooth transitions and animations">
                  <Toggle checked={settings.animations} onChange={(v) => set("animations", v)} testId="settings-animations" />
                </SettingsRow>
              </SettingsSection>
            </>
          )}

          {activeTab === "terminal" && (
            <>
              <SettingsSection title="Font & Display">
                <SettingsRow label="Font Family">
                  <Select value={settings.fontFamily} onChange={(v) => set("fontFamily", v)} options={[{ value: "jetbrains", label: "JetBrains Mono" }, { value: "firacode", label: "Fira Code" }, { value: "cascadia", label: "Cascadia Code" }, { value: "monaco", label: "Monaco" }]} testId="settings-font" />
                </SettingsRow>
                <SettingsRow label="Font Size">
                  <Select value={settings.fontSize} onChange={(v) => set("fontSize", v)} options={[{ value: "11", label: "11px" }, { value: "12", label: "12px" }, { value: "13", label: "13px (default)" }, { value: "14", label: "14px" }, { value: "16", label: "16px" }]} testId="settings-fontsize" />
                </SettingsRow>
                <SettingsRow label="Cursor Style">
                  <Select value={settings.cursorStyle} onChange={(v) => set("cursorStyle", v)} options={[{ value: "block", label: "Block" }, { value: "underline", label: "Underline" }, { value: "bar", label: "Bar" }]} testId="settings-cursor" />
                </SettingsRow>
                <SettingsRow label="Cursor Blink">
                  <Toggle checked={settings.cursorBlink} onChange={(v) => set("cursorBlink", v)} testId="settings-cursorblink" />
                </SettingsRow>
              </SettingsSection>
              <SettingsSection title="Behavior">
                <SettingsRow label="Scrollback Lines" description="Number of lines kept in scrollback buffer">
                  <Select value={settings.scrollbackLines} onChange={(v) => set("scrollbackLines", v)} options={[{ value: "1000", label: "1,000" }, { value: "5000", label: "5,000" }, { value: "10000", label: "10,000 (default)" }, { value: "50000", label: "50,000" }]} testId="settings-scrollback" />
                </SettingsRow>
                <SettingsRow label="Terminal Bell">
                  <Toggle checked={settings.bellEnabled} onChange={(v) => set("bellEnabled", v)} testId="settings-bell" />
                </SettingsRow>
                <SettingsRow label="Save Session History">
                  <Toggle checked={settings.saveHistory} onChange={(v) => set("saveHistory", v)} testId="settings-history" />
                </SettingsRow>
              </SettingsSection>
            </>
          )}

          {activeTab === "security" && (
            <>
              <SettingsSection title="Authentication">
                <SettingsRow label="Two-Factor Authentication" description="Add an extra layer of security">
                  <Toggle checked={settings.twoFactor} onChange={(v) => set("twoFactor", v)} testId="settings-2fa" />
                </SettingsRow>
                <SettingsRow label="Auto-Lock Screen" description="Lock after inactivity">
                  <Toggle checked={settings.autoLock} onChange={(v) => set("autoLock", v)} testId="settings-autolock" />
                </SettingsRow>
                <SettingsRow label="Lock Timeout" description="Minutes before auto-lock">
                  <Select value={settings.lockTimeout} onChange={(v) => set("lockTimeout", v)} options={[{ value: "5", label: "5 minutes" }, { value: "15", label: "15 minutes" }, { value: "30", label: "30 minutes" }, { value: "60", label: "1 hour" }]} testId="settings-locktimeout" />
                </SettingsRow>
              </SettingsSection>
              <SettingsSection title="SSH Keys">
                <SettingsRow label="Manage SSH Keys" description="Add, remove, or rotate SSH key pairs">
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-text-secondary bg-bg-tertiary border border-border-default hover:bg-bg-hover transition-colors duration-150" data-testid="settings-ssh-keys">
                    <Key className="w-3.5 h-3.5" />
                    Manage Keys
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </SettingsRow>
              </SettingsSection>
            </>
          )}

          {activeTab === "notifications" && (
            <SettingsSection title="Notification Preferences">
              <SettingsRow label="Session Events" description="Notified when sessions start or end">
                <Toggle checked={settings.sessionNotifications} onChange={(v) => set("sessionNotifications", v)} testId="settings-notif-session" />
              </SettingsRow>
              <SettingsRow label="Disconnection Alerts" description="Notified when a server disconnects unexpectedly">
                <Toggle checked={settings.disconnectNotifications} onChange={(v) => set("disconnectNotifications", v)} testId="settings-notif-disconnect" />
              </SettingsRow>
              <SettingsRow label="System Alerts" description="CPU, memory, and disk threshold alerts">
                <Toggle checked={settings.alertNotifications} onChange={(v) => set("alertNotifications", v)} testId="settings-notif-alerts" />
              </SettingsRow>
              <SettingsRow label="Notification Sound" description="Play a sound for notifications">
                <Toggle checked={settings.notificationSound} onChange={(v) => set("notificationSound", v)} testId="settings-notif-sound" />
              </SettingsRow>
            </SettingsSection>
          )}

          {activeTab === "profile" && (
            <SettingsSection title="Profile Information">
              <SettingsRow label="Display Name">
                <input
                  type="text"
                  value={settings.displayName}
                  onChange={(e) => set("displayName", e.target.value)}
                  className="bg-bg-tertiary border border-border-default text-text-primary text-sm rounded-lg px-3 py-1.5 outline-none focus:border-border-accent w-48"
                  data-testid="settings-displayname"
                />
              </SettingsRow>
              <SettingsRow label="Username">
                <input
                  type="text"
                  value={settings.username}
                  onChange={(e) => set("username", e.target.value)}
                  className="bg-bg-tertiary border border-border-default text-text-primary text-sm rounded-lg px-3 py-1.5 outline-none focus:border-border-accent w-48"
                  data-testid="settings-username"
                />
              </SettingsRow>
              <SettingsRow label="Email">
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => set("email", e.target.value)}
                  className="bg-bg-tertiary border border-border-default text-text-primary text-sm rounded-lg px-3 py-1.5 outline-none focus:border-border-accent w-48"
                  data-testid="settings-email"
                />
              </SettingsRow>
            </SettingsSection>
          )}

          {activeTab === "storage" && (
            <SettingsSection title="Data & Storage">
              <SettingsRow label="Auto-Clean Old Data" description="Automatically delete old session logs">
                <Toggle checked={settings.storageAutoClean} onChange={(v) => set("storageAutoClean", v)} testId="settings-autoclean" />
              </SettingsRow>
              <SettingsRow label="Log Retention" description="How long to keep session logs">
                <Select value={settings.logRetention} onChange={(v) => set("logRetention", v)} options={[{ value: "7", label: "7 days" }, { value: "14", label: "14 days" }, { value: "30", label: "30 days" }, { value: "90", label: "90 days" }]} testId="settings-log-retention" />
              </SettingsRow>
              <SettingsRow label="Clear All Data" description="Delete all saved connections and history">
                <button className="px-4 py-1.5 rounded-lg text-sm font-medium text-accent-red bg-bg-tertiary border border-accent-red/30 hover:bg-accent-red/10 transition-colors duration-150" data-testid="settings-clear-data">
                  Clear Data
                </button>
              </SettingsRow>
            </SettingsSection>
          )}
        </motion.div>
      </div>
    </div>
  );
}
