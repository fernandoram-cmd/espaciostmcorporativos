import { useState } from "react";
import { useLocation } from "wouter";
import { RefreshCw, Ticket, Download, MapPin, Calendar } from "lucide-react";
import { useAuth } from "@/context/auth";
import AppHeader from "@/components/AppHeader";
import MenuDrawer from "@/components/MenuDrawer";

export default function EventosPage() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

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

  const pkpassUrl = `${import.meta.env.BASE_URL}pase-evento.pkpass`;

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
        <h1 className="text-3xl font-bold text-black mb-5" data-testid="text-mis-eventos">
          Mis eventos
        </h1>

        <button
          className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors mb-8"
          data-testid="button-mis-anuncios"
        >
          <RefreshCw size={18} strokeWidth={1.5} />
          <span className="text-base">Mis anuncios</span>
        </button>

        <div
          className="rounded-2xl overflow-hidden shadow-lg border border-gray-200"
          data-testid="ticket-card"
        >
          <div className="bg-black text-white px-5 py-4">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Espacios Corporativos</p>
            <h2 className="text-xl font-bold leading-tight">Pase de acceso</h2>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dashed border-gray-300" />
            </div>
            <div className="relative flex justify-between px-3">
              <div className="w-5 h-5 rounded-full bg-gray-100 border border-gray-200 -ml-3" />
              <div className="w-5 h-5 rounded-full bg-gray-100 border border-gray-200 -mr-3" />
            </div>
          </div>

          <div className="bg-white px-5 py-5 space-y-4">
            <div className="flex items-start gap-3">
              <Calendar size={18} className="text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Titular</p>
                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Espacio</p>
                <p className="text-sm font-semibold text-gray-900">Espacios Corporativos OCESA</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Ticket size={18} className="text-gray-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Tipo</p>
                <p className="text-sm font-semibold text-gray-900">{user.role}</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dashed border-gray-300" />
            </div>
            <div className="relative flex justify-between px-3">
              <div className="w-5 h-5 rounded-full bg-gray-100 border border-gray-200 -ml-3" />
              <div className="w-5 h-5 rounded-full bg-gray-100 border border-gray-200 -mr-3" />
            </div>
          </div>

          <div className="bg-white px-5 py-4">
            <a
              href={pkpassUrl}
              download="pase-evento.pkpass"
              className="flex items-center justify-center gap-2 w-full bg-black text-white py-3 rounded-xl font-semibold text-sm hover:bg-gray-900 transition-colors"
              data-testid="button-download-pass"
            >
              <Download size={16} />
              Agregar a billetera
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
