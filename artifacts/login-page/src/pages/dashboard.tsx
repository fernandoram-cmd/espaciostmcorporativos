import { useEffect } from "react";
import { useLocation } from "wouter";
import { ShoppingCart, User, Menu } from "lucide-react";
import { useAuth } from "@/context/auth";
import stadiumConcert from "@/assets/stadium-concert.png";
import domeArena from "@/assets/dome-arena.png";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  if (!user) return null;

  const firstName = user.name.split(" ")[0];

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white flex items-center justify-between px-4 py-3 sticky top-0 z-50 border-b border-gray-100">
        <button
          data-testid="button-menu"
          className="text-black hover:text-gray-600 transition-colors"
          aria-label="Menú"
        >
          <Menu size={26} strokeWidth={2} />
        </button>

        <div className="absolute left-1/2 -translate-x-1/2">
          <span
            className="font-black text-xl uppercase select-none"
            style={{ fontFamily: "'Arial Black', 'Impact', sans-serif", letterSpacing: "0.14em" }}
          >
            OCESA
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            data-testid="button-account"
            className="text-black hover:text-gray-600 transition-colors"
            title={`Cerrar sesión (${firstName})`}
            aria-label="Cuenta"
          >
            <User size={24} strokeWidth={1.5} />
          </button>
          <button
            data-testid="button-cart"
            className="text-black hover:text-gray-600 transition-colors"
            aria-label="Carrito"
          >
            <ShoppingCart size={24} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      <section className="relative w-full overflow-hidden">
        <img
          src={stadiumConcert}
          alt="Concert stadium"
          className="w-full object-cover"
          style={{ height: "420px" }}
          data-testid="img-stadium-concert"
        />
        <div className="absolute inset-0 flex flex-col justify-center px-4" style={{ gap: "2px" }}>
          <div>
            <span
              className="text-white text-xl font-normal leading-tight"
              style={{
                backgroundColor: "rgba(0,0,0,0.85)",
                boxDecorationBreak: "clone",
                WebkitBoxDecorationBreak: "clone",
                padding: "3px 5px",
                lineHeight: "1.7",
              }}
              data-testid="text-welcome-line1"
            >
              Hi, {firstName}! Welcome to the <strong>Account Manager</strong>
            </span>
          </div>
          <div>
            <span
              className="text-white text-xl font-normal leading-tight"
              style={{
                backgroundColor: "rgba(0,0,0,0.85)",
                boxDecorationBreak: "clone",
                WebkitBoxDecorationBreak: "clone",
                padding: "3px 5px",
                lineHeight: "1.7",
              }}
              data-testid="text-welcome-line2"
            >
              of <strong>Espacios Corporativos.</strong>
            </span>
          </div>
          <div style={{ marginTop: "4px" }}>
            <span
              className="text-gray-300 text-sm font-normal"
              style={{
                backgroundColor: "rgba(0,0,0,0.75)",
                boxDecorationBreak: "clone",
                WebkitBoxDecorationBreak: "clone",
                padding: "2px 5px",
                lineHeight: "1.7",
              }}
              data-testid="text-subtitle"
            >
              Log in to manage your accesses.
            </span>
          </div>
        </div>
      </section>

      <section className="relative w-full">
        <img
          src={domeArena}
          alt="Dome arena"
          className="w-full object-cover"
          style={{ height: "320px" }}
          data-testid="img-dome-arena"
        />
      </section>
    </div>
  );
}
