const btsCover = `${import.meta.env.BASE_URL}bts-cover.jpeg`;
const gnpHero = `${import.meta.env.BASE_URL}boxes-hero.png`;

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-black">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${btsCover})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          filter: "brightness(0.5) saturate(0.6)",
        }}
      />
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.45)" }} />
      <div
        className="absolute bottom-0 left-0 right-0 h-1/2"
        style={{
          backgroundImage: `url(${gnpHero})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          filter: "brightness(0.4) saturate(0.3)",
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-1/2" style={{ backgroundColor: "rgba(0,0,0,0.72)" }} />

      <div className="relative flex flex-col items-center gap-5">
        <div className="relative w-16 h-16">
          <svg
            className="animate-spin"
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ animationDuration: "1.1s" }}
          >
            <defs>
              <linearGradient id="spinner-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1C6AE4" />
                <stop offset="40%" stopColor="#64B5F6" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>
            </defs>
            <circle
              cx="32"
              cy="32"
              r="26"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="5"
              fill="none"
            />
            <path
              d="M32 6 A26 26 0 1 1 6.8 44"
              stroke="url(#spinner-grad)"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>

        <p className="text-white text-base font-medium drop-shadow-md text-center px-8">
          Un momento... estamos trabajando en su solicitud.
        </p>
      </div>
    </div>
  );
}
