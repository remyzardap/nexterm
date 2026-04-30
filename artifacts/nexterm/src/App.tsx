import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Layout } from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Terminal from "@/pages/Terminal";
import RemoteDesktop from "@/pages/RemoteDesktop";
import Connections from "@/pages/Connections";
import Settings from "@/pages/Settings";

const queryClient = new QueryClient();

function AppRoutes() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/terminal" component={Terminal} />
        <Route path="/desktop" component={RemoteDesktop} />
        <Route path="/connections" component={Connections} />
        <Route path="/settings" component={Settings} />
        <Route component={Dashboard} />
      </Switch>
    </Layout>
  );
}

function App() {
  const base = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={base}>
        <AppRoutes />
        <Toaster />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
