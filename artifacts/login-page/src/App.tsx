import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/auth";
import LoadingScreen from "@/components/LoadingScreen";
import LoginPage from "@/pages/login";
import DashboardPage from "@/pages/dashboard";
import EventosPage from "@/pages/eventos";
import GnpPremiumPage from "@/pages/gnp-premium";
import BoxesPage from "@/pages/boxes";
import PerfilPage from "@/pages/perfil";
import ActividadPage from "@/pages/actividad";
import CarritoPage from "@/pages/carrito";
import TerminosPage from "@/pages/terminos";
import AdminPage from "@/pages/admin";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={LoginPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/eventos" component={EventosPage} />
      <Route path="/gnp-premium" component={GnpPremiumPage} />
      <Route path="/boxes" component={BoxesPage} />
      <Route path="/perfil" component={PerfilPage} />
      <Route path="/actividad" component={ActividadPage} />
      <Route path="/carrito" component={CarritoPage} />
      <Route path="/terminos" component={TerminosPage} />
      <Route path="/admin" component={AdminPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { loading } = useAuth();
  return (
    <>
      {loading && <LoadingScreen />}
      <Router />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <AppContent />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
