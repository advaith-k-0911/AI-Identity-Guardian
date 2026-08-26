import React, { useState } from "react";
import { KeyRound, Lock, Sparkles, Zap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import {
  MfaMethod,
  PasswordManagerUsage,
  PasswordReuseScope,
  PasswordAgeBracket,
  CredentialAnalysisRequest,
} from "../../types";

export interface CredentialAnalysisFormProps {
  onSubmit: (data: CredentialAnalysisRequest) => void;
  isLoading: boolean;
}

export const CredentialAnalysisForm: React.FC<CredentialAnalysisFormProps> = ({ onSubmit, isLoading }) => {
  const [mfaMethod, setMfaMethod] = useState<MfaMethod>("AUTHENTICATOR_APP");
  const [passwordManager, setPasswordManager] = useState<PasswordManagerUsage>("DEDICATED_MANAGER");
  const [reuseScope, setReuseScope] = useState<PasswordReuseScope>("UNIQUE_ALL");
  const [passwordAge, setPasswordAge] = useState<PasswordAgeBracket>("UNDER_6_MONTHS");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ mfa_method: mfaMethod, password_manager: passwordManager, reuse_scope: reuseScope, password_age: passwordAge });
  };

  const applyPreset = (mfa: MfaMethod, pm: PasswordManagerUsage, reuse: PasswordReuseScope, age: PasswordAgeBracket) => {
    setMfaMethod(mfa);
    setPasswordManager(pm);
    setReuseScope(reuse);
    setPasswordAge(age);
  };

  return (
    <Card variant="cyber" className="max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-xl font-sans">Credential Security Audit</CardTitle>
            <CardDescription>Evaluate password management, 2FA strength, and reuse vulnerability.</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-4">
        {/* Privacy Banner */}
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-start gap-3">
          <Lock className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <h5 className="font-semibold text-green-600 dark:text-green-300 font-sans">ZERO-KNOWLEDGE POLICY</h5>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              We never request or store real passwords. This audit evaluates your security practices only.
            </p>
          </div>
        </div>

        {/* Presets */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-green-500" /> Evaluation Presets
          </label>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => applyPreset("HARDWARE_KEY", "DEDICATED_MANAGER", "UNIQUE_ALL", "UNDER_6_MONTHS")}
              className="text-xs font-mono px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-green-500/50 hover:bg-green-500/5 text-green-600 dark:text-green-300 transition-colors">
              Security Champion (100 pts)
            </button>
            <button type="button" onClick={() => applyPreset("SMS_EMAIL_OTP", "BROWSER_MANAGER", "SHARED_NONCRITICAL", "6_TO_12_MONTHS")}
              className="text-xs font-mono px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-amber-500/50 hover:bg-amber-500/5 text-amber-500 dark:text-amber-300 transition-colors">
              Moderate User (65 pts)
            </button>
            <button type="button" onClick={() => applyPreset("NONE", "MEMORY_ONLY", "SHARED_CRITICAL_ACCOUNTS", "OVER_1_YEAR")}
              className="text-xs font-mono px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-red-500/50 hover:bg-red-500/5 text-red-500 dark:text-red-300 transition-colors">
              High-Risk Habits (20 pts)
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* MFA */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              1. MFA / 2FA Method <span className="text-green-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              {[
                { id: "HARDWARE_KEY", label: "Hardware Key (FIDO2)", desc: "Phishing-proof security keys" },
                { id: "AUTHENTICATOR_APP", label: "Authenticator App (TOTP)", desc: "Google/MS Authenticator" },
                { id: "SMS_EMAIL_OTP", label: "SMS or Email Codes", desc: "Vulnerable to SIM swaps" },
                { id: "NONE", label: "No MFA Enabled", desc: "Password-only login" },
              ].map((opt) => (
                <label key={opt.id} className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                  mfaMethod === opt.id
                    ? "bg-green-500/10 border-green-500 text-green-700 dark:text-green-200"
                    : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}>
                  <div className="flex items-center gap-2 font-semibold font-sans text-black dark:text-white">
                    <input type="radio" name="mfaMethod" value={opt.id} checked={mfaMethod === opt.id}
                      onChange={() => setMfaMethod(opt.id as MfaMethod)} className="text-green-500 focus:ring-green-500" />
                    <span>{opt.label}</span>
                  </div>
                  <span className="text-[11px] text-zinc-400 mt-1 pl-5">{opt.desc}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Password Storage */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              2. Password Storage <span className="text-green-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              {[
                { id: "DEDICATED_MANAGER", label: "Password Manager", desc: "Bitwarden, 1Password, KeePass" },
                { id: "BROWSER_MANAGER", label: "Browser Storage", desc: "Chrome, Safari auto-fill" },
                { id: "MANUAL_DOCUMENT", label: "Spreadsheet / Notes", desc: "Plaintext file or notebook" },
                { id: "MEMORY_ONLY", label: "Memory Only", desc: "No digital vault" },
              ].map((opt) => (
                <label key={opt.id} className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                  passwordManager === opt.id
                    ? "bg-green-500/10 border-green-500 text-green-700 dark:text-green-200"
                    : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}>
                  <div className="flex items-center gap-2 font-semibold font-sans text-black dark:text-white">
                    <input type="radio" name="passwordManager" value={opt.id} checked={passwordManager === opt.id}
                      onChange={() => setPasswordManager(opt.id as PasswordManagerUsage)} className="text-green-500 focus:ring-green-500" />
                    <span>{opt.label}</span>
                  </div>
                  <span className="text-[11px] text-zinc-400 mt-1 pl-5">{opt.desc}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Password Reuse */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              3. Password Reuse <span className="text-green-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
              {[
                { id: "UNIQUE_ALL", label: "100% Unique", desc: "Every account has a distinct password" },
                { id: "SHARED_NONCRITICAL", label: "Shared on Low-Risk", desc: "Forums share credentials" },
                { id: "SHARED_CRITICAL_ACCOUNTS", label: "Shared on Banking", desc: "Same password on financial sites" },
              ].map((opt) => (
                <label key={opt.id} className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                  reuseScope === opt.id
                    ? "bg-green-500/10 border-green-500 text-green-700 dark:text-green-200"
                    : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}>
                  <div className="flex items-center gap-2 font-semibold font-sans text-black dark:text-white">
                    <input type="radio" name="reuseScope" value={opt.id} checked={reuseScope === opt.id}
                      onChange={() => setReuseScope(opt.id as PasswordReuseScope)} className="text-green-500 focus:ring-green-500" />
                    <span>{opt.label}</span>
                  </div>
                  <span className="text-[11px] text-zinc-400 mt-1 pl-5">{opt.desc}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Password Age */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              4. Password Age <span className="text-green-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              {[
                { id: "UNDER_6_MONTHS", label: "< 6 Months", desc: "Fresh" },
                { id: "6_TO_12_MONTHS", label: "6-12 Months", desc: "Recent" },
                { id: "OVER_1_YEAR", label: "> 1 Year", desc: "Aging" },
                { id: "UNKNOWN_OLD", label: "Unknown", desc: "Legacy" },
              ].map((opt) => (
                <label key={opt.id} className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                  passwordAge === opt.id
                    ? "bg-green-500/10 border-green-500 text-green-700 dark:text-green-200"
                    : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}>
                  <div className="flex items-center gap-2 font-semibold font-sans text-black dark:text-white">
                    <input type="radio" name="passwordAge" value={opt.id} checked={passwordAge === opt.id}
                      onChange={() => setPasswordAge(opt.id as PasswordAgeBracket)} className="text-green-500 focus:ring-green-500" />
                    <span>{opt.label}</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 mt-1 pl-5">{opt.desc}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" size="lg" className="w-full font-mono text-sm" isLoading={isLoading} leftIcon={<Zap className="w-4 h-4" />}>
              Analyze Credentials
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
