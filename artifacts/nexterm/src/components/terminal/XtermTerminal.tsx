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

export function XtermTerminal({ session, active }: XtermTerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const initRef = useRef(false);

  const runCommandSequence = useCallback(
    (term: XTerm) => {
      const prompt = mockPrompt(session.server);
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
      term.writeln("\x1b[36m  Welcome to NexTerm SSH Terminal\x1b[0m");
      term.writeln(`\x1b[38;5;8m  Connected to ${session.server} (${session.name})\x1b[0m`);
      term.writeln("");
      setTimeout(runNext, 600);
    },
    [session.server, session.name]
  );

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
    runCommandSequence(term);

    const handleResize = () => { try { fitAddon.fit(); } catch { /* ignore */ } };
    window.addEventListener("resize", handleResize);
    return () => { window.removeEventListener("resize", handleResize); term.dispose(); };
  }, [session.id, runCommandSequence]);

  useEffect(() => {
    if (active && fitAddonRef.current) {
      setTimeout(() => { try { fitAddonRef.current?.fit(); } catch { /* ignore */ } }, 50);
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
