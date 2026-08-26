import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, User, Shield, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useAuth } from "../contexts/AuthContext";

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isAuthenticated) {
    navigate("/dashboard");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (isRegister && password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setIsLoading(true);
    try {
      if (isRegister) {
        await register({
          email: email.trim(),
          password,
          full_name: fullName.trim() || undefined,
        });
      } else {
        await login({
          email: email.trim(),
          password,
        });
      }
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-500 dark:text-green-400 mx-auto">
          <Shield className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-black dark:text-white font-sans">
          {isRegister ? "Create Account" : "Sign In to Dashboard"}
        </h2>
        <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
          {isRegister
            ? "Track historical posture, secure persistent reports & monitor exposures."
            : "Sign in to manage your digital identity posture and audits."}
        </p>
      </div>

      <Card variant="cyber" className="p-6 space-y-6">
        {/* Toggle Tabs */}
        <div className="grid grid-cols-2 p-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setError(null);
            }}
            className={`py-2 rounded-md transition-all font-semibold ${
              !isRegister
                ? "bg-green-500/15 text-green-600 dark:text-green-400 border border-green-500/30"
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setError(null);
            }}
            className={`py-2 rounded-md transition-all font-semibold ${
              isRegister
                ? "bg-green-500/15 text-green-600 dark:text-green-400 border border-green-500/30"
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-500 font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          {isRegister && (
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-zinc-700 dark:text-zinc-300">
                Full Name <span className="text-zinc-400">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Mercer"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-black dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-green-500 font-mono text-sm"
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase text-zinc-700 dark:text-zinc-300">
              Email Address <span className="text-green-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-black dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-green-500 font-mono text-sm"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase text-zinc-700 dark:text-zinc-300">
              Password <span className="text-green-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-black dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-green-500 font-mono text-sm"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {isRegister && (
              <p className="text-[11px] text-zinc-400 font-mono">Minimum 8 characters.</p>
            )}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              size="lg"
              className="w-full font-mono text-sm"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {isRegister ? "Create Account" : "Sign In"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
