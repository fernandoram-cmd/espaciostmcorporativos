import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/auth";
import AppHeader from "@/components/AppHeader";
import MenuDrawer from "@/components/MenuDrawer";

export default function GnpPremiumPage() {
  const { user, loading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  if (loading) return null;
  if (!user) {
    setLocation("/");
    return null;
  }

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
    </div>
  );
}
