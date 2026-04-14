import {
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  UserRoundSearch,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

const Navbar = () => {
  const { role, token, updateUserState } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = useMemo(() => {
    const items = [
      { to: "/", label: "Home", icon: Sparkles },
    ];

    if (token) {
      items.push({ to: "/user/scheme", label: "Scholarships", icon: Search });
    }

    if (role === "user") {
      items.push({ to: "/user/dashboard", label: "Dashboard", icon: LayoutDashboard });
      items.push({
        to: "/user/scholarships/check-eligibility",
        label: "Eligibility",
        icon: UserRoundSearch,
      });
    }

    if (role === "admin") {
      items.push({ to: "/admin/dashboard", label: "Admin", icon: ShieldCheck });
    }

    return items;
  }, [role, token]);

  const closeMenu = () => setIsOpen(false);

  const handleLogout = async () => {
    try {
      const response = await api.get("/auth/logout");
      if (response.data?.success) {
        updateUserState();
        toast.success(response.data.message || "Signed out successfully.");
        closeMenu();
        navigate("/login");
      }
    } catch {
      toast.error("Unable to sign out right now.");
    }
  };

  const authActions = token ? (
    <>
      <Link
        to={role === "admin" ? "/admin/dashboard" : "/user/dashboard"}
        className="secondary-button"
        onClick={closeMenu}
      >
        {role === "admin" ? "Admin Panel" : "Dashboard"}
      </Link>
      <button type="button" onClick={handleLogout} className="primary-button">
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </>
  ) : (
    <>
      <Link to="/login" className="secondary-button" onClick={closeMenu}>
        Login
      </Link>
      <Link to="/login" className="primary-button" onClick={closeMenu}>
        Sign Up
      </Link>
    </>
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--line)] bg-[var(--bg)]/80 backdrop-blur-md">
      <div className="page-shell flex h-[var(--nav-height)] items-center justify-between">
        <div className="flex items-center justify-between w-full gap-4">
          <Link to="/" className="flex min-w-0 items-center gap-3" onClick={closeMenu}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[linear-gradient(135deg,var(--primary),var(--accent))] text-white shadow-sm">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="display-font truncate text-[1.1rem] font-bold tracking-tight text-[var(--ink)]">
                Find My Scholarship
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-pill ${isActive ? "is-active" : ""}`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">{authActions}</div>

          <button
            type="button"
            className="icon-button lg:hidden"
            onClick={() => setIsOpen((open) => !open)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isOpen && (
          <div className="absolute top-full inset-x-0 border-b border-[var(--line)] bg-[var(--surface-strong)] p-4 shadow-sm lg:hidden flex flex-col gap-4">
            <div className="grid gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `nav-pill w-full justify-start ${isActive ? "is-active" : ""}`
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              ))}
            </div>
            <div className="flex flex-col gap-2">{authActions}</div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
