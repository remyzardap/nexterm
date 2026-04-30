import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DisconnectedState } from "@/components/desktop/DisconnectedState";
import { LoadingState } from "@/components/desktop/LoadingState";
import { DesktopCanvas } from "@/components/desktop/DesktopCanvas";
import { DesktopToolbar } from "@/components/desktop/DesktopToolbar";
import { PerformancePanel } from "@/components/desktop/PerformancePanel";

type State = "disconnected" | "connecting" | "connected";

export default function RemoteDesktop() {
  const [state, setState] = useState<State>("disconnected");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [serverName] = useState("desktop-ubuntu-01");

  const handleConnect = () => {
    setState("connecting");
    setTimeout(() => setState("connected"), 3000);
  };

  const handleDisconnect = () => setState("disconnected");
  const handleRefresh = () => {
    setState("connecting");
    setTimeout(() => setState("connected"), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-bg-primary">
      <AnimatePresence mode="wait">
        {state === "disconnected" && (
          <motion.div key="disconnected" className="flex-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <DisconnectedState onConnect={handleConnect} />
          </motion.div>
        )}

        {state === "connecting" && (
          <motion.div key="connecting" className="flex-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LoadingState onCancel={handleDisconnect} />
          </motion.div>
        )}

        {state === "connected" && (
          <motion.div
            key="connected"
            className="flex-1 relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <DesktopCanvas serverName={serverName} />
            <DesktopToolbar
              isFullscreen={isFullscreen}
              onFullscreen={() => setIsFullscreen((p) => !p)}
              onRefresh={handleRefresh}
              serverName={serverName}
              connected={true}
            />
            <PerformancePanel />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
