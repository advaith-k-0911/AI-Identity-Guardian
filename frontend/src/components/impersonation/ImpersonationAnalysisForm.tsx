import React, { useState } from "react";
import { UserCheck, User, Briefcase, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { ImpersonationAnalysisRequest } from "../../types";

export interface ImpersonationAnalysisFormProps {
  onSubmit: (data: ImpersonationAnalysisRequest) => void;
  isLoading: boolean;
}

export const ImpersonationAnalysisForm: React.FC<ImpersonationAnalysisFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Please enter a username handle to evaluate.");
      return;
    }
    setError(null);

    const payload: ImpersonationAnalysisRequest = {
      username: username.trim(),
      display_name: displayName.trim() || undefined,
      role_or_title: roleTitle.trim() || undefined,
    };

    onSubmit(payload);
  };

  const applyPreset = (presetUser: string, presetName: string, presetRole: string) => {
    setUsername(presetUser);
    setDisplayName(presetName);
    setRoleTitle(presetRole);
    setError(null);
  };

  return (
    <Card variant="cyber" className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-xl font-sans">Impersonation & Spoofing Scanner</CardTitle>
            <CardDescription>
              Evaluate how easily adversaries can clone your profile, construct homoglyphs, or register lookalike handles.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-4">
        {/* Quick Test Presets */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Quick Test Presets
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => applyPreset("alex_mercer_ceo", "Alex Mercer", "Chief Executive Officer (CEO)")}
              className="text-xs font-mono px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-rose-500/50 hover:bg-rose-500/5 text-rose-300 transition-colors"
            >
              ⚠ High-Authority Executive
            </button>
            <button
              type="button"
              onClick={() => applyPreset("alicesmith", "Alice Smith", "Security Lead")}
              className="text-xs font-mono px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-amber-500/5 text-amber-300 transition-colors"
            >
              ⚠ Canonical Legal Handle
            </button>
            <button
              type="button"
              onClick={() => applyPreset("quantum_sentinel_k9", "Anonymous Agent", "Researcher")}
              className="text-xs font-mono px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-500/5 text-emerald-300 transition-colors"
            >
              ✓ Resilient Pseudonym
            </button>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Target Handle */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300">
              Target Username Handle <span className="text-amber-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <UserCheck className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="e.g. satya_nadella or alex_lead"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono text-sm transition-all"
                disabled={isLoading}
              />
            </div>
            {error && <p className="text-xs text-rose-400 font-mono">{error}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Display / Legal Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300">
                Display / Legal Name <span className="text-slate-500">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Alex Mercer"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono text-sm transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Role or Organization Title */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300">
                Role / Title <span className="text-slate-500">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Briefcase className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="e.g. CEO, Admin, Security Lead"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono text-sm transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              size="lg"
              className="w-full font-mono text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-[0_0_20px_-3px_rgba(245,158,11,0.3)]"
              isLoading={isLoading}
              leftIcon={<Zap className="w-4 h-4" />}
            >
              Analyze Impersonation Risk
            </Button>
          </div>
        </form>

        <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-500 font-mono">
          <ShieldCheck className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <span>Defensive Evaluation: Analyzes only user-submitted inputs without third-party scraping.</span>
        </div>
      </CardContent>
    </Card>
  );
};
