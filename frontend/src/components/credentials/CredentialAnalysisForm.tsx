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

export const CredentialAnalysisForm: React.FC<CredentialAnalysisFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [mfaMethod, setMfaMethod] = useState<MfaMethod>("AUTHENTICATOR_APP");
  const [passwordManager, setPasswordManager] = useState<PasswordManagerUsage>("DEDICATED_MANAGER");
  const [reuseScope, setReuseScope] = useState<PasswordReuseScope>("UNIQUE_ALL");
  const [passwordAge, setPasswordAge] = useState<PasswordAgeBracket>("UNDER_6_MONTHS");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      mfa_method: mfaMethod,
      password_manager: passwordManager,
      reuse_scope: reuseScope,
      password_age: passwordAge,
    });
  };

  const applyPreset = (
    mfa: MfaMethod,
    pm: PasswordManagerUsage,
    reuse: PasswordReuseScope,
    age: PasswordAgeBracket
  ) => {
    setMfaMethod(mfa);
    setPasswordManager(pm);
    setReuseScope(reuse);
    setPasswordAge(age);
  };

  return (
    <Card variant="cyber" className="max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-xl font-sans">Credential Security & Authentication Hygiene</CardTitle>
            <CardDescription>
              Evaluate your password management, 2FA strength, and credential-stuffing vulnerability without sharing real passwords.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-4">
        {/* Zero-Knowledge Privacy Guarantee Banner */}
        <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-start gap-3">
          <Lock className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <h5 className="font-semibold text-cyan-300 font-sans">ZERO-KNOWLEDGE PRIVACY POLICY</h5>
            <p className="text-slate-300 leading-relaxed font-mono">
              We never request, collect, or store real passwords. This audit strictly evaluates your architectural security practices and multi-factor authentication hygiene.
            </p>
          </div>
        </div>

        {/* Quick Test Presets */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Evaluation Presets
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => applyPreset("HARDWARE_KEY", "DEDICATED_MANAGER", "UNIQUE_ALL", "UNDER_6_MONTHS")}
              className="text-xs font-mono px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-500/5 text-emerald-300 transition-colors"
            >
              ✓ Zero-Trust Security Champion (100 pts)
            </button>
            <button
              type="button"
              onClick={() => applyPreset("SMS_EMAIL_OTP", "BROWSER_MANAGER", "SHARED_NONCRITICAL", "6_TO_12_MONTHS")}
              className="text-xs font-mono px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-amber-500/5 text-amber-300 transition-colors"
            >
              ⚠ Moderate Digital Citizen (65 pts)
            </button>
            <button
              type="button"
              onClick={() => applyPreset("NONE", "MEMORY_ONLY", "SHARED_CRITICAL_ACCOUNTS", "OVER_1_YEAR")}
              className="text-xs font-mono px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-rose-500/50 hover:bg-rose-500/5 text-rose-300 transition-colors"
            >
              ⛔ High-Risk Habits (20 pts)
            </button>
          </div>
        </div>

        {/* Questions Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Question 1: MFA */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300">
              1. Multi-Factor Authentication (MFA / 2FA) Method <span className="text-cyan-400">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              {[
                { id: "HARDWARE_KEY", label: "Hardware Key (FIDO2 / YubiKey)", desc: "Phishing-proof security keys" },
                { id: "AUTHENTICATOR_APP", label: "Authenticator App (TOTP)", desc: "Google/MS Authenticator or Bitwarden" },
                { id: "SMS_EMAIL_OTP", label: "SMS or Email Codes", desc: "Vulnerable to SIM swaps & interception" },
                { id: "NONE", label: "No Multi-Factor Enabled", desc: "Password-only single-factor login" },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                    mfaMethod === opt.id
                      ? "bg-cyan-500/10 border-cyan-500 text-cyan-200 shadow-glow-cyan"
                      : "bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold font-sans text-slate-100">
                    <input
                      type="radio"
                      name="mfaMethod"
                      value={opt.id}
                      checked={mfaMethod === opt.id}
                      onChange={() => setMfaMethod(opt.id as MfaMethod)}
                      className="text-cyan-500 focus:ring-cyan-500"
                    />
                    <span>{opt.label}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 pl-5">{opt.desc}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Question 2: Password Storage */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300">
              2. Primary Password Storage & Management <span className="text-cyan-400">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              {[
                { id: "DEDICATED_MANAGER", label: "Dedicated Password Manager", desc: "Bitwarden, 1Password, KeePass" },
                { id: "BROWSER_MANAGER", label: "Browser Built-in Storage", desc: "Chrome, Safari, Firefox password auto-fill" },
                { id: "MANUAL_DOCUMENT", label: "Spreadsheet, Notes or Paper", desc: "Plaintext desktop file or physical notebook" },
                { id: "MEMORY_ONLY", label: "Human Memory Only", desc: "Relying strictly on recall without digital vaults" },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                    passwordManager === opt.id
                      ? "bg-cyan-500/10 border-cyan-500 text-cyan-200 shadow-glow-cyan"
                      : "bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold font-sans text-slate-100">
                    <input
                      type="radio"
                      name="passwordManager"
                      value={opt.id}
                      checked={passwordManager === opt.id}
                      onChange={() => setPasswordManager(opt.id as PasswordManagerUsage)}
                      className="text-cyan-500 focus:ring-cyan-500"
                    />
                    <span>{opt.label}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 pl-5">{opt.desc}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Question 3: Password Reuse */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300">
              3. Cross-Site Password Reuse Scope <span className="text-cyan-400">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
              {[
                { id: "UNIQUE_ALL", label: "100% Unique Passwords", desc: "Every single account has a distinct password" },
                { id: "SHARED_NONCRITICAL", label: "Shared on Low-Risk Sites", desc: "Forums & entertainment share credentials" },
                { id: "SHARED_CRITICAL_ACCOUNTS", label: "Shared on Banking / Email", desc: "Same passwords on primary & financial sites" },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                    reuseScope === opt.id
                      ? "bg-cyan-500/10 border-cyan-500 text-cyan-200 shadow-glow-cyan"
                      : "bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold font-sans text-slate-100">
                    <input
                      type="radio"
                      name="reuseScope"
                      value={opt.id}
                      checked={reuseScope === opt.id}
                      onChange={() => setReuseScope(opt.id as PasswordReuseScope)}
                      className="text-cyan-500 focus:ring-cyan-500"
                    />
                    <span>{opt.label}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 pl-5">{opt.desc}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Question 4: Password Age */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300">
              4. Average Password Age & Rotation <span className="text-cyan-400">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              {[
                { id: "UNDER_6_MONTHS", label: "< 6 Months", desc: "Freshly generated" },
                { id: "6_TO_12_MONTHS", label: "6–12 Months", desc: "Audited recently" },
                { id: "OVER_1_YEAR", label: "> 1 Year", desc: "Long-lived" },
                { id: "UNKNOWN_OLD", label: "Multi-Year / Unknown", desc: "Legacy passwords" },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                    passwordAge === opt.id
                      ? "bg-cyan-500/10 border-cyan-500 text-cyan-200 shadow-glow-cyan"
                      : "bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold font-sans text-slate-100">
                    <input
                      type="radio"
                      name="passwordAge"
                      value={opt.id}
                      checked={passwordAge === opt.id}
                      onChange={() => setPasswordAge(opt.id as PasswordAgeBracket)}
                      className="text-cyan-500 focus:ring-cyan-500"
                    />
                    <span>{opt.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 pl-5">{opt.desc}</span>
                </label>
              ))}
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
              Analyze Credential Security
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
