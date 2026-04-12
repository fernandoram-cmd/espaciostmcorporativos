import { useState } from "react";
import { KeyRound } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handlePasskey = () => {
  };

  return (
    <div className="min-h-screen bg-white flex items-start justify-center pt-12 px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-black uppercase tracking-tight leading-tight mb-6">
          Iniciar sesión o crear cuenta<br />
          <span>Espacios Corporativos</span>
        </h1>

        <p className="text-base text-gray-700 mb-8">
          Si no tiene una cuenta, se le pedirá que cree una.
        </p>

        <form onSubmit={handleContinue}>
          <label
            htmlFor="email"
            className="block text-sm text-gray-600 mb-1"
          >
            Correo Electrónico
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            data-testid="input-email"
            className="w-full border border-gray-300 rounded px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-gray-400 mb-6 bg-white"
          />

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
          onClick={handlePasskey}
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
            <a
              href="#"
              className="font-bold underline text-gray-900"
              data-testid="link-terminos"
            >
              términos
            </a>{" "}
            y comprendes que la información se usará como se describe en nuestras{" "}
            <a
              href="#"
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
      </div>
    </div>
  );
}
