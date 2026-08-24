import React, { useState } from "react";
import { Fingerprint, User, Calendar, ShieldCheck, Zap, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { UsernameAnalysisRequest } from "../../types";

export interface UsernameAnalysisFormProps {
  onSubmit: (data: UsernameAnalysisRequest) => void;
  isLoading: boolean;
}

export const UsernameAnalysisForm: React.FC<UsernameAnalysisFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [birthYear, setBirthYear] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Please enter a username handle to analyze.");
      return;
    }
    setError(null);

    const payload: UsernameAnalysisRequest = {
      username: username.trim(),
      full_name: fullName.trim() || undefined,
      birth_year: birthYear.trim() ? parseInt(birthYear.trim(), 10) : undefined,
    };

    onSubmit(payload);
  };

  const applyPreset = (presetUser: string, presetName: string, presetYear: string) => {
    setUsername(presetUser);
    setFullName(presetName);
    setBirthYear(presetYear);
    setError(null);
  };

  return (
    <Card variant="cyber" className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Fingerprint className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-xl font-sans">Username Security Scanner</CardTitle>
            <CardDescription>
              Evaluate how much personal data your handle exposes to correlation and OSINT.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-4">
        {/* Quick Test Presets */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Quick Test Presets
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => applyPreset("nexus_sentinel_x", "Alice Smith", "1994")}
              className="text-xs font-mono px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-500/5 text-emerald-300 transition-colors"
            >
              ✓ Clean Pseudonym
            </button>
            <button
              type="button"
              onClick={() => applyPreset("alice_smith_1994", "Alice Smith", "1994")}
              className="text-xs font-mono px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-rose-500/50 hover:bg-rose-500/5 text-rose-300 transition-colors"
            >
              ⚠ Name + Birth Year Leak
            </button>
            <button
              type="button"
              onClick={() => applyPreset("player12345", "", "")}
              className="text-xs font-mono px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-amber-500/5 text-amber-300 transition-colors"
            >
              ⚠ Sequential Pattern
            </button>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300">
              Target Username <span className="text-cyan-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Fingerprint className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="e.g. shadow_ghost_99"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono text-sm transition-all"
                disabled={isLoading}
              />
            </div>
            {error && (
              <p className="text-xs text-rose-400 font-mono">{error}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Legal / Real Name (Optional) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300">
                Your Real Name <span className="text-slate-500">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alice Smith"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono text-sm transition-all"
                  disabled={isLoading}
                />
              </div>
              <p className="text-[11px] text-slate-500">Checks for name leaks inside the username.</p>
            </div>

            {/* Birth Year (Optional) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300">
                Birth Year <span className="text-slate-500">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  min={1900}
                  max={2100}
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                  placeholder="e.g. 1994"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono text-sm transition-all"
                  disabled={isLoading}
                />
              </div>
              <p className="text-[11px] text-slate-500">Checks for DOB hints and year patterns.</p>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              size="lg"
              className="w-full font-mono text-sm"
              isLoading={isLoading}
              leftIcon={<Zap className="w-4 h-4" />}
            >
              Analyze Username Security
            </Button>
          </div>
        </form>

        <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-500 font-mono">
          <ShieldCheck className="w-4 h-4 text-cyan-500 flex-shrink-0" />
          <span>Transient processing: Your inputs are never saved or transmitted to third parties.</span>
        </div>
      </CardContent>
    </Card>
  );
};
