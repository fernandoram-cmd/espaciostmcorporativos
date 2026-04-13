import { useLocation } from "wouter";
import { ShoppingCart } from "lucide-react";

interface AppHeaderProps {
  userInitial: string;
  userName: string;
  onMenuOpen: () => void;
  onLogout: () => void;
}

export default function AppHeader({ userInitial, userName, onMenuOpen, onLogout }: AppHeaderProps) {
  const [, setLocation] = useLocation();

  return (
    <header className="bg-black flex items-center justify-between px-4 py-3 sticky top-0 z-40">
      <button
        data-testid="button-menu"
        className="text-white hover:text-gray-300 transition-colors flex flex-col gap-[5px]"
        aria-label="Menú"
        onClick={onMenuOpen}
      >
        <span className="block w-6 h-[2px] bg-white" />
        <span className="block w-6 h-[2px] bg-white" />
        <span className="block w-6 h-[2px] bg-white" />
      </button>

      <button
        className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 hover:opacity-80 transition-opacity"
        onClick={() => setLocation("/dashboard")}
        data-testid="button-logo-home"
        aria-label="Inicio"
      >
        <span
          className="text-white font-serif italic text-2xl font-light leading-none select-none"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          ú
        </span>
        <span
          className="font-black text-xl uppercase select-none text-white"
          style={{ fontFamily: "'Arial Black', 'Impact', sans-serif", letterSpacing: "0.14em" }}
        >
          OCESA
        </span>
      </button>

      <div className="flex items-center gap-4">
        <button
          onClick={onLogout}
          data-testid="button-account"
          className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm hover:bg-blue-600 transition-colors"
          title={`Cerrar sesión (${userName})`}
          aria-label="Cuenta"
        >
          {userInitial}
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
  );
}
