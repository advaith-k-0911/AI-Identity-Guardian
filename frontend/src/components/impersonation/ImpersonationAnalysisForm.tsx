import React, { useState } from "react";
import { UserCheck, User, Briefcase, ShieldCheck, Zap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { ImpersonationAnalysisRequest } from "../../types";

export interface ImpersonationAnalysisFormProps {
  onSubmit: (data: ImpersonationAnalysisRequest) => void;
  isLoading: boolean;
}

export const ImpersonationAnalysisForm: React.FC<ImpersonationAnalysisFormProps> = ({ onSubmit, isLoading }) => {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Please enter a username to evaluate.");
      return;
    }
    setError(null);
    onSubmit({
      username: username.trim(),
      display_name: displayName.trim() || undefined,
      role_or_title: roleTitle.trim() || undefined,
    });
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
          <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-xl font-sans">Impersonation Scanner</CardTitle>
            <CardDescription> Evaluate how easily adversaries can clone your profile.</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-4">
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-zinc-500">Quick Test Presets</label>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => applyPreset("alex_mercer_ceo", "Alex Mercer", "CEO")}
              className="text-xs font-mono px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-red-500/50 hover:bg-red-500/5 text-red-500 dark:text-red-300 transition-colors">
              High-Authority Executive
            </button>
            <button type="button" onClick={() => applyPreset("alicesmith", "Alice Smith", "Security Lead")}
              className="text-xs font-mono px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-amber-500/50 hover:bg-amber-500/5 text-amber-500 dark:text-amber-300 transition-colors">
              Canonical Legal Handle
            </button>
            <button type="button" onClick={() => applyPreset("quantum_sentinel_k9", "Anonymous Agent", "Researcher")}
              className="text-xs font-mono px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-green-500/50 hover:bg-green-500/5 text-green-600 dark:text-green-300 transition-colors">
              Resilient Pseudonym
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Target Username <span className="text-green-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                <UserCheck className="w-4 h-4" />
              </div>
              <input type="text" value={username} onChange={(e) => { setUsername(e.target.value); if (error) setError(null); }}
                placeholder="e.g. satya_nadella"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-black dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-green-500 font-mono text-sm transition-all"
                disabled={isLoading} />
            </div>
            {error && <p className="text-xs text-red-500 font-mono">{error}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Display Name <span className="text-zinc-400">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <User className="w-4 h-4" />
                </div>
                <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Alex Mercer"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-black dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-green-500 font-mono text-sm transition-all"
                  disabled={isLoading} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Role / Title <span className="text-zinc-400">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <Briefcase className="w-4 h-4" />
                </div>
                <input type="text" value={roleTitle} onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="e.g. CEO, Admin"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-black dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-green-500 font-mono text-sm transition-all"
                  disabled={isLoading} />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" size="lg" className="w-full font-mono text-sm" isLoading={isLoading} leftIcon={<Zap className="w-4 h-4" />}>
              Analyze Impersonation Risk
            </Button>
          </div>
        </form>

        <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-2 text-xs text-zinc-500">
          <ShieldCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
          <span>Defensive evaluation only. No third-party data collection.</span>
        </div>
      </CardContent>
    </Card>
  );
};
