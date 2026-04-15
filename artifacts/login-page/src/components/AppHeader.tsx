import { useState, useRef, useEffect } from "react";
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const navigate = (path: string) => {
    setDropdownOpen(false);
    setLocation(path);
  };

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
        className="absolute left-1/2 -translate-x-1/2 hover:opacity-80 transition-opacity"
        onClick={() => setLocation("/dashboard")}
        data-testid="button-logo-home"
        aria-label="Inicio"
      >
        <img
          src={`${import.meta.env.BASE_URL}ocesa-logo.jpeg`}
          alt="OCESA"
          className="h-8 w-auto object-contain select-none"
        />
      </button>

      <div className="flex items-center gap-4">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            data-testid="button-account"
            className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm hover:bg-blue-600 transition-colors"
            aria-label="Cuenta"
          >
            {userInitial}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
              <button
                onClick={() => navigate("/perfil")}
                className="w-full text-left px-6 py-5 text-lg text-black font-medium hover:bg-gray-50 transition-colors border-b border-gray-100"
                data-testid="dropdown-mi-perfil"
              >
                Mi perfil
              </button>
              <button
                onClick={() => navigate("/actividad")}
                className="w-full text-left px-6 py-5 text-lg text-black font-medium hover:bg-gray-50 transition-colors border-b border-gray-100"
                data-testid="dropdown-actividad"
              >
                Actividad de la cuenta
              </button>
              <button
                onClick={() => { setDropdownOpen(false); onLogout(); }}
                className="w-full text-left px-6 py-5 text-lg text-black font-medium hover:bg-gray-50 transition-colors"
                data-testid="dropdown-desconectar"
              >
                Desconectar
              </button>
            </div>
          )}
        </div>

        <button
          data-testid="button-cart"
          onClick={() => setLocation("/carrito")}
          className="text-white hover:text-gray-300 transition-colors"
          aria-label="Carrito"
        >
          <ShoppingCart size={24} strokeWidth={1.5} />
        </button>
      </div>
    </header>
  );
}
