import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/auth";
import AppHeader from "@/components/AppHeader";
import MenuDrawer from "@/components/MenuDrawer";

function NoEventsIcon() {
  return (
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="46" cy="46" r="38" fill="#EBEBEB" />

      <g transform="rotate(-20 46 46)">
        <rect x="22" y="30" width="36" height="26" rx="5" fill="white" stroke="#D0D0D0" strokeWidth="1.5" />
        <line x1="28" y1="39" x2="50" y2="39" stroke="#C0C0C0" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="28" y1="45" x2="44" y2="45" stroke="#C0C0C0" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="28" y1="51" x2="38" y2="51" stroke="#C0C0C0" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      <g transform="rotate(10 46 46)">
        <rect x="30" y="24" width="36" height="26" rx="5" fill="#1C6AE4" />
        <line x1="36" y1="33" x2="58" y2="33" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="36" y1="39" x2="52" y2="39" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="36" y1="45" x2="46" y2="45" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      <g transform="translate(56, 56)">
        <polygon points="18,0 36,32 0,32" fill="#E53935" />
        <text x="18" y="28" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">!</text>
      </g>
    </svg>
  );
}

export default function CarritoPage() {
  const { user, loading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) setLocation("/");
  }, [loading, user, setLocation]);

  if (loading || !user) return null;

  const firstName = user.name.split(" ")[0];
  const initial = firstName.charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
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
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mx-auto max-w-md px-8 py-14 flex flex-col items-center text-center">
          <div className="mb-6">
            <NoEventsIcon />
          </div>

          <h2 className="text-2xl font-black text-black mb-4 leading-tight">
            No hay eventos<br />disponibles
          </h2>

          <p className="text-base text-gray-600 leading-relaxed mb-8 max-w-xs">
            Hola {firstName}, en este momento no hay eventos disponibles para comprar.
          </p>

          <button
            onClick={() => setLocation("/dashboard")}
            className="w-full bg-black text-white font-bold text-base py-4 rounded-xl hover:bg-gray-900 transition-colors"
            data-testid="button-volver-principal"
          >
            Volver a la página principal
          </button>
        </div>
      </main>
    </div>
  );
}
