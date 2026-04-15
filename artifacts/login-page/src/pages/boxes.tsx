import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/auth";
import AppHeader from "@/components/AppHeader";
import MenuDrawer from "@/components/MenuDrawer";

const BASE = import.meta.env.BASE_URL;

export default function BoxesPage() {
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

      <div
        className="relative w-full flex flex-col justify-end"
        style={{ minHeight: "70vh" }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${BASE}boxes-hero.png)` }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.68) 55%, rgba(0,0,0,0.88) 100%)",
          }}
        />

        <div className="relative z-10 px-5 pb-10 pt-16">
          <h1 className="text-4xl font-black text-white uppercase mb-5 leading-tight">
            BOXES
          </h1>
          <p className="text-white text-base leading-relaxed mb-6">
            Como parte de la transformación del inmueble que más fans recibe{" "}
            <strong>en el mundo</strong>, presentamos una nueva hospitalidad en
            México, que asegura tu lugar fijo durante todo el año en el Estadio
            GNP Seguros… para que tú, tus amigos, familia, clientes o invitados
            especiales, no se pierdan <strong>un solo concierto</strong>.
          </p>
          <p className="text-white text-base mb-3">Nuestro próximo evento:</p>
          <p className="text-white text-2xl font-semibold italic text-center">
            Este evento está sucediendo.
          </p>
        </div>
      </div>

      <div className="bg-white px-5 py-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-black" />
          <h2 className="text-base font-semibold text-black whitespace-nowrap">
            Boxes Diamante
          </h2>
          <div className="flex-1 h-px bg-black" />
        </div>

        <div className="space-y-4">
          <img
            src={`${BASE}suites-interior.png`}
            alt="Box interior"
            className="w-full rounded-lg object-cover"
            style={{ maxHeight: 280 }}
          />
        </div>
      </div>
    </div>
  );
}
