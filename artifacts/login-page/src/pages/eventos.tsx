import { useState, useRef, useCallback, useEffect } from "react";
import { useLocation } from "wouter";
import { RefreshCw, ArrowLeft, TicketX } from "lucide-react";
import { useAuth } from "@/context/auth";
import AppHeader from "@/components/AppHeader";
import MenuDrawer from "@/components/MenuDrawer";
import DigitalTicket from "@/components/DigitalTicket";
import TicketPreview, { type TicketData } from "@/components/TicketPreview";

const WALLET_MENU_KEY = "ec_wallet_menu_added";

type View = "preview" | "barcode";

const TICKETS: TicketData[] = [
  { index: 0, seccion: "Box Oro", fila: "6", asiento: "4", pkpassFile: "pase-evento.pkpass" },
  { index: 1, seccion: "Box Oro", fila: "6", asiento: "5", pkpassFile: "pase-evento-2.pkpass" },
];

function DotsIndicator({ count, active }: { count: number; active: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mt-4 mb-2">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i === active
              ? "w-5 h-2 bg-[#1C6AE4]"
              : "w-2 h-2 bg-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

interface SwipeCarouselProps {
  count: number;
  active: number;
  onChange: (index: number) => void;
  children: React.ReactNode[];
}

function SwipeCarousel({ count, active, onChange, children }: SwipeCarouselProps) {
  const touchStartX = useRef<number | null>(null);
  const mouseStartX = useRef<number | null>(null);
  const isDragging = useRef(false);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 40) return;
    if (dx < 0 && active < count - 1) onChange(active + 1);
    if (dx > 0 && active > 0) onChange(active - 1);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    mouseStartX.current = e.clientX;
    isDragging.current = false;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (mouseStartX.current !== null && Math.abs(e.clientX - mouseStartX.current) > 5) {
      isDragging.current = true;
    }
  };

  const onMouseUp = (e: React.MouseEvent) => {
    if (mouseStartX.current === null) return;
    const dx = e.clientX - mouseStartX.current;
    mouseStartX.current = null;
    if (Math.abs(dx) < 40) return;
    if (dx < 0 && active < count - 1) onChange(active + 1);
    if (dx > 0 && active > 0) onChange(active - 1);
  };

  return (
    <div
      className="overflow-hidden select-none"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      <div
        className="flex transition-transform duration-300 ease-out"
        style={{ transform: `translateX(${-active * 100}%)` }}
      >
        {children.map((child, i) => (
          <div key={i} className="w-full flex-shrink-0">
            {child}
          </div>
        ))}
      </div>
      <DotsIndicator count={count} active={active} />
    </div>
  );
}

export default function EventosPage() {
  const { user, loading, logout, hasTicketAccess } = useAuth();
  const [, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [view, setView] = useState<View>("preview");
  const [activeTicket, setActiveTicket] = useState(0);
  const [ticketAccess, setTicketAccess] = useState<boolean | null>(null);
  const [walletAdded, setWalletAdded] = useState(() => {
    try { return localStorage.getItem(WALLET_MENU_KEY) === "1"; } catch { return false; }
  });

  const handleViewBarcode = useCallback((index: number) => {
    setActiveTicket(index);
    setView("barcode");
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    setLocation("/");
  }, [logout, setLocation]);

  const handleBack = useCallback(() => {
    setView("preview");
  }, []);

  const handleTransfer = useCallback(() => {
  }, []);

  const handleAddToWallet = useCallback(() => {
    TICKETS.forEach((ticket) => {
      const link = document.createElement("a");
      link.href = `${import.meta.env.BASE_URL}${ticket.pkpassFile}`;
      link.download = ticket.pkpassFile;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
    try { localStorage.setItem(WALLET_MENU_KEY, "1"); } catch {}
    setWalletAdded(true);
  }, []);

  useEffect(() => {
    if (!loading && user) {
      hasTicketAccess(user.email).then(setTicketAccess);
    }
  }, [loading, user]);

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/");
    }
  }, [loading, user, setLocation]);

  if (loading || !user) return null;

  const firstName = user.name.split(" ")[0];
  const initial = firstName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-white">
      <AppHeader
        userInitial={initial}
        userName={firstName}
        onMenuOpen={() => setMenuOpen(true)}
        onLogout={handleLogout}
        ticketMenu={{
          onTransfer: handleTransfer,
          onAddToWallet: handleAddToWallet,
          walletAdded,
        }}
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
              onClick={handleBack}
              className="flex items-center gap-1.5 text-[#1C6AE4] font-semibold mb-5"
            >
              <ArrowLeft size={18} />
              <span>Volver</span>
            </button>

            <SwipeCarousel
              count={TICKETS.length}
              active={activeTicket}
              onChange={setActiveTicket}
            >
              {TICKETS.map((ticket) => (
                <DigitalTicket
                  key={ticket.index}
                  userName={user.name}
                  ticket={ticket}
                />
              ))}
            </SwipeCarousel>
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

            {ticketAccess === null ? null : ticketAccess ? (
              <SwipeCarousel
                count={TICKETS.length}
                active={activeTicket}
                onChange={setActiveTicket}
              >
                {TICKETS.map((ticket) => (
                  <TicketPreview
                    key={ticket.index}
                    ticket={ticket}
                    onViewBarcode={() => handleViewBarcode(ticket.index)}
                  />
                ))}
              </SwipeCarousel>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-5">
                  <TicketX size={30} className="text-gray-400" />
                </div>
                <p className="text-base text-gray-700 leading-relaxed">
                  No tienes entradas para ningún evento próximo.
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
