import { useState } from "react";
import { useLocation } from "wouter";
import { ShoppingCart, User, Menu, RefreshCw, Ticket } from "lucide-react";
import { useAuth } from "@/context/auth";
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

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-black flex items-center justify-between px-4 py-3 sticky top-0 z-40">
        <button
          data-testid="button-menu"
          className="text-white hover:text-gray-300 transition-colors"
          aria-label="Menú"
          onClick={() => setMenuOpen(true)}
        >
          <span className="flex flex-col gap-[5px]">
            <span className="block w-6 h-[2px] bg-white" />
            <span className="block w-6 h-[2px] bg-white" />
            <span className="block w-6 h-[2px] bg-white" />
          </span>
        </button>

        <div className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          <span className="text-white font-serif italic text-2xl font-light leading-none">ú</span>
          <span
            className="font-black text-xl uppercase select-none text-white"
            style={{ fontFamily: "'Arial Black', 'Impact', sans-serif", letterSpacing: "0.14em" }}
          >
            OCESA
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            data-testid="button-account"
            className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm hover:bg-blue-600 transition-colors"
            title={`Cerrar sesión (${firstName})`}
          >
            {initial}
          </button>
          <button
            data-testid="button-cart"
            className="text-white hover:text-gray-300 transition-colors"
            aria-label="Carrito"
          >
            <ShoppingCart size={24} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      <MenuDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        userInitial={initial}
        userName={firstName}
        onLogout={handleLogout}
      />

      <main className="px-4 pt-6">
        <h1 className="text-3xl font-bold text-black mb-5" data-testid="text-mis-eventos">
          Mis eventos
        </h1>

        <button
          className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors mb-10"
          data-testid="button-mis-anuncios"
        >
          <RefreshCw size={18} strokeWidth={1.5} />
          <span className="text-base">Mis anuncios</span>
        </button>

        <div className="flex flex-col items-center justify-center mt-10 gap-4">
          <div className="w-28 h-28 rounded-full border-2 border-gray-300 flex items-center justify-center">
            <Ticket size={44} strokeWidth={1.2} className="text-gray-500 rotate-[-20deg]" />
          </div>
          <p className="text-gray-700 text-center text-base mt-2" data-testid="text-empty-eventos">
            No tienes entradas para ningún evento próximo.
          </p>
        </div>
      </main>
    </div>
  );
}
