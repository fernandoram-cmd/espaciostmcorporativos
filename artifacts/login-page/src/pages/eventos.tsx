import { useState } from "react";
import { useLocation } from "wouter";
import { RefreshCw, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/auth";
import AppHeader from "@/components/AppHeader";
import MenuDrawer from "@/components/MenuDrawer";
import DigitalTicket from "@/components/DigitalTicket";
import TicketPreview from "@/components/TicketPreview";

type View = "preview" | "barcode";

export default function EventosPage() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [view, setView] = useState<View>("preview");

  if (!user) {
    setLocation("/");
    return null;
  }

  const firstName = user.name.split(" ")[0];
  const initial = firstName.charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-white">
      <AppHeader
        userInitial={initial}
        userName={firstName}
        onMenuOpen={() => setMenuOpen(true)}
        onLogout={handleLogout}
      />

      <MenuDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        userInitial={initial}
        userName={firstName}
        onLogout={handleLogout}
      />

      <main className="px-4 pt-6 pb-10">
        {view === "barcode" ? (
          <>
            <button
              onClick={() => setView("preview")}
              className="flex items-center gap-1.5 text-[#1C6AE4] font-semibold mb-5"
            >
              <ArrowLeft size={18} />
              <span>Volver</span>
            </button>
            <DigitalTicket userName={user.name} />
          </>
        ) : (
          <>
            <h1
              className="text-3xl font-bold text-black mb-5"
              data-testid="text-mis-eventos"
            >
              Mis eventos
            </h1>

            <button
              className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors mb-8"
              data-testid="button-mis-anuncios"
            >
              <RefreshCw size={18} strokeWidth={1.5} />
              <span className="text-base">Mis anuncios</span>
            </button>

            <TicketPreview onViewBarcode={() => setView("barcode")} />
          </>
        )}
      </main>
    </div>
  );
}
