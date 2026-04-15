import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { useAuth, StoredUser } from "@/context/auth";
import {
  LogOut, Users, TicketCheck, Search, Trash2, KeyRound,
  TicketX, CheckCheck, X, ChevronDown,
} from "lucide-react";

type FilterTab = "todos" | "con-acceso" | "sin-acceso";

interface PasswordModalProps {
  user: StoredUser;
  onSave: (email: string, pwd: string) => void;
  onClose: () => void;
}

function PasswordModal({ user, onSave, onClose }: PasswordModalProps) {
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");

  const handleSave = () => {
    if (pwd.length < 6) { setErr("Mínimo 6 caracteres."); return; }
    if (pwd !== confirm) { setErr("Las contraseñas no coinciden."); return; }
    onSave(user.email, pwd);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-base">Cambiar contraseña</h3>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>
        <p className="text-gray-400 text-xs mb-4 truncate">{user.email}</p>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 mb-3"
        />
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 mb-2"
        />
        {err && <p className="text-red-400 text-xs mb-3">{err}</p>}
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors mt-2"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}

interface DeleteConfirmProps {
  user: StoredUser;
  onConfirm: () => void;
  onClose: () => void;
}

function DeleteConfirm({ user, onConfirm, onClose }: DeleteConfirmProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-sm text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-full bg-red-900/40 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={22} className="text-red-400" />
        </div>
        <h3 className="text-white font-bold text-base mb-2">Eliminar usuario</h3>
        <p className="text-gray-400 text-sm mb-1">{user.name}</p>
        <p className="text-gray-500 text-xs mb-6 truncate">{user.email}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-700 text-gray-300 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const {
    user, loading, logout, getAllUsers, getTicketPermissions,
    setTicketPermission, deleteUser, changeUserPassword, approveAll, revokeAll,
  } = useAuth();
  const [, setLocation] = useLocation();
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [allUsers, setAllUsers] = useState<StoredUser[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterTab>("todos");
  const [toast, setToast] = useState("");
  const [pwdModal, setPwdModal] = useState<StoredUser | null>(null);
  const [deleteModal, setDeleteModal] = useState<StoredUser | null>(null);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setAllUsers(getAllUsers());
    setPermissions(getTicketPermissions());
  }, [getAllUsers, getTicketPermissions]);

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== "admin") { setLocation("/"); return; }
    refresh();
  }, [user, loading]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const handleToggle = (email: string, current: boolean) => {
    const next = !current;
    setTicketPermission(email, next);
    setPermissions((prev) => ({ ...prev, [email.toLowerCase()]: next }));
    showToast(next ? `✓ Acceso concedido` : `Acceso revocado`);
  };

  const handleApproveAll = () => {
    approveAll();
    refresh();
    showToast(`✓ Acceso concedido a todos los usuarios`);
  };

  const handleRevokeAll = () => {
    revokeAll();
    refresh();
    showToast(`Acceso revocado a todos los usuarios`);
  };

  const handleDelete = (u: StoredUser) => {
    deleteUser(u.email);
    setDeleteModal(null);
    setExpandedUser(null);
    refresh();
    showToast(`Usuario ${u.name} eliminado`);
  };

  const handlePasswordChange = (email: string, pwd: string) => {
    changeUserPassword(email, pwd);
    setPwdModal(null);
    showToast(`✓ Contraseña actualizada`);
  };

  const handleLogout = () => { logout(); setLocation("/"); };

  if (loading || !user || user.role !== "admin") return null;

  const approvedCount = allUsers.filter((u) => !!permissions[u.email.toLowerCase()]).length;
  const noAccessCount = allUsers.length - approvedCount;

  const filtered = allUsers.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (filter === "con-acceso") return !!permissions[u.email.toLowerCase()];
    if (filter === "sin-acceso") return !permissions[u.email.toLowerCase()];
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {pwdModal && (
        <PasswordModal
          user={pwdModal}
          onSave={handlePasswordChange}
          onClose={() => setPwdModal(null)}
        />
      )}
      {deleteModal && (
        <DeleteConfirm
          user={deleteModal}
          onConfirm={() => handleDelete(deleteModal)}
          onClose={() => setDeleteModal(null)}
        />
      )}

      <header className="bg-black border-b border-gray-800 px-5 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <img
            src={`${import.meta.env.BASE_URL}ocesa-logo.jpeg`}
            alt="OCESA"
            className="h-7 w-auto object-contain"
          />
          <span className="text-gray-600 text-sm">·</span>
          <span className="text-gray-400 text-sm font-medium">Admin</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
        >
          <LogOut size={16} />
          Salir
        </button>
      </header>

      <main className="px-4 pt-8 pb-20 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-1">Panel de Administración</h1>
        <p className="text-gray-500 text-sm mb-7">Espacios Corporativos · Gestión de usuarios</p>

        <div className="grid grid-cols-3 gap-3 mb-7">
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center gap-1.5 mb-2">
              <Users size={14} className="text-blue-400" />
              <span className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider">Total</span>
            </div>
            <p className="text-2xl font-black text-white">{allUsers.length}</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center gap-1.5 mb-2">
              <TicketCheck size={14} className="text-green-400" />
              <span className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider">Acceso</span>
            </div>
            <p className="text-2xl font-black text-green-400">{approvedCount}</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center gap-1.5 mb-2">
              <TicketX size={14} className="text-red-400" />
              <span className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider">Sin acc.</span>
            </div>
            <p className="text-2xl font-black text-red-400">{noAccessCount}</p>
          </div>
        </div>

        <div className="flex gap-2 mb-5">
          <button
            onClick={handleApproveAll}
            disabled={allUsers.length === 0}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
          >
            <CheckCheck size={14} />
            Aprobar todos
          </button>
          <button
            onClick={handleRevokeAll}
            disabled={allUsers.length === 0}
            className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-gray-300 text-xs font-semibold px-3 py-2 rounded-lg transition-colors border border-gray-700"
          >
            <X size={14} />
            Revocar todos
          </button>
        </div>

        <div className="relative mb-3">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex gap-1 mb-5 bg-gray-900 border border-gray-800 rounded-lg p-1">
          {([["todos", "Todos"], ["con-acceso", "Con acceso"], ["sin-acceso", "Sin acceso"]] as const).map(
            ([val, label]) => (
              <button
                key={val}
                onClick={() => setFilter(val)}
                className={`flex-1 text-xs font-semibold py-1.5 rounded-md transition-colors ${
                  filter === val
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {label}
              </button>
            )
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-gray-900 rounded-xl border border-gray-800 px-6 py-14 text-center">
            <Users size={32} className="text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              {allUsers.length === 0 ? "Aún no hay usuarios registrados." : "No se encontraron usuarios."}
            </p>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            {filtered.map((u, i) => {
              const allowed = !!permissions[u.email.toLowerCase()];
              const expanded = expandedUser === u.email;
              return (
                <div key={u.email} className={i < filtered.length - 1 ? "border-b border-gray-800" : ""}>
                  <div className="px-4 py-3.5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-300 text-xs font-black">
                        {u.name.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm leading-tight truncate">{u.name}</p>
                      <p className="text-gray-500 text-xs truncate">{u.email}</p>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <button
                        onClick={() => handleToggle(u.email, allowed)}
                        className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                          allowed ? "bg-blue-500" : "bg-gray-700"
                        }`}
                        role="switch"
                        aria-checked={allowed}
                        title={allowed ? "Revocar acceso" : "Dar acceso"}
                      >
                        <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200 ${allowed ? "translate-x-4" : "translate-x-0"}`} />
                      </button>

                      <button
                        onClick={() => setExpandedUser(expanded ? null : u.email)}
                        className="text-gray-500 hover:text-white transition-colors"
                        title="Más opciones"
                      >
                        <ChevronDown size={16} className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
                      </button>
                    </div>
                  </div>

                  {expanded && (
                    <div className="px-4 pb-4 flex gap-2 border-t border-gray-800 pt-3 bg-gray-950">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full mr-auto ${allowed ? "bg-green-900/50 text-green-400" : "bg-gray-800 text-gray-500"}`}>
                        {allowed ? "Con acceso" : "Sin acceso"}
                      </span>
                      <button
                        onClick={() => setPwdModal(u)}
                        className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors border border-gray-700"
                      >
                        <KeyRound size={12} />
                        Contraseña
                      </button>
                      <button
                        onClick={() => setDeleteModal(u)}
                        className="flex items-center gap-1.5 bg-red-900/30 hover:bg-red-900/60 text-red-400 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors border border-red-900/50"
                      >
                        <Trash2 size={12} />
                        Eliminar
                      </button>
                    </div>
                  )}
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
