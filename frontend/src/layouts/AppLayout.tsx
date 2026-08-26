import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Shield, Scan, LayoutDashboard, FileText, Menu, X, Lock, User, LogOut, LogIn, Sun, Moon, Users, RefreshCw, AlertTriangle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { api } from "../services/api";
import { AboutDevModal } from "../components/ui/AboutDevModal";

export interface AppLayoutProps {
  children: React.ReactNode;
}

type ConnectionStatus = "connecting" | "waking_up" | "online" | "offline";

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDevOpen, setAboutDevOpen] = useState(false);
  
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connecting");
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const retryTimerRef = useRef<any>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const checkConnection = useCallback(async (isManual = false) => {
    if (isManual) setIsRetrying(true);

    try {
      await api.checkHealth();
      if (!isMountedRef.current) return;
      setConnectionStatus("online");
      setRetryCount(0);
    } catch {
      if (!isMountedRef.current) return;
      setRetryCount((prev) => {
        const next = prev + 1;
        if (next <= 7) {
          setConnectionStatus("waking_up");
        } else {
          setConnectionStatus("offline");
        }
        return next;
      });
    } finally {
      if (isMountedRef.current && isManual) {
        setIsRetrying(false);
      }
    }
  }, []);

  useEffect(() => {
    checkConnection();

    // Auto-polling: 4.5s when waking up/connecting (cold start), 20s when online or offline
    const intervalTime = connectionStatus === "online" ? 20000 : 4500;
    retryTimerRef.current = setInterval(() => {
      checkConnection();
    }, intervalTime);

    return () => {
      if (retryTimerRef.current) clearInterval(retryTimerRef.current);
    };
  }, [checkConnection, connectionStatus]);

  const handleManualRetry = () => {
    setConnectionStatus("connecting");
    setRetryCount(0);
    checkConnection(true);
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
      {/* User-Facing Status Banner (No raw technical URLs) */}
      {connectionStatus !== "online" && (
        <div
          className={`border-b px-4 py-2.5 text-xs font-mono transition-all flex flex-wrap items-center justify-center gap-3 ${
            connectionStatus === "waking_up" || connectionStatus === "connecting"
              ? "bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300"
              : "bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-300"
          }`}
        >
          {connectionStatus === "connecting" && (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <span>Backend connecting...</span>
            </div>
          )}

          {connectionStatus === "waking_up" && (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span>
                Backend waking up... (Attempt {retryCount}/7 • Render free tier may take ~30–45s on first visit)
              </span>
            </div>
          )}

          {connectionStatus === "offline" && (
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span>
                Backend unavailable. The backend service may be starting up or temporarily offline.
              </span>
            </div>
          )}

          <button
            onClick={handleManualRetry}
            disabled={isRetrying}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 border border-current text-[11px] font-semibold transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isRetrying ? "animate-spin" : ""}`} />
            <span>{isRetrying ? "Checking..." : "Retry Connection"}</span>
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

              {/* Backend Status Badge */}
              <div
                title={
                  connectionStatus === "online"
                    ? "Backend service is operational"
                    : connectionStatus === "waking_up"
                    ? "Backend is spinning up on Render"
                    : "Backend is currently unreachable"
                }
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    connectionStatus === "online"
                      ? "bg-green-500 shadow-[0_0_8px_#22c55e]"
                      : connectionStatus === "waking_up"
                      ? "bg-amber-400 animate-ping"
                      : "bg-rose-500 shadow-[0_0_8px_#f43f5e]"
                  }`}
                />
                <span className="text-[11px] font-mono text-zinc-700 dark:text-zinc-300 font-semibold uppercase">
                  {connectionStatus === "online"
                    ? "ONLINE"
                    : connectionStatus === "waking_up"
                    ? "WAKING UP"
                    : "OFFLINE"}
                </span>
              </div>

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
    </div>
  );
};
