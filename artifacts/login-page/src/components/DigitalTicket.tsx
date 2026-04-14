import { useEffect, useRef } from "react";
import ticketmasterLogo from "@assets/ticketmaster-logo.png";

function SafetixBarcode() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const posRef = useRef(0);
  const dirRef = useRef(1);

  useEffect(() => {
    let mounted = true;

    async function init() {
      const bwipjs = await import("bwip-js");
      const canvas = canvasRef.current;
      if (!canvas || !mounted) return;

      bwipjs.toCanvas(canvas, {
        bcid: "pdf417",
        text: "79023648393",
        scale: 3,
        height: 10,
        includetext: false,
        padding: 0,
      });

      const w = canvas.width;
      const h = canvas.height;
      const ctx = canvas.getContext("2d")!;
      const snapshot = ctx.getImageData(0, 0, w, h);

      posRef.current = 0;

      function animate() {
        if (!mounted) return;
        ctx.putImageData(snapshot, 0, 0);

        const x = posRef.current;
        const lineW = Math.max(6, w * 0.045);

        const grad = ctx.createLinearGradient(x - lineW, 0, x + lineW, 0);
        grad.addColorStop(0, "rgba(30,100,255,0)");
        grad.addColorStop(0.3, "rgba(30,130,255,0.55)");
        grad.addColorStop(0.5, "rgba(80,160,255,0.85)");
        grad.addColorStop(0.7, "rgba(30,130,255,0.55)");
        grad.addColorStop(1, "rgba(30,100,255,0)");

        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = grad;
        ctx.fillRect(x - lineW, 0, lineW * 2, h);

        posRef.current += dirRef.current * 3.5;
        if (posRef.current >= w) dirRef.current = -1;
        if (posRef.current <= 0) dirRef.current = 1;

        rafRef.current = requestAnimationFrame(animate);
      }

      animate();
    }

    init();
    return () => {
      mounted = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full"
      style={{ imageRendering: "pixelated", display: "block" }}
    />
  );
}

const pkpassUrl = `${import.meta.env.BASE_URL}pase-evento.pkpass`;

export default function DigitalTicket({ userName }: { userName: string }) {
  return (
    <div
      className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 mb-6 bg-white"
      data-testid="digital-ticket"
    >
      <div className="w-full">
        <img
          src={ticketmasterLogo}
          alt="Ticketmaster"
          className="w-full object-cover"
          style={{ display: "block" }}
        />
      </div>

      <div className="px-5 pt-5 pb-0">
        <p
          className="text-xs text-gray-500 font-semibold uppercase tracking-widest text-center mb-1"
          style={{ letterSpacing: "0.08em" }}
        >
          BTS WORLD TOUR &lsquo;ARIRANG&rsquo; IN MEXICO CITY
        </p>

        <div className="flex items-center justify-between mb-4 mt-2">
          <h2 className="text-xl font-bold text-gray-900">Boxes Oro</h2>
          <button
            className="w-7 h-7 rounded-full border-2 border-blue-500 flex items-center justify-center text-blue-500 font-bold text-sm flex-shrink-0"
            aria-label="Información"
          >
            i
          </button>
        </div>

        <div className="flex gap-6 mb-6">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
              Sección
            </p>
            <p className="text-2xl font-black text-gray-900 leading-none">Box Oro</p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
              Fila
            </p>
            <p className="text-2xl font-black text-gray-900 leading-none">6</p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
              Asiento(s)
            </p>
            <p className="text-2xl font-black text-gray-900 leading-none">4</p>
          </div>
        </div>

        <div className="mb-1">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            Titular
          </p>
          <p className="text-sm font-semibold text-gray-800 mb-5">{userName}</p>
        </div>

        <div className="mb-2">
          <SafetixBarcode />
        </div>

        <p className="text-center text-sm text-gray-600 leading-snug mb-5 mt-3">
          No podrás entrar con capturas de pantalla.
        </p>
      </div>

      <div className="bg-black mx-0 py-4 flex items-center justify-center">
        <p className="text-white text-xl font-black uppercase tracking-[0.2em]">
          Acceso F
        </p>
      </div>

      <div className="px-5 py-4">
        <a
          href={pkpassUrl}
          download="pase-evento.pkpass"
          className="flex items-center justify-center gap-3 w-full bg-black text-white py-3 px-5 rounded-xl"
          data-testid="button-wallet"
        >
          <span className="text-2xl leading-none">🎫</span>
          <span className="flex flex-col items-start leading-tight">
            <span className="text-base font-bold">Agregar a wallet</span>
          </span>
        </a>
      </div>
    </div>
  );
}
