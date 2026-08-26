import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Shield, Scan, LayoutDashboard, FileText, Menu, X, Lock, User, LogOut, LogIn, Sun, Moon, Users } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { api } from "../services/api";
import { AboutDevModal } from "../components/ui/AboutDevModal";

export interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDevOpen, setAboutDevOpen] = useState(false);
  const [backendHealthy, setBackendHealthy] = useState<boolean | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    let intervalId: any;
    const check = () => {
      api.checkHealth()
        .then(() => {
          setBackendHealthy(true);
        })
        .catch(() => {
          setBackendHealthy(false);
        });
    };

    check();
    intervalId = setInterval(check, 4000);
    return () => clearInterval(intervalId);
  }, []);

  const navLinks = [
    { label: "Overview", path: "/", icon: Shield },
    { label: "Identity Scan", path: "/scan", icon: Scan },
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Reports", path: "/report", icon: FileText },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white transition-colors duration-200">
      {backendHealthy === false && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 text-center text-xs font-mono text-amber-700 dark:text-amber-300 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          <span>
            Waking up backend API service... (Render free tier takes ~30-45s on first visit). Retrying automatically.
          </span>
        </div>
      )}
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-600 dark:text-green-400 transition-colors">
                <Shield className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-bold tracking-tight text-black dark:text-white font-sans">
                  AI Identity Guardian
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-green-600 dark:text-green-400">
                  Identity Security Engine
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/30 font-semibold"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
              <button
                onClick={() => setAboutDevOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                <Users className="w-4 h-4" />
                <span>About Dev</span>
              </button>
            </nav>

            {/* Right Action Section */}
            <div className="hidden md:flex items-center gap-3">
              {/* Theme Switcher */}
              <button
                onClick={toggleTheme}
                title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
                aria-label="Toggle color theme"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-200 font-mono text-xs font-semibold
                  bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-green-500/50"
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="w-4 h-4 text-green-400" />
                    <span className="text-[11px]">Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-green-600" />
                    <span className="text-[11px]">Dark</span>
                  </>
                )}
              </button>

              {/* Backend Status */}
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span
                  className={`w-2 h-2 rounded-full ${
                    backendHealthy === true
                      ? "bg-green-500"
                      : backendHealthy === false
                      ? "bg-red-500"
                      : "bg-amber-400 animate-ping"
                  }`}
                />
                <span className="text-zinc-600 dark:text-zinc-400 text-[11px] font-mono">
                  {backendHealthy === true ? "ONLINE" : "OFFLINE"}
                </span>
              </div>

              {/* Auth */}
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-300">
                    <User className="w-3.5 h-3.5" />
                    <span className="max-w-[120px] truncate font-sans text-xs font-semibold">
                      {user?.full_name || user?.email}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className="p-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-red-500 hover:border-red-500/40 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500 hover:bg-green-400 text-black font-semibold transition-colors text-sm"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-green-600 dark:text-green-400"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 focus:outline-none"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-green-600 dark:text-green-400" />}
              </button>
            </div>
          </div>
        </div>            {/* Mobile Navigation Drawer */}
            {mobileMenuOpen && (
              <div className="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black px-4 pt-2 pb-4 space-y-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                        active
                          ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/30 font-semibold"
                          : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
                <button
                  onClick={() => { setAboutDevOpen(true); setMobileMenuOpen(false); }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 w-full"
                >
                  <Users className="w-5 h-5" />
                  <span>About Dev</span>
                </button>

                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  {isAuthenticated ? (
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-red-500 font-mono text-xs"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out ({user?.email})</span>
                    </button>
                  ) : (
                    <Link
                      to="/auth"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-green-600 dark:text-green-400 font-mono text-xs font-semibold"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Sign In / Create Account</span>
                    </Link>
                  )}
                </div>
              </div>
            )}
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* About Dev Modal */}
      <AboutDevModal isOpen={aboutDevOpen} onClose={() => setAboutDevOpen(false)} />

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black mt-auto py-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-500 font-mono">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span>ZERO-RETENTION PRIVACY: Inputs are processed transiently and never stored.</span>
          </div>
          <div className="flex items-center gap-4">
            <span>DIESS v0.1.0</span>
            <span className="text-zinc-300 dark:text-zinc-700">|</span>
            <span className="text-green-600 dark:text-green-400 font-semibold">SECURITY ENGINE</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
