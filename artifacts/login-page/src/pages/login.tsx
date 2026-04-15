import { useState } from "react";
import { useLocation, Link } from "wouter";
import { KeyRound, ArrowLeft, X, UserRound, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/auth";

type Step = "email" | "password" | "register";

function PasskeyInfoModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl px-6 pt-7 pb-8 w-full max-w-sm shadow-2xl animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <UserRound size={28} strokeWidth={1.5} className="text-black" />
              <KeyRound
                size={14}
                strokeWidth={2}
                className="text-black absolute -bottom-1 -right-1"
              />
            </div>
            <h2 className="text-2xl font-bold text-black">Llaves De Acceso</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black transition-colors p-1"
            aria-label="Cerrar"
          >
            <X size={22} />
          </button>
        </div>

        <p className="text-base text-gray-800 leading-relaxed mb-5">
          Las llaves de acceso son llaves digitales guardadas en tu dispositivo y en el gestor de contraseñas. Inicia sesión rápida y seguramente usando tu rostro, huella digital o el bloqueo del dispositivo.
        </p>

        <p className="text-base text-gray-800 leading-relaxed">
          Para iniciar sesión con una llave de acceso, primero debes añadir una a tu cuenta. Inicia sesión en tu cuenta desde un navegador móvil o de escritorio con tu contraseña. Ve a Mi perfil y selecciona la pestaña &ldquo;Inicio de sesión y seguridad&rdquo; para añadir una llave de acceso.
        </p>
      </div>
    </div>
  );
}

async function triggerPasskeyAuth(): Promise<{ success: boolean; error?: string }> {
  if (!window.PublicKeyCredential) {
    return { success: false, error: "Tu dispositivo no soporta llaves de acceso." };
  }

  try {
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    const credential = await navigator.credentials.get({
      publicKey: {
        challenge,
        rpId: window.location.hostname,
        userVerification: "preferred",
        timeout: 60000,
      },
    });

    if (credential) {
      return { success: true };
    }
    return { success: false, error: "No se pudo completar la autenticación." };
  } catch (err: unknown) {
    const e = err as Error;
    if (e.name === "NotAllowedError") {
      return { success: false, error: "Autenticación cancelada." };
    }
    if (e.name === "InvalidStateError" || e.name === "NotSupportedError") {
      return { success: false, error: "No tienes ninguna llave de acceso registrada en este dispositivo." };
    }
    return { success: false, error: "No tienes ninguna llave de acceso registrada en este dispositivo." };
  }
}

export default function LoginPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPasskeyModal, setShowPasskeyModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passkeyLoading, setPasskeyLoading] = useState(false);
  const { login, register, checkEmailExists } = useAuth();
  const [, setLocation] = useLocation();

  const handleEmailContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !email.includes("@")) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }
    setLoading(true);
    const exists = await checkEmailExists(email);
    setLoading(false);
    setStep(exists ? "password" : "register");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      try {
        const session = localStorage.getItem("ec_session");
        const parsed = session ? JSON.parse(session) : null;
        if (parsed?.role === "admin") {
          setLocation("/admin");
          return;
        }
      } catch {}
      setLocation("/eventos");
    } else {
      setError(result.error ?? "Error al iniciar sesión.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Ingresa tu nombre completo.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    const result = await register(email, password, name.trim());
    setLoading(false);
    if (result.success) {
      setLocation("/eventos");
    } else {
      setError(result.error ?? "Error al crear la cuenta.");
    }
  };

  const handlePasskeyLogin = async () => {
    setError("");
    setPasskeyLoading(true);
    const result = await triggerPasskeyAuth();
    setPasskeyLoading(false);
    if (result.success) {
      setLocation("/eventos");
    } else {
      setError(result.error ?? "No se pudo autenticar con la llave de acceso.");
    }
  };

  const handleBack = () => {
    setError("");
    setPassword("");
    setConfirmPassword("");
    setStep("email");
  };

  return (
    <>
      {showPasskeyModal && (
        <PasskeyInfoModal onClose={() => setShowPasskeyModal(false)} />
      )}

      <div className="min-h-screen bg-white flex items-start justify-center pt-12 px-6">
        <div className="w-full max-w-sm">
          {step === "email" && (
            <>
              <h1 className="text-2xl font-black uppercase tracking-tight leading-tight mb-6">
                Iniciar sesión o crear cuenta<br />
                <span>Espacios Corporativos</span>
              </h1>

              <p className="text-base text-gray-700 mb-8">
                Si no tiene una cuenta, se le pedirá que cree una.
              </p>

              <form onSubmit={handleEmailContinue}>
                <label htmlFor="email" className="block text-sm text-gray-600 mb-1">
                  Correo Electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-testid="input-email"
                  className="w-full border border-gray-300 rounded px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-gray-400 mb-4 bg-white"
                />

                {error && (
                  <p className="text-red-600 text-sm mb-3">{error}</p>
                )}

                <button
                  type="submit"
                  data-testid="button-continuar"
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded transition-colors duration-150 mb-5"
                >
                  Continuar
                </button>
              </form>

              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-gray-300" />
                <span className="text-sm text-gray-500">o</span>
                <div className="flex-1 h-px bg-gray-300" />
              </div>

              <button
                type="button"
                data-testid="button-passkey"
                onClick={handlePasskeyLogin}
                disabled={passkeyLoading}
                className="w-full border border-gray-300 hover:bg-gray-50 disabled:opacity-60 text-gray-800 font-medium py-3 px-4 rounded flex items-center justify-center gap-3 transition-colors duration-150 mb-4"
              >
                <KeyRound size={20} strokeWidth={1.5} />
                <span>{passkeyLoading ? "Verificando..." : "Iniciar sesión con una llave de acceso"}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowPasskeyModal(true)}
                className="w-full text-center text-sm font-bold text-gray-900 mb-8 hover:underline"
                data-testid="link-como-agregar-llave"
              >
                Cómo agregar una llave de acceso
              </button>

              <div className="text-xs text-gray-600 leading-relaxed space-y-3">
                <p>
                  Al continuar con la siguiente página, aceptas los{" "}
                  <Link
                    href="/terminos"
                    className="font-bold underline text-gray-900"
                    data-testid="link-terminos"
                  >
                    términos
                  </Link>{" "}
                  y comprendes que la información se usará como se describe en nuestras{" "}
                  <a
                    href="https://privacy.ticketmaster.com.mx/en/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline text-gray-900"
                    data-testid="link-privacidad"
                  >
                    Política de Privacidad
                  </a>
                </p>
                <p>
                  Según lo establecido en nuestra Política de Privacidad, podemos
                  utilizar su información para marketing por correo electrónico,
                  incluyendo promociones y actualizaciones sobre nuestros productos o
                  los de terceros. Puede darse de baja de nuestros correos electrónicos
                  de marketing en cualquier momento.
                </p>
              </div>
            </>
          )}

          {step === "password" && (
            <>
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
                data-testid="button-back"
              >
                <ArrowLeft size={16} />
                Volver
              </button>

              <h1 className="text-2xl font-black uppercase tracking-tight leading-tight mb-2">
                Bienvenido de regreso
              </h1>
              <p className="text-sm text-gray-500 mb-8">{email}</p>

              <form onSubmit={handleLogin}>
                <label htmlFor="password" className="block text-sm text-gray-600 mb-1">
                  Contraseña
                </label>
                <div className="relative mb-2">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    data-testid="input-password"
                    autoFocus
                    className="w-full border border-gray-300 rounded px-3 py-3 pr-11 text-base focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    tabIndex={-1}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
                  </button>
                </div>

                <button
                  type="button"
                  className="text-sm text-black underline underline-offset-2 mb-4 text-left"
                  data-testid="button-forgot-password"
                >
                  Olvidé mi contraseña
                </button>

                {error && (
                  <p className="text-red-600 text-sm mb-3">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  data-testid="button-login"
                  className="w-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-800 font-semibold py-3 px-4 rounded transition-colors duration-150"
                >
                  {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                </button>
              </form>
            </>
          )}

          {step === "register" && (
            <>
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
                data-testid="button-back"
              >
                <ArrowLeft size={16} />
                Volver
              </button>

              <h1 className="text-2xl font-black uppercase tracking-tight leading-tight mb-2">
                Crear cuenta
              </h1>
              <p className="text-sm text-gray-500 mb-8">{email}</p>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm text-gray-600 mb-1">
                    Nombre completo
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    data-testid="input-name"
                    autoFocus
                    className="w-full border border-gray-300 rounded px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="new-password" className="block text-sm text-gray-600 mb-1">
                    Contraseña
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    data-testid="input-new-password"
                    className="w-full border border-gray-300 rounded px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="confirm-password" className="block text-sm text-gray-600 mb-1">
                    Confirmar contraseña
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    data-testid="input-confirm-password"
                    className="w-full border border-gray-300 rounded px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
                  />
                </div>

                {error && (
                  <p className="text-red-600 text-sm">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  data-testid="button-register"
                  className="w-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-800 font-semibold py-3 px-4 rounded transition-colors duration-150"
                >
                  {loading ? "Creando cuenta..." : "Crear cuenta"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
