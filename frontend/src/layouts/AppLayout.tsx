import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Shield, Scan, LayoutDashboard, FileText, Menu, X, Lock, User, LogOut, LogIn, Sun, Moon, Users, Server } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { api, getApiBaseUrl } from "../services/api";
import { AboutDevModal } from "../components/ui/AboutDevModal";

export interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDevOpen, setAboutDevOpen] = useState(false);
  const [serverModalOpen, setServerModalOpen] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState(() => localStorage.getItem("custom_api_url") || "");
  const [backendHealthy, setBackendHealthy] = useState<boolean | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    let intervalId: any;
    let currentInterval = 5000;
    const FAST_INTERVAL = 5000;     // 5s when online or first check
    const SLOW_INTERVAL = 15000;    // 15s when backend is down (Render spin-down)

    const check = () => {
      api.checkHealth()
        .then(() => {
          setBackendHealthy(true);
          currentInterval = FAST_INTERVAL;
        })
        .catch(() => {
          setBackendHealthy(false);
          currentInterval = SLOW_INTERVAL;
        })
        .finally(() => {
          clearInterval(intervalId);
          intervalId = setInterval(check, currentInterval);
        });
    };

    check();
    intervalId = setInterval(check, currentInterval);
    return () => clearInterval(intervalId);
  }, []);

  const handleSaveServerUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrlInput.trim()) {
      localStorage.setItem("custom_api_url", customUrlInput.trim());
    } else {
      localStorage.removeItem("custom_api_url");
    }
    setServerModalOpen(false);
    setBackendHealthy(null);
    api.checkHealth()
      .then(() => setBackendHealthy(true))
      .catch(() => setBackendHealthy(false));
  };

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
      {/* Backend Warming / Connection Banner */}
      {backendHealthy === false && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2.5 text-center text-xs font-mono text-amber-700 dark:text-amber-300 flex flex-wrap items-center justify-center gap-3">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          <span>
            Connecting to backend: <strong className="font-bold underline">{getApiBaseUrl()}</strong> (Render free tier may take ~30–45s to wake up).
          </span>
          <button
            onClick={() => setServerModalOpen(true)}
            className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-900 dark:text-amber-200 text-[11px] font-semibold underline"
          >
            Change Backend URL
          </button>
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

              {/* Backend Status & Quick URL Config */}
              <button
                onClick={() => setServerModalOpen(true)}
                title="Click to configure or view Backend API URL"
                className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-green-500/50 transition-colors"
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    backendHealthy === true
                      ? "bg-green-500 shadow-[0_0_8px_#22c55e]"
                      : backendHealthy === false
                      ? "bg-rose-500 shadow-[0_0_8px_#f43f5e]"
                      : "bg-amber-400 animate-ping"
                  }`}
                />
                <span className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400 font-semibold">
                  {backendHealthy === true ? "ONLINE" : "OFFLINE"}
                </span>
              </button>

              {/* User Authentication Status */}
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400">
                    <User className="w-3.5 h-3.5" />
                    <span className="max-w-[120px] truncate font-sans text-xs font-semibold">
                      {user?.full_name || user?.email}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className="p-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500 hover:bg-green-600 text-black font-semibold text-xs font-mono transition-colors shadow-sm"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-5 h-5 text-green-400" /> : <Moon className="w-5 h-5 text-green-600" />}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white focus:outline-none"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-green-600 dark:text-green-400" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-black/95 backdrop-blur-xl px-4 pt-2 pb-4 space-y-2">
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
              onClick={() => {
                setAboutDevOpen(true);
                setMobileMenuOpen(false);
              }}
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              <Users className="w-5 h-5" />
              <span>About Dev</span>
            </button>

            <button
              onClick={() => {
                setServerModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              <Server className="w-5 h-5 text-green-500" />
              <span>Server Connection Settings</span>
            </button>

            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-rose-500 dark:text-rose-400 font-mono text-xs"
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

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black mt-auto py-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span>ZERO-RETENTION PRIVACY: Inputs are processed transiently and never stored without authorization.</span>
          </div>
          <div className="flex items-center gap-4">
            <span>DIESS v0.1.0</span>
            <span className="text-zinc-300 dark:text-zinc-700">|</span>
            <span className="text-green-600 dark:text-green-400 font-semibold">SECURITY ENGINE</span>
          </div>
        </div>
      </footer>

      {/* About Dev Modal */}
      <AboutDevModal isOpen={aboutDevOpen} onClose={() => setAboutDevOpen(false)} />

      {/* Backend Server URL Config Modal */}
      {serverModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Server className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-bold text-black dark:text-white font-sans">
                  Backend API Connection
                </h3>
              </div>
              <button
                onClick={() => setServerModalOpen(false)}
                className="text-zinc-400 hover:text-black dark:hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Current API Endpoint: <strong className="text-green-600 dark:text-green-400 font-mono">{getApiBaseUrl()}</strong>
            </p>

            <form onSubmit={handleSaveServerUrl} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-700 dark:text-zinc-300 uppercase font-semibold">
                  Custom Backend URL (from Render):
                </label>
                <input
                  type="text"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  placeholder="https://ai-identity-guardian-api.onrender.com"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-black dark:text-white font-mono focus:outline-none focus:border-green-500"
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setCustomUrlInput("https://ai-identity-guardian-api.onrender.com")}
                  className="text-[11px] font-mono px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 hover:border-green-500 text-zinc-700 dark:text-zinc-300"
                >
                  Render Default
                </button>
                <button
                  type="button"
                  onClick={() => setCustomUrlInput("http://localhost:8000")}
                  className="text-[11px] font-mono px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 hover:border-green-500 text-zinc-700 dark:text-zinc-300"
                >
                  Localhost:8000
                </button>
                <button
                  type="button"
                  onClick={() => setCustomUrlInput("")}
                  className="text-[11px] font-mono px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 hover:border-rose-500 text-rose-500"
                >
                  Reset
                </button>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setServerModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-mono font-bold bg-green-500 hover:bg-green-600 text-black rounded-lg transition-colors"
                >
                  Save & Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
