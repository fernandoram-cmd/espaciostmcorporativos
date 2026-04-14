import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/auth";
import AppHeader from "@/components/AppHeader";
import MenuDrawer from "@/components/MenuDrawer";

const BASE = import.meta.env.BASE_URL;

export default function GnpPremiumPage() {
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
          style={{ backgroundImage: `url(${BASE}gnp-hero.jpeg)` }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.72) 60%, rgba(0,0,0,0.88) 100%)",
          }}
        />

        <div className="relative z-10 px-5 pb-10 pt-16">
          <h1 className="text-4xl font-black text-white uppercase mb-5 leading-tight">
            GNP PREMIUM PASS
          </h1>
          <p className="text-white text-base leading-relaxed mb-5">
            Una zona de hospitalidad exclusiva desde la cual podrás vivir los
            conciertos más importantes del país y disfrutar de los mejores
            beneficios.
          </p>
          <p className="text-white text-base leading-relaxed mb-6">
            Cada suite cuenta con dos amplios espacios cuidadosamente diseñados
            para que vivas una experiencia de primer nivel.{" "}
            <span className="font-semibold">
              En el interior un lounge amueblado y climatizado; en el exterior,
              una zona privada de butacas
            </span>{" "}
            para disfrutar de tus conciertos favoritos con invitados especiales,
            amigos y familia.
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
            Nuestras Suites
          </h2>
          <div className="flex-1 h-px bg-black" />
        </div>

        <div className="space-y-4">
          <img
            src={`${BASE}suites-interior.png`}
            alt="Suite interior lounge"
            className="w-full rounded-lg object-cover"
            style={{ maxHeight: 260 }}
          />
          <img
            src={`${BASE}gnp-hero.jpeg`}
            alt="GNP Premium Pass entrada"
            className="w-full rounded-lg object-cover"
            style={{ maxHeight: 260 }}
          />
        </div>
      </div>
    </div>
  );
}
