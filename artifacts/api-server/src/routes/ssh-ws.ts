import { WebSocketServer, type WebSocket } from "ws";
import { Client as SshClient } from "ssh2";
import type { IncomingMessage } from "http";
import type { Server } from "http";
import { logger } from "../lib/logger";

export function attachSshWebSocketServer(httpServer: Server) {
  const wss = new WebSocketServer({ noServer: true });

  httpServer.on("upgrade", (req: IncomingMessage, socket, head) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    if (url.pathname !== "/api/ssh") {
      socket.destroy();
      return;
    }
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  });

  wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    const host = url.searchParams.get("host") ?? process.env["SSH_HOST"] ?? "";
    const port = Number(url.searchParams.get("port") ?? process.env["SSH_PORT"] ?? 22);
    const username = url.searchParams.get("username") ?? process.env["SSH_USERNAME"] ?? "";
    const password = url.searchParams.get("password") ?? process.env["SSH_PASSWORD"] ?? "";
    const cols = Number(url.searchParams.get("cols") ?? 80);
    const rows = Number(url.searchParams.get("rows") ?? 24);
    if (!host || !username) {
      ws.send("\r\n\x1b[31mError: Missing SSH_HOST or SSH_USERNAME\x1b[0m\r\n");
      ws.close();
      return;
    }

    const ssh = new SshClient();
    let sshEnded = false;
    const safeEndSsh = () => { if (!sshEnded) { sshEnded = true; ssh.end(); } };

    ssh.on("ready", () => {
      ws.send("\r\n\x1b[32mConnected to " + host + "\x1b[0m\r\n");
      ssh.shell({ term: "xterm-256color", cols, rows }, (err, stream) => {
        if (err) {
          ws.send(`\r\n\x1b[31mShell error: ${err.message}\x1b[0m\r\n`);
          ws.close();
          safeEndSsh();
          return;
        }

        stream.on("data", (data: Buffer) => {
          if (ws.readyState === ws.OPEN) ws.send(data);
        });

        stream.stderr.on("data", (data: Buffer) => {
          if (ws.readyState === ws.OPEN) ws.send(data);
        });

        stream.on("close", () => {
          if (ws.readyState === ws.OPEN) {
            ws.send("\r\n\x1b[33mSession closed.\x1b[0m\r\n");
          }
          ws.close();
          safeEndSsh();
        });

        ws.on("message", (msg) => {
          const raw = typeof msg === "string" ? msg : (msg as Buffer);
          try {
            const parsed = JSON.parse(raw.toString());
            if (parsed.type === "resize") {
              stream.setWindow(parsed.rows, parsed.cols, 0, 0);
              return;
            }
          } catch { /* not JSON — treat as terminal input */ }
          stream.write(raw);
        });

        ws.on("close", () => {
          stream.close();
          safeEndSsh();
        });

        ws.on("error", (err) => {
          logger.error({ err, host }, "WebSocket error");
          stream.close();
          safeEndSsh();
        });
      });
    });

    ssh.on("error", (err) => {
      logger.error({ err, host }, "SSH connection error");
      if (ws.readyState === ws.OPEN) {
        ws.send(`\r\n\x1b[31mSSH Error: ${err.message}\x1b[0m\r\n`);
        ws.close();
      }
      safeEndSsh();
    });

    ssh.connect({
      host,
      port,
      username,
      password: password || undefined,
      // Support keyboard-interactive auth (common on many servers)
      tryKeyboard: true,
      readyTimeout: 15000,
      keepaliveInterval: 30000,
    });

    // Handle keyboard-interactive challenge (e.g. PAM-based auth)
    ssh.on("keyboard-interactive", (_name, _instructions, _lang, prompts, finish) => {
      // Respond to all prompts with the configured password
      const responses = prompts.map(() => password);
      finish(responses);
    });
  });

  logger.info("SSH WebSocket server attached at /api/ssh");
}
