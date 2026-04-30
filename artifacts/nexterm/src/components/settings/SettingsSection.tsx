import { cn } from "@/lib/utils";

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function SettingsSection({ title, description, children, className }: SettingsSectionProps) {
  return (
    <div className={cn("bg-bg-secondary rounded-xl border border-border-default overflow-hidden", className)} style={{ borderColor: "rgba(255,255,255,0.08)" }}>
      <div className="px-6 py-4 border-b border-border-default" style={{ borderBottomColor: "rgba(255,255,255,0.08)" }}>
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
        {description && <p className="text-xs text-text-muted mt-1">{description}</p>}
      </div>
      <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        {children}
      </div>
    </div>
  );
}

interface SettingsRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function SettingsRow({ label, description, children, className }: SettingsRowProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4 px-6 py-4", className)}>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-text-primary">{label}</div>
        {description && <div className="text-xs text-text-muted mt-0.5">{description}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  testId?: string;
}

export function Toggle({ checked, onChange, testId }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn("relative w-10 h-6 rounded-full transition-all duration-200 focus:outline-none", checked ? "bg-accent-cyan" : "bg-bg-tertiary border border-border-default")}
      data-testid={testId}
    >
      <span
        className={cn("absolute top-1 h-4 w-4 rounded-full transition-all duration-200", checked ? "left-5 bg-bg-primary" : "left-1 bg-text-muted")}
      />
    </button>
  );
}

interface SelectProps {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  testId?: string;
}

export function Select({ value, onChange, options, testId }: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-bg-tertiary border border-border-default text-text-primary text-sm rounded-lg px-3 py-1.5 outline-none cursor-pointer focus:border-border-accent"
      data-testid={testId}
    >
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}
