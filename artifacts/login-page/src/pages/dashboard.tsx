import { useEffect } from "react";
import { useLocation } from "wouter";
import { ShoppingCart } from "lucide-react";
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
  const initial = firstName.charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-black flex items-center justify-between px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="text-white font-serif italic text-2xl font-light">ú</span>
          <div className="flex items-center">
            <span className="text-white font-black text-lg tracking-widest uppercase">OCESA</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            data-testid="button-avatar"
            className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm hover:bg-blue-600 transition-colors"
            title="Cerrar sesión"
          >
            {initial}
          </button>
          <button
            data-testid="button-cart"
            className="text-white hover:text-gray-300 transition-colors"
          >
            <ShoppingCart size={22} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      <section className="relative w-full" style={{ minHeight: "320px" }}>
        <img
          src={stadiumConcert}
          alt="Concert stadium"
          className="w-full object-cover"
          style={{ height: "340px" }}
          data-testid="img-stadium-concert"
        />
        <div
          className="absolute inset-0 flex flex-col justify-end pb-8 px-5"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)"
          }}
        >
          <h1 className="text-3xl font-bold text-white mb-1" data-testid="text-greeting">
            Hi, {firstName}!
          </h1>
          <p className="text-white text-base font-normal" data-testid="text-welcome">
            Welcome to Espacios Corporativos
          </p>
          <p className="text-white text-base font-normal" data-testid="text-role">
            {user.role}
          </p>
        </div>
      </section>

      <section className="relative w-full">
        <img
          src={domeArena}
          alt="Dome arena"
          className="w-full object-cover"
          style={{ height: "300px" }}
          data-testid="img-dome-arena"
        />
      </section>
    </div>
  );
}
