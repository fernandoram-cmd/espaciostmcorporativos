import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/auth";
import { LogOut, Users, TicketCheck, Search } from "lucide-react";

export default function AdminPage() {
  const { user, logout, getAllUsers, getTicketPermissions, setTicketPermission } = useAuth();
  const [, setLocation] = useLocation();
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      setLocation("/");
      return;
    }
    setPermissions(getTicketPermissions());
  }, [user]);

  const users = getAllUsers().filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = useCallback(
    (email: string, current: boolean) => {
      const next = !current;
      setTicketPermission(email, next);
      setPermissions((prev) => ({ ...prev, [email.toLowerCase()]: next }));
      setToast(next ? `Acceso concedido a ${email}` : `Acceso revocado a ${email}`);
      setTimeout(() => setToast(""), 2500);
    },
    [setTicketPermission]
  );

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  if (!user || user.role !== "admin") return null;

  const approvedCount = Object.values(permissions).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="bg-black border-b border-gray-800 px-5 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <span
            className="font-black text-lg uppercase text-white"
            style={{ fontFamily: "'Arial Black', Impact, sans-serif", letterSpacing: "0.14em" }}
          >
            OCESA
          </span>
          <span className="text-gray-500 text-sm font-medium">Admin</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
        >
          <LogOut size={16} />
          Salir
        </button>
      </header>

      <main className="px-4 pt-8 pb-16 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-1">Panel de Administración</h1>
        <p className="text-gray-400 text-sm mb-8">
          Gestiona el acceso a boletos por usuario
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center gap-2 mb-2">
              <Users size={18} className="text-blue-400" />
              <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">Usuarios</span>
            </div>
            <p className="text-3xl font-black text-white">{getAllUsers().length}</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center gap-2 mb-2">
              <TicketCheck size={18} className="text-green-400" />
              <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">Con acceso</span>
            </div>
            <p className="text-3xl font-black text-white">{approvedCount}</p>
          </div>
        </div>

        <div className="relative mb-5">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar usuario..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {users.length === 0 ? (
          <div className="bg-gray-900 rounded-xl border border-gray-800 px-6 py-14 text-center">
            <Users size={36} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">
              {search ? "No se encontraron usuarios." : "Aún no hay usuarios registrados."}
            </p>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-800 grid grid-cols-[1fr_auto] gap-4">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Usuario</span>
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Boletos</span>
            </div>
            {users.map((u, i) => {
              const allowed = !!permissions[u.email.toLowerCase()];
              return (
                <div
                  key={u.email}
                  className={`px-5 py-4 grid grid-cols-[1fr_auto] gap-4 items-center ${
                    i < users.length - 1 ? "border-b border-gray-800" : ""
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{u.name}</p>
                    <p className="text-gray-400 text-xs truncate">{u.email}</p>
                  </div>
                  <button
                    onClick={() => handleToggle(u.email, allowed)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                      allowed ? "bg-blue-500" : "bg-gray-700"
                    }`}
                    role="switch"
                    aria-checked={allowed}
                  >
                    <span
                      className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200 ${
                        allowed ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm font-medium px-5 py-3 rounded-full shadow-xl border border-gray-700 animate-fade-in whitespace-nowrap z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
