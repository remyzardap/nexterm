export interface TerminalSession {
  id: string;
  name: string;
  server: string;
  connected: boolean;
  output: string;
}

let sessionCounter = 3;

export function createSession(name: string, server: string): TerminalSession {
  sessionCounter++;
  return {
    id: `session-${sessionCounter}`,
    name,
    server,
    connected: true,
    output: "",
  };
}

export const initialSessions: TerminalSession[] = [
  { id: "session-1", name: "web-server-01", server: "192.168.1.10", connected: true, output: "" },
  { id: "session-2", name: "db-primary", server: "192.168.1.20", connected: true, output: "" },
  { id: "session-3", name: "staging-web", server: "10.0.0.50", connected: true, output: "" },
];

export const mockPrompt = (server: string) =>
  `\x1b[32malex\x1b[0m@\x1b[34m${server}\x1b[0m:\x1b[36m~\x1b[0m$ `;

export const mockCommands: Record<string, string> = {
  "ls -la": `total 128\ndrwxr-xr-x 5 alex alex  4096 Apr 28 09:32 .\ndrwxr-xr-x 3 root root  4096 Apr 15 14:21 ..\n-rw------- 1 alex alex  8921 Apr 28 10:15 .bash_history\n-rw-r--r-- 1 alex alex   220 Apr 15 14:21 .bash_logout\n-rw-r--r-- 1 alex alex  3771 Apr 15 14:21 .bashrc\ndrwx------ 2 alex alex  4096 Apr 20 11:42 .cache\ndrwx------ 3 alex alex  4096 Apr 20 11:42 .config\n-rw-r--r-- 1 alex alex   807 Apr 15 14:21 .profile\ndrwxr-xr-x 2 alex alex  4096 Apr 22 16:18 .ssh\ndrwxr-xr-x 5 alex alex  4096 Apr 25 13:22 projects`,
  whoami: "alex",
  hostname: "web-server-01",
  uptime: " 09:42:15 up 14 days, 3:22, 2 users,  load average: 0.52, 0.58, 0.61",
  "df -h": `Filesystem      Size  Used Avail Use% Mounted on\nudev            3.8G     0  3.8G   0% /dev\ntmpfs           782M  1.2M  781M   1% /run\n/dev/sda1        98G   34G   60G  37% /\ntmpfs           3.9G     0  3.9G   0% /dev/shm`,
  "free -h": `              total        used        free      shared  buff/cache   available\nMem:          7.7Gi       2.1Gi       1.8Gi       128Mi       3.8Gi       5.1Gi\nSwap:         2.0Gi       0.0Ki       2.0Gi`,
  "docker ps": `NAMES               IMAGE                      STATUS              PORTS\napp-server          node:18-alpine             Up 3 days           0.0.0.0:3000->3000/tcp\nnginx-proxy         nginx:alpine               Up 14 days          0.0.0.0:80->80/tcp\npostgres-db         postgres:15                Up 14 days          0.0.0.0:5432->5432/tcp\nredis-cache         redis:7-alpine             Up 14 days          0.0.0.0:6379->6379/tcp`,
};
