import { useEffect, useRef, useCallback } from "react";
import { Terminal as XTerm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import "@xterm/xterm/css/xterm.css";
import type { TerminalSession } from "./mockData";
import { mockPrompt, mockCommands } from "./mockData";

interface XtermTerminalProps {
  session: TerminalSession;
  active: boolean;
}

const customTheme = {
  foreground: "#E8ECF1",
  background: "#0B0D10",
  cursor: "#00D9FF",
  cursorAccent: "#0B0D10",
  selectionBackground: "rgba(0, 217, 255, 0.25)",
  black: "#1E1E1E",
  red: "#FF6B6B",
  green: "#4ECCA3",
  yellow: "#FFD93D",
  blue: "#6C5CE7",
  magenta: "#FF6B9D",
  cyan: "#00D9FF",
  white: "#E8E8E8",
  brightBlack: "#2A2A2A",
  brightRed: "#FF8585",
  brightGreen: "#6EE7B7",
  brightYellow: "#FFE066",
  brightBlue: "#8578EA",
  brightMagenta: "#FF85B0",
  brightCyan: "#33E0FF",
  brightWhite: "#FFFFFF",
};

function buildWsUrl(cols: number, rows: number): string {
  const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
  const host = window.location.host;
  return `${proto}//${host}/api/ssh?cols=${cols}&rows=${rows}`;
}

function runMockSession(term: XTerm, server: string, name: string) {
  const prompt = mockPrompt(server);
  const commands = [
    { cmd: "ls -la", delay: 400 },
    { cmd: "whoami", delay: 300 },
    { cmd: "uptime", delay: 300 },
    { cmd: "df -h", delay: 400 },
    { cmd: "free -h", delay: 300 },
    { cmd: "docker ps", delay: 500 },
  ];
  let cmdIndex = 0;
  const runNext = () => {
    if (cmdIndex >= commands.length) {
      setTimeout(() => { term.writeln(""); term.write(prompt); }, 500);
      return;
    }
    const item = commands[cmdIndex++];
    term.writeln("");
    term.write(prompt);
    let charIndex = 0;
    const typeInterval = setInterval(() => {
      if (charIndex < item.cmd.length) {
        term.write(item.cmd[charIndex]);
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          term.writeln("");
          const output = mockCommands[item.cmd] || `${item.cmd}: command executed successfully`;
          output.split("\n").forEach((line) => term.writeln(line));
          setTimeout(runNext, 200);
        }, 150);
      }
    }, 30);
  };
  term.writeln("");
  term.writeln("\x1b[36m  NexTerm — Demo Mode (no live server configured)\x1b[0m");
  term.writeln(`\x1b[38;5;8m  Showing mock session for ${name} (${server})\x1b[0m`);
  term.writeln("");
  setTimeout(runNext, 600);
}

export function XtermTerminal({ session, active }: XtermTerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const initRef = useRef(false);

  const connectSsh = useCallback((term: XTerm, fitAddon: FitAddon) => {
    const { cols, rows } = term;
    const url = buildWsUrl(cols, rows);

    term.writeln("");
    term.writeln("\x1b[36m  NexTerm — Connecting to SSH server…\x1b[0m");

    let ws: WebSocket;
    try {
      ws = new WebSocket(url);
    } catch {
      term.writeln("\x1b[33m  WebSocket unavailable — falling back to demo mode\x1b[0m");
      runMockSession(term, session.server, session.name);
      return;
    }
    wsRef.current = ws;
    ws.binaryType = "arraybuffer";

    const connectTimeout = setTimeout(() => {
      if (ws.readyState !== WebSocket.OPEN) {
        ws.close();
        term.writeln("\r\n\x1b[33m  Connection timed out — falling back to demo mode\x1b[0m");
        runMockSession(term, session.server, session.name);
      }
    }, 8000);

    ws.onopen = () => {
      clearTimeout(connectTimeout);
    };

    ws.onmessage = (event) => {
      if (event.data instanceof ArrayBuffer) {
        term.write(new Uint8Array(event.data));
      } else {
        term.write(event.data as string);
      }
    };

    ws.onclose = (e) => {
      clearTimeout(connectTimeout);
      if (e.code !== 1000) {
        term.writeln(`\r\n\x1b[33m  Connection closed (${e.code})\x1b[0m`);
      }
    };

    ws.onerror = () => {
      clearTimeout(connectTimeout);
      term.writeln("\r\n\x1b[33m  Could not reach SSH server — falling back to demo mode\x1b[0m");
      runMockSession(term, session.server, session.name);
    };

    // Forward keyboard input to the server
    term.onData((data) => {
      if (ws.readyState === WebSocket.OPEN) ws.send(data);
    });

    // Forward resize events
    term.onResize(({ cols, rows }) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "resize", cols, rows }));
      }
    });

    fitAddon.fit();
  }, [session.server, session.name]);

  useEffect(() => {
    if (!containerRef.current || initRef.current) return;
    initRef.current = true;

    const term = new XTerm({
      fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",
      fontSize: 13,
      lineHeight: 1.4,
      cursorStyle: "block",
      cursorBlink: true,
      theme: customTheme,
      scrollback: 10000,
      allowProposedApi: true,
      convertEol: true,
    });

    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();
    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);
    term.open(containerRef.current);

    const viewport = containerRef.current.querySelector(".xterm-viewport") as HTMLElement;
    if (viewport) {
      viewport.style.scrollbarWidth = "thin";
      viewport.style.scrollbarColor = "#222838 #0B0D10";
    }

    fitAddon.fit();
    termRef.current = term;
    fitAddonRef.current = fitAddon;

    // First session connects to real SSH; other sessions (demo) show mock
    if (session.id === "session-1") {
      connectSsh(term, fitAddon);
    } else {
      runMockSession(term, session.server, session.name);
    }

    const handleResize = () => { try { fitAddon.fit(); } catch { /* ignore */ } };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      wsRef.current?.close();
      term.dispose();
    };
  }, [session.id, connectSsh]);

  useEffect(() => {
    if (active && fitAddonRef.current) {
      setTimeout(() => {
        try {
          fitAddonRef.current?.fit();
          if (wsRef.current?.readyState === WebSocket.OPEN && termRef.current) {
            const { cols, rows } = termRef.current;
            wsRef.current.send(JSON.stringify({ type: "resize", cols, rows }));
          }
        } catch { /* ignore */ }
      }, 50);
    }
  }, [active]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ background: "#0B0D10", padding: "12px" }}
      data-testid="xterm-container"
    />
  );
}
