import { useState } from "react";
import { ShoppingCart, User, ChevronDown, Globe, X } from "lucide-react";

interface MenuDrawerProps {
  open: boolean;
  onClose: () => void;
  userInitial: string;
  userName: string;
  onLogout: () => void;
}

export default function MenuDrawer({ open, onClose, userInitial, userName, onLogout }: MenuDrawerProps) {
  const [espaciosOpen, setEspaciosOpen] = useState(true);
  const [idiomaOpen, setIdiomaOpen] = useState(false);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black text-white flex flex-col overflow-y-auto"
      data-testid="menu-drawer"
    >
      <header className="bg-black flex items-center justify-between px-4 py-3 flex-shrink-0">
        <button
          onClick={onClose}
          data-testid="button-close-menu"
          className="text-white hover:text-gray-300 transition-colors"
          aria-label="Cerrar menú"
        >
          <X size={26} strokeWidth={2} />
        </button>

        <div className="absolute left-1/2 -translate-x-1/2">
          <span
            className="font-black text-xl uppercase select-none text-white"
            style={{ fontFamily: "'Arial Black', 'Impact', sans-serif", letterSpacing: "0.14em" }}
          >
            OCESA
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onLogout}
            data-testid="menu-button-account"
            className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm hover:bg-blue-600 transition-colors"
            title={`Cerrar sesión (${userName})`}
          >
            {userInitial}
          </button>
          <button
            data-testid="menu-button-cart"
            className="text-white hover:text-gray-300 transition-colors"
            aria-label="Carrito"
          >
            <ShoppingCart size={24} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      <nav className="flex-1 px-6 pt-6 pb-4">
        <ul className="space-y-0">
          <li>
            <button
              className="w-full text-left py-5 text-xl text-white border-b border-gray-800 hover:text-gray-300 transition-colors"
              data-testid="menu-item-eventos"
              onClick={onClose}
            >
              Mis eventos
            </button>
          </li>

          <li>
            <button
              className="w-full text-left py-5 text-xl text-white border-b border-gray-800 flex items-center justify-between hover:text-gray-300 transition-colors"
              data-testid="menu-item-espacios"
              onClick={() => setEspaciosOpen(!espaciosOpen)}
            >
              <span>Nuestros Espacios</span>
              <ChevronDown
                size={20}
                className={`transition-transform duration-200 ${espaciosOpen ? "rotate-180" : ""}`}
              />
            </button>

            {espaciosOpen && (
              <ul className="bg-black">
                <li>
                  <button
                    className="w-full text-left py-5 pl-2 text-xl text-white border-b border-gray-800 hover:text-gray-300 transition-colors"
                    data-testid="menu-item-estadio-gnp"
                    onClick={onClose}
                  >
                    Estadio GNP Seguros
                  </button>
                </li>
                <li>
                  <button
                    className="w-full text-left py-5 pl-2 text-xl text-white border-b border-gray-800 hover:text-gray-300 transition-colors"
                    data-testid="menu-item-palacio"
                    onClick={onClose}
                  >
                    Palacio de los Deportes
                  </button>
                </li>
              </ul>
            )}
          </li>

          <li>
            <button
              className="w-full text-left py-5 text-xl text-white border-b border-gray-800 hover:text-gray-300 transition-colors"
              data-testid="menu-item-contacto"
              onClick={onClose}
            >
              Contacto
            </button>
          </li>

          <li>
            <button
              className="w-full text-left py-5 text-xl text-white border-b border-gray-800 hover:text-gray-300 transition-colors"
              data-testid="menu-item-comprar"
              onClick={onClose}
            >
              Comprar
            </button>
          </li>
        </ul>
      </nav>

      <div className="flex-shrink-0">
        <div className="bg-neutral-900 px-6">
          <button
            className="w-full flex items-center justify-between py-4 text-white hover:text-gray-300 transition-colors"
            data-testid="menu-item-idioma"
            onClick={() => setIdiomaOpen(!idiomaOpen)}
          >
            <div className="flex items-center gap-3">
              <Globe size={20} strokeWidth={1.5} />
              <span className="text-base">Inglés</span>
            </div>
            <ChevronDown
              size={18}
              className={`transition-transform duration-200 ${idiomaOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        <div className="px-6 py-6 space-y-4">
          <button
            className="block text-sm text-gray-400 hover:text-white transition-colors text-left"
            data-testid="menu-link-privacidad"
          >
            Política de privacidad de Ticketmaster
          </button>
          <button
            className="block text-sm text-gray-400 hover:text-white transition-colors text-left"
            data-testid="menu-link-condiciones"
          >
            Condiciones de uso
          </button>
        </div>

        <div className="px-6 pb-8">
          <p className="text-xs text-gray-600 text-center">
            © 1999-2026 Ticketmaster. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
