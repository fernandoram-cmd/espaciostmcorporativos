import { useEffect, useRef } from "react";

interface DigitalTicketProps {
  userName: string;
}

function SafetixBarcode() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    let mounted = true;

    async function init() {
      const bwipjs = await import("bwip-js");
      const canvas = canvasRef.current;
      if (!canvas || !mounted) return;

      bwipjs.toCanvas(canvas, {
        bcid: "pdf417",
        text: "79023648393",
        scale: 2,
        height: 12,
        includetext: false,
        padding: 4,
      });

      const w = canvas.width;
      const h = canvas.height;
      const overlay = document.createElement("canvas");
      overlay.width = w;
      overlay.height = h;
      const oc = overlay.getContext("2d")!;

      const ctx = canvas.getContext("2d")!;
      const snapshot = ctx.getImageData(0, 0, w, h);

      let angle = 0;

      function animate() {
        if (!mounted) return;
        ctx.putImageData(snapshot, 0, 0);

        oc.clearRect(0, 0, w, h);
        const grad = oc.createLinearGradient(
          w * 0.5 + Math.cos(angle) * w,
          h * 0.5 + Math.sin(angle) * h,
          w * 0.5 - Math.cos(angle) * w,
          h * 0.5 - Math.sin(angle) * h
        );
        grad.addColorStop(0, "rgba(0,120,255,0)");
        grad.addColorStop(0.35, "rgba(0,120,255,0)");
        grad.addColorStop(0.5, "rgba(80,180,255,0.22)");
        grad.addColorStop(0.65, "rgba(0,200,180,0.14)");
        grad.addColorStop(1, "rgba(0,120,255,0)");
        oc.fillStyle = grad;
        oc.fillRect(0, 0, w, h);

        ctx.drawImage(overlay, 0, 0);
        angle += 0.018;
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
      style={{ imageRendering: "pixelated" }}
    />
  );
}

export default function DigitalTicket({ userName }: DigitalTicketProps) {
  return (
    <div
      className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 mb-6"
      data-testid="digital-ticket"
    >
      <div className="bg-[#003087] px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-white text-xs font-semibold uppercase tracking-widest opacity-80 mb-0.5">
            Espacios Corporativos
          </p>
          <h2 className="text-white text-xl font-black uppercase leading-tight">
            Boxes Oro
          </h2>
        </div>
        <div className="text-right">
          <span
            className="text-white font-black text-lg uppercase select-none"
            style={{
              fontFamily: "'Arial Black', 'Impact', sans-serif",
              letterSpacing: "0.1em",
            }}
          >
            OCESA
          </span>
        </div>
      </div>

      <div className="bg-white px-5 pt-5 pb-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
          Titular
        </p>
        <p className="text-base font-bold text-gray-900 mb-4">{userName}</p>

        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-gray-50 rounded-xl px-3 py-3 text-center">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Sección
            </p>
            <p className="text-sm font-black text-gray-900 leading-tight">
              Box Oro
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl px-3 py-3 text-center">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Fila
            </p>
            <p className="text-sm font-black text-gray-900">6</p>
          </div>
          <div className="bg-gray-50 rounded-xl px-3 py-3 text-center">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Asiento
            </p>
            <p className="text-sm font-black text-gray-900">4</p>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden border border-gray-100 bg-gray-50 px-3 pt-3 pb-2">
          <SafetixBarcode />

          <div className="flex items-center justify-center gap-1.5 mt-2 mb-1">
            <div className="flex gap-[3px]">
              <span className="block w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="block w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="block w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-widest">
              Safetix
            </span>
            <div className="flex gap-[3px]">
              <span className="block w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: "300ms" }} />
              <span className="block w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="block w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: "0ms" }} />
            </div>
          </div>

          <p className="text-center text-[10px] text-gray-500 leading-tight pb-1">
            No podrás entrar con capturas de pantalla
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-dashed border-gray-300" />
        </div>
        <div className="relative flex justify-between px-3 py-1">
          <div className="w-5 h-5 rounded-full bg-gray-100 border border-gray-200 -ml-3" />
          <div className="w-5 h-5 rounded-full bg-gray-100 border border-gray-200 -mr-3" />
        </div>
      </div>

      <div className="bg-white px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#003087] flex items-center justify-center">
            <span className="text-white text-xs font-black">F</span>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold leading-none mb-0.5">
              Entrada
            </p>
            <p className="text-sm font-black text-gray-900">Acceso F</p>
          </div>
        </div>
        <div className="text-right">
          <span className="inline-block bg-[#003087] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            En línea
          </span>
        </div>
      </div>
    </div>
  );
}
