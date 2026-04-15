import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/auth";
import AppHeader from "@/components/AppHeader";
import MenuDrawer from "@/components/MenuDrawer";

function EmptyCartIcon() {
  return (
    <svg width="80" height="72" viewBox="0 0 80 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="24" width="44" height="32" rx="6" fill="#90CAF9" />
      <rect x="16" y="18" width="32" height="20" rx="4" fill="#1C6AE4" />
      <circle cx="24" cy="60" r="6" fill="#90CAF9" />
      <circle cx="44" cy="60" r="6" fill="#90CAF9" />
      <circle cx="58" cy="44" r="16" fill="#E53935" />
      <line x1="50" y1="44" x2="66" y2="44" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <line x1="58" y1="36" x2="58" y2="52" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function CarritoPage() {
  const { user, loading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  if (loading) return null;
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
    <div className="min-h-screen bg-gray-50">
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

      <main className="px-4 pt-8 pb-12">
        <h1 className="text-3xl font-bold text-black mb-6">Carro de la compra</h1>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-14 flex flex-col items-center">
          <div className="mb-6">
            <EmptyCartIcon />
          </div>
          <p className="text-xl font-bold text-black mb-3 text-center">
            No hay artículos en el carrito
          </p>
          <p className="text-sm text-gray-500 text-center leading-relaxed mb-8 max-w-xs">
            Por el momento no hay asientos añadidos al carrito. Por favor, vuelva a la página del evento y añada eventos a su carrito.
          </p>
          <button
            onClick={() => setLocation("/eventos")}
            className="bg-black text-white font-bold text-base px-10 py-3.5 rounded-xl hover:bg-gray-900 transition-colors"
          >
            Volver a Eventos
          </button>
        </div>
      </main>
    </div>
  );
}
