import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "@/context/auth";

const DOWNLOADS_KEY = "ec_pass_downloads";
const BARCODE_INTERVAL_MS = 10000;

function hasDownloaded(email: string): boolean {
  try {
    const data = localStorage.getItem(DOWNLOADS_KEY);
    const map: Record<string, boolean> = data ? JSON.parse(data) : {};
    return !!map[email.toLowerCase()];
  } catch {
    return false;
  }
}

function markDownloaded(email: string) {
  try {
    const data = localStorage.getItem(DOWNLOADS_KEY);
    const map: Record<string, boolean> = data ? JSON.parse(data) : {};
    map[email.toLowerCase()] = true;
    localStorage.setItem(DOWNLOADS_KEY, JSON.stringify(map));
  } catch {}
}

function generateCode(): string {
  const base = Math.floor(10000000000 + Math.random() * 89999999999);
  return base.toString();
}

function SafetixBarcode({ code }: { code: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const posRef = useRef(0);
  const dirRef = useRef(1);

  useEffect(() => {
    let mounted = true;
    cancelAnimationFrame(rafRef.current);

    async function init() {
      const bwipjs = await import("bwip-js");
      const canvas = canvasRef.current;
      if (!canvas || !mounted) return;

      bwipjs.toCanvas(canvas, {
        bcid: "pdf417",
        text: code,
        scale: 3,
        height: 10,
        includetext: false,
        padding: 0,
      });

      const w = canvas.width;
      const h = canvas.height;
      const ctx = canvas.getContext("2d")!;
      const snapshot = ctx.getImageData(0, 0, w, h);

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
  }, [code]);

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
  const { user } = useAuth();
  const [downloaded, setDownloaded] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [barcodeCode, setBarcodeCode] = useState(() => generateCode());
  const [barcodeFlash, setBarcodeFlash] = useState(false);
  const infoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (user?.email) {
      setDownloaded(hasDownloaded(user.email));
    }
  }, [user?.email]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBarcodeFlash(true);
      setTimeout(() => {
        setBarcodeCode(generateCode());
        setBarcodeFlash(false);
      }, 400);
    }, BARCODE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const handleDownload = useCallback(() => {
    if (!user?.email || downloaded) return;
    markDownloaded(user.email);
    setDownloaded(true);
  }, [user?.email, downloaded]);

  const handleInfo = useCallback(() => {
    setShowInfo(true);
    if (infoTimerRef.current) clearTimeout(infoTimerRef.current);
    infoTimerRef.current = setTimeout(() => setShowInfo(false), 3000);
  }, []);

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 mb-6 bg-white"
      data-testid="digital-ticket"
    >
      <div
        className="w-full flex items-center justify-center py-2"
        style={{ backgroundColor: "#1C6AE4" }}
      >
        <span
          className="text-white font-bold italic select-none"
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "1.1rem",
            letterSpacing: "-0.01em",
          }}
        >
          ticketmaster
          <sup style={{ fontSize: "0.55em", fontStyle: "normal", verticalAlign: "super" }}>®</sup>
        </span>
      </div>

      <div className="px-5 pt-8 pb-0">
        <p
          className="text-xs text-gray-500 font-semibold uppercase tracking-widest text-center mb-2"
          style={{ letterSpacing: "0.08em" }}
        >
          BTS WORLD TOUR &lsquo;ARIRANG&rsquo; IN MEXICO CITY
        </p>

        <div className="flex items-center justify-between mb-7 mt-4">
          <h2 className="text-xl font-bold text-gray-900">Boxes Oro</h2>
          <div className="relative">
            <button
              onClick={handleInfo}
              className="w-7 h-7 rounded-full border-2 border-blue-500 flex items-center justify-center text-blue-500 font-bold text-sm flex-shrink-0"
              aria-label="Información"
            >
              i
            </button>
            {showInfo && (
              <div className="absolute right-0 top-9 flex items-center gap-1.5 bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-10 animate-fade-in">
                <span>⚠️</span>
                <span>Boleto digital</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between mb-12">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Sección
            </p>
            <p className="text-2xl font-black text-gray-900 leading-none">Box Oro</p>
          </div>
          <div className="text-center">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Fila
            </p>
            <p className="text-2xl font-black text-gray-900 leading-none">6</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Asiento(s)
            </p>
            <p className="text-2xl font-black text-gray-900 leading-none">4</p>
          </div>
        </div>

        <div
          className="mb-0 px-4 transition-opacity duration-300"
          style={{ opacity: barcodeFlash ? 0 : 1 }}
        >
          <SafetixBarcode code={barcodeCode} />
        </div>

        <p className="text-center text-sm text-gray-600 leading-snug mb-12 mt-6">
          No podrás entrar con capturas de pantalla.
        </p>
      </div>

      <div className="bg-black mx-0 py-6 flex items-center justify-center">
        <p className="text-white text-xl font-black uppercase tracking-[0.2em]">
          Acceso F
        </p>
      </div>

      <div className="px-5 py-5">
        {downloaded ? (
          <div
            className="flex items-center justify-center w-full bg-gray-100 text-gray-500 py-3 px-5 rounded-xl border border-gray-200"
            data-testid="button-wallet-downloaded"
          >
            <span className="text-sm font-semibold">✓ Cartera descargada</span>
          </div>
        ) : (
          <a
            href={pkpassUrl}
            download="pase-evento.pkpass"
            onClick={handleDownload}
            className="flex items-center justify-center w-full bg-black text-white py-3 px-5 rounded-xl hover:bg-gray-900 transition-colors"
            data-testid="button-wallet"
          >
            <span className="text-base font-bold">Añadir a cartera</span>
          </a>
        )}
      </div>
    </div>
  );
}
