import { NavLink } from "react-router-dom";
import { Home, Music2, ListMusic, Heart, User } from "lucide-react";

const items = [
  { to: "/", label: "Beranda", icon: Home },
  { to: "/tracks", label: "Daftar Lagu", icon: Music2 },
  { to: "/playlists", label: "Playlist", icon: ListMusic },
  { to: "/favorites", label: "Favorit", icon: Heart },
  { to: "/profile", label: "Profil", icon: User },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-slate-950/90 border-t border-white/10 backdrop-blur">
      <div className="max-w-6xl mx-auto grid grid-cols-5 text-[11px]">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <NavLink
              key={it.to}
              to={it.to}
              end
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-3 gap-1 ${
                  isActive ? "text-emerald-300" : "text-slate-400"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span>{it.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
