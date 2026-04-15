import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function TerminosPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-black px-6 pt-12 pb-8">
        <button
          onClick={() => setLocation("/")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Volver</span>
        </button>
        <h1 className="text-3xl font-bold text-white text-center">
          Condiciones de uso
        </h1>
      </div>

      <div className="bg-gray-50 px-5 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-4">
            <h2 className="text-base font-bold text-black mb-1">
              Condiciones de uso de Ticketmaster
            </h2>
            <div className="h-0.5 w-48 bg-black mb-4" />
            <p className="text-sm text-gray-600 text-right mb-6">
              Última actualización: 2 de agosto de 2022
            </p>
          </div>

          <div className="space-y-5 text-base text-gray-800 leading-relaxed">
            <p>
              Los siguientes son los términos de uso (&ldquo;Términos&rdquo;) que rigen su uso del sitio web del Administrador de Cuentas (el &ldquo;Sitio&rdquo;), que ofrece tecnologías y servicios avanzados para la transacción de boletos (denominados colectivamente &ldquo;Servicios Avanzados&rdquo;). Algunos de los Servicios Avanzados son proporcionados por Espacios Corporativos y otros por Ticketmaster (&ldquo;nosotros&rdquo;). Nuestra{" "}
              <a
                href="https://privacy.ticketmaster.com.mx/en/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 underline"
              >
                Política de Privacidad
              </a>{" "}
              y cualquier otra política, norma o directriz que pueda ser aplicable a ofertas o funciones específicas del Sitio también se incorporan a estos Términos. Estos Términos constituyen un acuerdo legal válido, vinculante y ejecutable entre usted, Espacios Corporativos y nosotros. No existirá ningún acuerdo verbal o implícito entre usted y nosotros, usted y Espacios Corporativos, o usted, nosotros y Espacios Corporativos, que sea vinculante o ejecutable. Al visitar o usar el Sitio, usted acepta expresamente estos Términos, que podrán actualizarse periódicamente.
            </p>

            <p>
              Podemos modificar estos Términos en cualquier momento. Cualquier modificación entrará en vigor inmediatamente después de publicar la versión revisada en el Sitio. La fecha de &ldquo;Última actualización&rdquo; que aparece arriba indica cuándo se revisaron estos Términos por última vez. Al continuar utilizando este Sitio después de esa fecha, usted acepta las modificaciones.
            </p>

            <p>
              El Sitio está destinado únicamente para uso personal y no comercial. Usted se compromete a no reproducir, duplicar, copiar, vender, revender ni explotar ninguna parte del Sitio sin el consentimiento expreso por escrito de Ticketmaster.
            </p>

            <p>
              Usted es responsable de mantener la confidencialidad de su cuenta y contraseña, y acepta restringir el acceso a su computadora o dispositivo. Usted acepta la responsabilidad de todas las actividades que ocurran bajo su cuenta o contraseña.
            </p>

            <p>
              Ticketmaster se reserva el derecho de rechazar el servicio, cancelar cuentas, eliminar o editar contenido, o cancelar pedidos a su discreción. Ticketmaster puede, a su sola discreción, limitar o cancelar las cantidades adquiridas por persona, por hogar o por pedido.
            </p>

            <p>
              En la medida máxima permitida por la ley aplicable, Ticketmaster no será responsable de ningún daño indirecto, incidental, especial, consecuente o punitivo, ni de ninguna pérdida de beneficios o ingresos, ya sea directa o indirectamente, ni de ninguna pérdida de datos, uso, fondo de comercio u otras pérdidas intangibles.
            </p>

            <p>
              Estos Términos se regirán e interpretarán de acuerdo con las leyes de los Estados Unidos Mexicanos, sin dar efecto a ningún principio de conflicto de leyes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
