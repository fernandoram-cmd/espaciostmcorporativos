import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/auth";
import AppHeader from "@/components/AppHeader";
import MenuDrawer from "@/components/MenuDrawer";
import { User, Mail, Phone, MapPin } from "lucide-react";

export default function PerfilPage() {
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
    <div className="min-h-screen bg-gray-50">
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

      <main className="px-4 pt-8 pb-12 max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-black mb-8">Mi perfil</h1>

        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-black mb-3">
            {initial}
          </div>
          <p className="text-xl font-bold text-black">{user.name}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
          <div className="flex items-center gap-4 px-5 py-4">
            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
              <User size={18} className="text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">Nombre completo</p>
              <p className="text-base text-black font-semibold">{user.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-5 py-4">
            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Mail size={18} className="text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">Correo electrónico</p>
              <p className="text-base text-black font-semibold">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-5 py-4">
            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Phone size={18} className="text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">Teléfono</p>
              <p className="text-base text-gray-400 italic">No registrado</p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-5 py-4">
            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
              <MapPin size={18} className="text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">Ubicación</p>
              <p className="text-base text-gray-400 italic">No registrada</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 w-full py-3.5 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-base hover:border-gray-400 transition-colors"
        >
          Cerrar sesión
        </button>
      </main>
    </div>
  );
}
