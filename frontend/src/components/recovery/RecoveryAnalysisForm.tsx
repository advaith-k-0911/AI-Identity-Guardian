import React, { useState } from "react";
import { LifeBuoy, Lock, Sparkles, Zap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import {
  RecoveryEmailStatus,
  RecoveryPhoneStatus,
  BackupCodesStatus,
  SecurityQuestionUsage,
  RecoveryAnalysisRequest,
} from "../../types";

export interface RecoveryAnalysisFormProps {
  onSubmit: (data: RecoveryAnalysisRequest) => void;
  isLoading: boolean;
}

export const RecoveryAnalysisForm: React.FC<RecoveryAnalysisFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [recoveryEmail, setRecoveryEmail] = useState<RecoveryEmailStatus>("DEDICATED_ISOLATED_2FA");
  const [recoveryPhone, setRecoveryPhone] = useState<RecoveryPhoneStatus>("NO_SMS_FALLBACK");
  const [backupCodes, setBackupCodes] = useState<BackupCodesStatus>("STORED_ENCRYPTED_VAULT");
  const [securityQuestions, setSecurityQuestions] = useState<SecurityQuestionUsage>("NEVER_USED_DISABLED");
  const [isPublic, setIsPublic] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      recovery_email_status: recoveryEmail,
      recovery_phone_status: recoveryPhone,
      backup_codes_status: backupCodes,
      security_question_usage: securityQuestions,
      is_recovery_contact_public: isPublic,
    });
  };

  const applyPreset = (
    email: RecoveryEmailStatus,
    phone: RecoveryPhoneStatus,
    backup: BackupCodesStatus,
    questions: SecurityQuestionUsage,
    pub: boolean
  ) => {
    setRecoveryEmail(email);
    setRecoveryPhone(phone);
    setBackupCodes(backup);
    setSecurityQuestions(questions);
    setIsPublic(pub);
  };

  return (
    <Card variant="cyber" className="max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <LifeBuoy className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-xl font-sans">Account Recovery & Fallback Scanner</CardTitle>
            <CardDescription>
              Evaluate fallback vulnerability, OSINT security questions, and offline backup preparedness without sharing secret answers.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-4">
        {/* Zero-Knowledge Privacy Guarantee Banner */}
        <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-start gap-3">
          <Lock className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <h5 className="font-semibold text-cyan-300 font-sans">ZERO-KNOWLEDGE RECOVERY GUARANTEE</h5>
            <p className="text-slate-300 leading-relaxed font-mono">
              Never submit actual backup codes, recovery phone numbers, or security question answers. We evaluate your channel configuration architecture only.
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
              onClick={() => applyPreset("DEDICATED_ISOLATED_2FA", "NO_SMS_FALLBACK", "STORED_ENCRYPTED_VAULT", "NEVER_USED_DISABLED", false)}
              className="text-xs font-mono px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-500/5 text-emerald-300 transition-colors"
            >
              ✓ Fortified Disaster Recovery (100 pts)
            </button>
            <button
              type="button"
              onClick={() => applyPreset("STANDARD_PERSONAL", "STANDARD_CELLULAR", "STORED_PLAINTEXT", "PSEUDORANDOM_PASSWORDS", false)}
              className="text-xs font-mono px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-amber-500/5 text-amber-300 transition-colors"
            >
              ⚠ Standard Personal Setup (60 pts)
            </button>
            <button
              type="button"
              onClick={() => applyPreset("UNPROTECTED_WORK", "STANDARD_CELLULAR", "NOT_GENERATED_OR_LOST", "BIOGRAPHICAL_ANSWERS", true)}
              className="text-xs font-mono px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-rose-500/50 hover:bg-rose-500/5 text-rose-300 transition-colors"
            >
              ⛔ Vulnerable OSINT Fallback (10 pts)
            </button>
          </div>
        </div>

        {/* Questions Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Question 1: Security Questions */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300">
              1. Knowledge-Based Security Questions Practice <span className="text-cyan-400">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
              {[
                { id: "NEVER_USED_DISABLED", label: "Disabled / Never Used", desc: "Refuse or remove security questions" },
                { id: "PSEUDORANDOM_PASSWORDS", label: "Random Passwords as Answers", desc: "Stored in password manager" },
                { id: "BIOGRAPHICAL_ANSWERS", label: "Real Biographical Answers", desc: "Pets, mother's maiden name, school" },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                    securityQuestions === opt.id
                      ? "bg-cyan-500/10 border-cyan-500 text-cyan-200 shadow-glow-cyan"
                      : "bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold font-sans text-slate-100">
                    <input
                      type="radio"
                      name="securityQuestions"
                      value={opt.id}
                      checked={securityQuestions === opt.id}
                      onChange={() => setSecurityQuestions(opt.id as SecurityQuestionUsage)}
                      className="text-cyan-500 focus:ring-cyan-500"
                    />
                    <span>{opt.label}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 pl-5">{opt.desc}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Question 2: Backup Codes */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300">
              2. Offline Emergency 2FA Backup Codes <span className="text-cyan-400">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              {[
                { id: "STORED_ENCRYPTED_VAULT", label: "Stored in Encrypted Vault", desc: "Saved inside 1Password/Bitwarden vault" },
                { id: "PRINTED_PHYSICAL_SAFE", label: "Printed in Physical Safe", desc: "Paper copy in secure home location" },
                { id: "STORED_PLAINTEXT", label: "Plaintext File / Desktop Note", desc: "Saved as unencrypted .txt / screenshot" },
                { id: "NOT_GENERATED_OR_LOST", label: "Missing / Never Generated", desc: "No offline emergency codes ready" },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                    backupCodes === opt.id
                      ? "bg-cyan-500/10 border-cyan-500 text-cyan-200 shadow-glow-cyan"
                      : "bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold font-sans text-slate-100">
                    <input
                      type="radio"
                      name="backupCodes"
                      value={opt.id}
                      checked={backupCodes === opt.id}
                      onChange={() => setBackupCodes(opt.id as BackupCodesStatus)}
                      className="text-cyan-500 focus:ring-cyan-500"
                    />
                    <span>{opt.label}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 pl-5">{opt.desc}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Question 3: Recovery Email */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300">
              3. Recovery Email Channel <span className="text-cyan-400">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              {[
                { id: "DEDICATED_ISOLATED_2FA", label: "Dedicated Isolated Email (with 2FA)", desc: "Strictly for recovery with hardware/app MFA" },
                { id: "STANDARD_PERSONAL", label: "Standard Personal Email", desc: "Common daily email account" },
                { id: "UNPROTECTED_WORK", label: "Work / Corporate Email", desc: "Subject to IT monitoring or job loss" },
                { id: "NONE", label: "No Recovery Email Set", desc: "No secondary email channel configured" },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                    recoveryEmail === opt.id
                      ? "bg-cyan-500/10 border-cyan-500 text-cyan-200 shadow-glow-cyan"
                      : "bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold font-sans text-slate-100">
                    <input
                      type="radio"
                      name="recoveryEmail"
                      value={opt.id}
                      checked={recoveryEmail === opt.id}
                      onChange={() => setRecoveryEmail(opt.id as RecoveryEmailStatus)}
                      className="text-cyan-500 focus:ring-cyan-500"
                    />
                    <span>{opt.label}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 pl-5">{opt.desc}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Question 4: Recovery Phone */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300">
              4. Recovery Phone & SMS Reset Fallback <span className="text-cyan-400">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              {[
                { id: "NO_SMS_FALLBACK", label: "SMS Fallback Disabled (Safest)", desc: "SMS cannot be used to reset passwords" },
                { id: "SIM_LOCKED_CELLULAR", label: "Cellular with SIM PIN / Carrier Lock", desc: "Protected against carrier SIM-swaps" },
                { id: "STANDARD_CELLULAR", label: "Standard Cellular (No SIM PIN)", desc: "Vulnerable to unauthorized port-outs" },
                { id: "NONE", label: "No Phone Configured", desc: "No phone number attached to account" },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                    recoveryPhone === opt.id
                      ? "bg-cyan-500/10 border-cyan-500 text-cyan-200 shadow-glow-cyan"
                      : "bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold font-sans text-slate-100">
                    <input
                      type="radio"
                      name="recoveryPhone"
                      value={opt.id}
                      checked={recoveryPhone === opt.id}
                      onChange={() => setRecoveryPhone(opt.id as RecoveryPhoneStatus)}
                      className="text-cyan-500 focus:ring-cyan-500"
                    />
                    <span>{opt.label}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 pl-5">{opt.desc}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Question 5: Public Exposure Checkbox */}
          <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-200 font-sans">
                Are any recovery emails or phone numbers publicly listed?
              </span>
              <p className="text-[11px] text-slate-500 font-mono">
                Listed on LinkedIn, resumes, GitHub bios, social media, or company websites.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500"></div>
            </label>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              size="lg"
              className="w-full font-mono text-sm"
              isLoading={isLoading}
              leftIcon={<Zap className="w-4 h-4" />}
            >
              Analyze Account Recovery Security
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
