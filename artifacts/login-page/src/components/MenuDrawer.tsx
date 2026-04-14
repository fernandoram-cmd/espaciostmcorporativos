import { useState } from "react";
import { useLocation } from "wouter";
import { ShoppingCart, ChevronDown, Globe, X } from "lucide-react";

interface MenuDrawerProps {
  open: boolean;
  onClose: () => void;
  userInitial: string;
  userName: string;
  onLogout: () => void;
}

const reglamentoPdfUrl = `${import.meta.env.BASE_URL}reglamento-gnp-premium-pass.pdf`;

export default function MenuDrawer({ open, onClose, userInitial, userName, onLogout }: MenuDrawerProps) {
  const [espaciosOpen, setEspaciosOpen] = useState(true);
  const [idiomaOpen, setIdiomaOpen] = useState(true);
  const [, setLocation] = useLocation();

  const navigate = (path: string) => {
    onClose();
    setLocation(path);
  };

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

      <nav className="flex-1 px-6 pt-2 pb-4">
        <ul className="space-y-0">
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
                    className="block w-full text-left py-4 pl-4 text-lg text-white border-b border-gray-800 hover:text-gray-300 transition-colors"
                    data-testid="menu-item-gnp-premium"
                    onClick={() => navigate("/gnp-premium")}
                  >
                    GNP Premium Pass
                  </button>
                </li>
                <li>
                  <a
                    href={reglamentoPdfUrl}
                    download="Reglamento-GNP-Premium-Pass.pdf"
                    className="block w-full text-left py-4 pl-4 text-lg text-white border-b border-gray-800 hover:text-gray-300 transition-colors"
                    data-testid="menu-item-reglamento"
                    onClick={onClose}
                  >
                    Reglamento GNP Premium Pass
                  </a>
                </li>
                <li>
                  <button
                    className="block w-full text-left py-4 pl-4 text-lg text-white border-b border-gray-800 hover:text-gray-300 transition-colors"
                    data-testid="menu-item-boxes"
                    onClick={() => navigate("/boxes")}
                  >
                    Boxes
                  </button>
                </li>
              </ul>
            )}
          </li>

          <li>
            <a
              href="https://www.estadiognpseguros.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-left py-5 text-xl text-white border-b border-gray-800 hover:text-gray-300 transition-colors"
              data-testid="menu-item-estadio-gnp"
              onClick={onClose}
            >
              Estadio GNP Seguros
            </a>
          </li>

          <li>
            <a
              href="https://www.palaciodelosdeportes.mx/"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-left py-5 text-xl text-white border-b border-gray-800 hover:text-gray-300 transition-colors"
              data-testid="menu-item-palacio"
              onClick={onClose}
            >
              Palacio de los Deportes
            </a>
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
              <span className="text-base">Español</span>
            </div>
            <ChevronDown
              size={18}
              className={`transition-transform duration-200 ${idiomaOpen ? "rotate-180" : ""}`}
            />
          </button>

          {idiomaOpen && (
            <div className="pb-3">
              <button className="block w-full text-left py-3 pl-9 text-base text-white border-t border-gray-800 hover:text-gray-300 transition-colors">
                English
              </button>
            </div>
          )}
        </div>

        <div className="px-6 py-6 space-y-4">
          <a
            href="https://privacy.ticketmaster.com.mx/es/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm text-gray-400 hover:text-white transition-colors text-left"
            data-testid="menu-link-privacidad"
          >
            Ticketmaster aviso de privacidad
          </a>
          <a
            href="https://am.ticketmaster.com/espacioscorporativos/en/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm text-gray-400 hover:text-white transition-colors text-left"
            data-testid="menu-link-condiciones"
          >
            Términos de uso
          </a>
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
