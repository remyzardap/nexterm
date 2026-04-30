import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Folder, FileText, ChevronRight, ChevronLeft, Upload, Download,
  RefreshCw, PanelRightClose, PanelRightOpen, HardDrive,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FileItem {
  name: string;
  type: "file" | "folder";
  size: string;
  modified: string;
  permissions: string;
}

const mockFiles: Record<string, FileItem[]> = {
  "/home": [
    { name: "alex", type: "folder", size: "-", modified: "Apr 28", permissions: "drwxr-xr-x" },
    { name: "ubuntu", type: "folder", size: "-", modified: "Apr 15", permissions: "drwxr-xr-x" },
    { name: "backup", type: "folder", size: "-", modified: "Mar 22", permissions: "drwxr-xr-x" },
  ],
  "/home/alex": [
    { name: "projects", type: "folder", size: "-", modified: "Apr 25", permissions: "drwxr-xr-x" },
    { name: "documents", type: "folder", size: "-", modified: "Apr 20", permissions: "drwxr-xr-x" },
    { name: ".ssh", type: "folder", size: "-", modified: "Apr 22", permissions: "drwx------" },
    { name: ".bashrc", type: "file", size: "3.7 KB", modified: "Apr 15", permissions: "-rw-r--r--" },
    { name: ".profile", type: "file", size: "807 B", modified: "Apr 15", permissions: "-rw-r--r--" },
    { name: "notes.txt", type: "file", size: "2.0 KB", modified: "Apr 28", permissions: "-rw-r--r--" },
    { name: "README.md", type: "file", size: "4.2 KB", modified: "Apr 23", permissions: "-rw-r--r--" },
    { name: "setup.sh", type: "file", size: "1.5 KB", modified: "Apr 18", permissions: "-rwxr-xr-x" },
  ],
  "/home/alex/projects": [
    { name: "webapp", type: "folder", size: "-", modified: "Apr 26", permissions: "drwxr-xr-x" },
    { name: "api-server", type: "folder", size: "-", modified: "Apr 24", permissions: "drwxr-xr-x" },
    { name: "infra", type: "folder", size: "-", modified: "Apr 20", permissions: "drwxr-xr-x" },
    { name: "docker-compose.yml", type: "file", size: "2.4 KB", modified: "Apr 25", permissions: "-rw-r--r--" },
    { name: "Makefile", type: "file", size: "1.1 KB", modified: "Apr 22", permissions: "-rw-r--r--" },
  ],
};

interface SftpPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  serverName?: string;
}

export function SftpPanel({ isOpen, onToggle, serverName }: SftpPanelProps) {
  const [currentPath, setCurrentPath] = useState("/home/alex");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const pathParts = currentPath.split("/").filter(Boolean);
  const files = mockFiles[currentPath] || [];

  const navigateToPath = (path: string) => { setCurrentPath(path); setSelectedItem(null); };
  const navigateUp = () => {
    const parent = currentPath.substring(0, currentPath.lastIndexOf("/")) || "/";
    navigateToPath(parent);
  };
  const handleItemDoubleClick = (item: FileItem) => {
    if (item.type === "folder") navigateToPath(`${currentPath}/${item.name}`);
  };
  const breadcrumbPath = (index: number) => "/" + pathParts.slice(0, index + 1).join("/");

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-6 h-16 bg-bg-secondary border border-border-default rounded-l-lg text-text-muted hover:text-accent-cyan hover:bg-bg-hover transition-colors duration-150"
        title="Open SFTP Panel"
        data-testid="sftp-open-btn"
      >
        <PanelRightOpen className="w-4 h-4" />
      </button>
    );
  }

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 320, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="shrink-0 bg-bg-secondary border-l border-border-default flex flex-col overflow-hidden"
      style={{ borderLeftColor: "rgba(255,255,255,0.10)" }}
    >
      <div className="h-12 flex items-center px-4 border-b border-border-default shrink-0" style={{ borderBottomColor: "rgba(255,255,255,0.10)" }}>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <HardDrive className="w-4 h-4 text-accent-cyan shrink-0" />
          <div className="flex items-center gap-1 text-xs text-text-secondary truncate">
            <span className="text-text-muted">SFTP</span>
            <ChevronRight className="w-3 h-3 text-text-muted shrink-0" />
            <span className="truncate text-text-primary">{currentPath}</span>
          </div>
        </div>
        <button onClick={onToggle} className="p-1.5 rounded-lg text-text-muted hover:text-accent-cyan hover:bg-bg-hover transition-colors duration-150 shrink-0 ml-2" data-testid="sftp-close-btn">
          <PanelRightClose className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-1 px-4 py-2 border-b border-border-default overflow-x-auto shrink-0" style={{ borderBottomColor: "rgba(255,255,255,0.10)" }}>
        <button onClick={() => navigateToPath("/")} className="text-xs text-text-muted hover:text-text-primary transition-colors shrink-0">/</button>
        {pathParts.map((part, i) => (
          <span key={i} className="flex items-center gap-1 shrink-0">
            <button onClick={() => navigateToPath(breadcrumbPath(i))} className="text-xs text-text-muted hover:text-text-primary transition-colors">{part}</button>
            {i < pathParts.length - 1 && <ChevronRight className="w-3 h-3 text-text-muted" />}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-1 px-3 py-2 border-b border-border-default shrink-0" style={{ borderBottomColor: "rgba(255,255,255,0.10)" }}>
        <button onClick={navigateUp} disabled={currentPath === "/"} className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors disabled:opacity-30 disabled:cursor-not-allowed" title="Go up">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors" title="Refresh">
          <RefreshCw className="w-4 h-4" />
        </button>
        <div className="flex-1" />
        <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-bg-tertiary text-text-primary text-xs hover:bg-bg-hover transition-colors border border-border-default" data-testid="sftp-upload">
          <Upload className="w-3.5 h-3.5" /><span>Upload</span>
        </button>
        <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-bg-tertiary text-text-primary text-xs hover:bg-bg-hover transition-colors border border-border-default" data-testid="sftp-download">
          <Download className="w-3.5 h-3.5" /><span>Download</span>
        </button>
      </div>

      <div className="flex items-center px-4 py-1.5 border-b border-border-default text-xs text-text-muted shrink-0" style={{ borderBottomColor: "rgba(255,255,255,0.10)" }}>
        <span className="flex-1">Name</span>
        <span className="w-20 text-right">Size</span>
        <span className="w-24 text-right">Modified</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-text-muted">
            <Folder className="w-8 h-8 mb-2 opacity-40" />
            <span className="text-xs">Empty directory</span>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={currentPath} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              {files.map((file, index) => (
                <motion.div
                  key={file.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.3 }}
                  onClick={() => setSelectedItem(file.name)}
                  onDoubleClick={() => handleItemDoubleClick(file)}
                  className={cn(
                    "flex items-center px-4 py-2.5 cursor-pointer transition-colors duration-150 border-l-[3px]",
                    selectedItem === file.name ? "bg-bg-hover border-l-accent-cyan" : "border-l-transparent hover:bg-bg-hover"
                  )}
                  data-testid={`sftp-item-${file.name}`}
                >
                  {file.type === "folder"
                    ? <Folder className="w-4 h-4 text-accent-cyan shrink-0 mr-2" />
                    : <FileText className="w-4 h-4 text-text-muted shrink-0 mr-2" />
                  }
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-text-primary truncate">{file.name}</div>
                    <div className="text-xs text-text-muted font-mono">{file.permissions}</div>
                  </div>
                  <span className="w-20 text-right text-xs text-text-secondary shrink-0">{file.size}</span>
                  <span className="w-24 text-right text-xs text-text-muted shrink-0">{file.modified}</span>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <div className="px-4 py-2 border-t border-border-default text-xs text-text-muted shrink-0" style={{ borderTopColor: "rgba(255,255,255,0.10)" }}>
        {files.length} items {serverName && `• ${serverName}`}
      </div>
    </motion.div>
  );
}
