import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/auth";
import AppHeader from "@/components/AppHeader";
import MenuDrawer from "@/components/MenuDrawer";
import { Search, ChevronDown } from "lucide-react";

export default function ActividadPage() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("Todas las fechas");
  const [sortOpen, setSortOpen] = useState(false);

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

      <main className="px-4 pt-8 pb-12">
        <h1 className="text-3xl font-bold text-black mb-6">Actividad de la cuenta</h1>

        <div className="relative mb-4">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Palabras clave de búsqueda"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-11 pr-4 py-3.5 text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-500"
          />
        </div>

        <p className="text-sm text-gray-600 mb-2">Seleccione las fechas</p>
        <div className="relative mb-5">
          <select
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            className="w-full appearance-none border border-gray-300 rounded-lg px-4 py-3.5 text-base text-gray-800 focus:outline-none focus:border-gray-500 bg-white"
          >
            <option>Todas las fechas</option>
            <option>Últimos 30 días</option>
            <option>Últimos 6 meses</option>
            <option>Este año</option>
          </select>
          <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>

        <div className="flex justify-end items-center gap-2 mb-5">
          <span className="text-sm text-gray-700">Ordenar por : Fecha/Hora</span>
          <button onClick={() => setSortOpen(!sortOpen)}>
            <ChevronDown size={16} className="text-gray-600" />
          </button>
        </div>

        <div className="bg-gray-100 rounded-xl flex flex-col items-center justify-center py-20 px-6">
          <div className="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center mb-4">
            <Search size={28} className="text-gray-400" />
          </div>
          <p className="text-lg font-bold text-black mb-2 text-center">No se encontraron resultados.</p>
          <p className="text-sm text-gray-500 text-center leading-relaxed">
            No se encontraron resultados con los filtros aplicados. Intente con una búsqueda o un rango de fechas diferente.
          </p>
        </div>
      </main>
    </div>
  );
}
