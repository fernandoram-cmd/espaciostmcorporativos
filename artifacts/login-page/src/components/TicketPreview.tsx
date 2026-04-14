import { useState, useCallback } from "react";
import { useAuth } from "@/context/auth";

const DOWNLOADS_KEY = "ec_pass_downloads";

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

const pkpassUrl = `${import.meta.env.BASE_URL}pase-evento.pkpass`;
const coverUrl = `${import.meta.env.BASE_URL}bts-cover.jpeg`;

interface TicketPreviewProps {
  onViewBarcode: () => void;
}

export default function TicketPreview({ onViewBarcode }: TicketPreviewProps) {
  const { user } = useAuth();
  const [downloaded, setDownloaded] = useState(() =>
    user?.email ? hasDownloaded(user.email) : false
  );

  const handleDownload = useCallback(() => {
    if (!user?.email || downloaded) return;
    markDownloaded(user.email);
    setDownloaded(true);
  }, [user?.email, downloaded]);

  return (
    <div className="rounded-2xl overflow-hidden shadow-md border border-gray-200 bg-white">
      <div
        className="w-full py-3 flex items-center justify-center"
        style={{ backgroundColor: "#1C6AE4" }}
      >
        <span className="text-white font-bold text-base tracking-wide text-center">
          Boleto Espacios Corporativos
        </span>
      </div>

      <div
        className="w-full px-5 pt-4 pb-5"
        style={{ backgroundColor: "#1C6AE4" }}
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-blue-200 text-[11px] font-semibold uppercase tracking-widest mb-1">
              Sección
            </p>
            <p className="text-white text-2xl font-black leading-tight">Box Oro</p>
          </div>
          <div className="text-center">
            <p className="text-blue-200 text-[11px] font-semibold uppercase tracking-widest mb-1">
              Fila
            </p>
            <p className="text-white text-2xl font-black leading-tight">6</p>
          </div>
          <div className="text-right">
            <p className="text-blue-200 text-[11px] font-semibold uppercase tracking-widest mb-1">
              Asiento
            </p>
            <p className="text-white text-2xl font-black leading-tight">4</p>
          </div>
        </div>
      </div>

      <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
        <img
          src={coverUrl}
          alt="BTS World Tour"
          className="w-full h-full object-cover object-top"
        />
        <div
          className="absolute inset-0 flex flex-col items-center justify-end pb-5 px-4"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.3) 55%, transparent 100%)",
          }}
        >
          <p className="text-white text-center font-bold text-base leading-snug drop-shadow-md">
            BTS WORLD TOUR &apos;ARIRANG&apos; IN MEXICO CITY
          </p>
          <p className="text-gray-300 text-center text-sm mt-1 drop-shadow-md">
            Estadio GNP Seguros
          </p>
          <p className="text-gray-300 text-center text-sm drop-shadow-md">
            sáb. 09 de may de 2026, 8:00 p.m.
          </p>
        </div>
      </div>

      <div className="px-5 pt-5 pb-2">
        <p className="text-center text-black font-medium text-base mb-5">
          Boleto digital
        </p>

        {downloaded ? (
          <a
            href={pkpassUrl}
            className="flex items-center justify-center w-full bg-[#1C6AE4] text-white py-3.5 px-5 rounded-xl font-bold text-base"
          >
            Ver en cartera
          </a>
        ) : (
          <a
            href={pkpassUrl}
            download="pase-evento.pkpass"
            onClick={handleDownload}
            className="flex items-center justify-center w-full bg-black text-white py-3.5 px-5 rounded-xl font-bold text-base"
          >
            Añadir a Cartera
          </a>
        )}

        <div className="flex justify-center items-center gap-8 mt-5 mb-3">
          <button
            onClick={onViewBarcode}
            className="text-[#1C6AE4] font-semibold text-sm"
          >
            Ver Código de Barras
          </button>
          <button
            className="text-[#1C6AE4] font-semibold text-sm"
          >
            Detalles del Boleto
          </button>
        </div>
      </div>
    </div>
  );
}
