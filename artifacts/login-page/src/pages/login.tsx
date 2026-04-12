import { useState } from "react";
import { useLocation } from "wouter";
import { KeyRound, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/auth";

type Step = "email" | "password" | "register";

export default function LoginPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register, checkEmailExists } = useAuth();
  const [, setLocation] = useLocation();

  const handleEmailContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !email.includes("@")) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }
    const exists = checkEmailExists(email);
    setStep(exists ? "password" : "register");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      setLocation("/dashboard");
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
      setLocation("/dashboard");
    } else {
      setError(result.error ?? "Error al crear la cuenta.");
    }
  };

  const handleBack = () => {
    setError("");
    setPassword("");
    setConfirmPassword("");
    setStep("email");
  };

  return (
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
              className="w-full border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium py-3 px-4 rounded flex items-center justify-center gap-3 transition-colors duration-150 mb-4"
            >
              <KeyRound size={20} strokeWidth={1.5} />
              <span>Iniciar sesión con una llave de acceso</span>
            </button>

            <button
              type="button"
              className="w-full text-center text-sm font-bold text-gray-900 mb-8 hover:underline"
              data-testid="link-como-agregar-llave"
            >
              Cómo agregar una llave de acceso
            </button>

            <div className="text-xs text-gray-600 leading-relaxed space-y-3">
              <p>
                Al continuar con la siguiente página, aceptas los{" "}
                <a href="#" className="font-bold underline text-gray-900" data-testid="link-terminos">
                  términos
                </a>{" "}
                y comprendes que la información se usará como se describe en nuestras{" "}
                <a href="#" className="font-bold underline text-gray-900" data-testid="link-privacidad">
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
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-testid="input-password"
                autoFocus
                className="w-full border border-gray-300 rounded px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-gray-400 mb-4 bg-white"
              />

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
  );
}
