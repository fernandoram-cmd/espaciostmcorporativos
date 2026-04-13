import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/auth";
import AppHeader from "@/components/AppHeader";
import MenuDrawer from "@/components/MenuDrawer";
import stadiumConcert from "@/assets/stadium-concert.png";
import domeArena from "@/assets/dome-arena.png";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  if (!user) return null;

  const firstName = user.name.split(" ")[0];
  const initial = firstName.charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-white">
      <AppHeader
        userInitial={initial}
        userName={firstName}
        onMenuOpen={() => setMenuOpen(true)}
        onLogout={handleLogout}
      />

      <MenuDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        userInitial={initial}
        userName={firstName}
        onLogout={handleLogout}
      />

      <section className="relative w-full overflow-hidden">
        <img
          src={stadiumConcert}
          alt="Concert stadium"
          className="w-full object-cover"
          style={{ height: "420px" }}
          data-testid="img-stadium-concert"
        />
        <div className="absolute inset-0 flex flex-col justify-center px-4" style={{ gap: "2px" }}>
          <div>
            <span
              className="text-white text-xl font-normal"
              style={{
                backgroundColor: "rgba(0,0,0,0.85)",
                boxDecorationBreak: "clone",
                WebkitBoxDecorationBreak: "clone",
                padding: "3px 5px",
                lineHeight: "1.7",
              }}
              data-testid="text-welcome-line1"
            >
              Hi, {firstName}! Welcome to the <strong>Account Manager</strong>
            </span>
          </div>
          <div>
            <span
              className="text-white text-xl font-normal"
              style={{
                backgroundColor: "rgba(0,0,0,0.85)",
                boxDecorationBreak: "clone",
                WebkitBoxDecorationBreak: "clone",
                padding: "3px 5px",
                lineHeight: "1.7",
              }}
              data-testid="text-welcome-line2"
            >
              of <strong>Espacios Corporativos.</strong>
            </span>
          </div>
          <div style={{ marginTop: "4px" }}>
            <span
              className="text-gray-300 text-sm font-normal"
              style={{
                backgroundColor: "rgba(0,0,0,0.75)",
                boxDecorationBreak: "clone",
                WebkitBoxDecorationBreak: "clone",
                padding: "2px 5px",
                lineHeight: "1.7",
              }}
              data-testid="text-subtitle"
            >
              Log in to manage your accesses.
            </span>
          </div>
        </div>
      </section>

      <section className="relative w-full">
        <img
          src={domeArena}
          alt="Dome arena"
          className="w-full object-cover"
          style={{ height: "320px" }}
          data-testid="img-dome-arena"
        />
      </section>
    </div>
  );
}
