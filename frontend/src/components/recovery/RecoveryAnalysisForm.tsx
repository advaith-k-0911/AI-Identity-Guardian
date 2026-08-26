import React, { useState } from "react";
import { LifeBuoy, Lock, Zap } from "lucide-react";
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

export const RecoveryAnalysisForm: React.FC<RecoveryAnalysisFormProps> = ({ onSubmit, isLoading }) => {
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

  const applyPreset = (email: RecoveryEmailStatus, phone: RecoveryPhoneStatus, backup: BackupCodesStatus, questions: SecurityQuestionUsage, pub: boolean) => {
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
          <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400">
            <LifeBuoy className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-xl font-sans">Account Recovery Scanner</CardTitle>
            <CardDescription>Evaluate fallback vulnerability and backup preparedness.</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-4">
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-start gap-3">
          <Lock className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <h5 className="font-semibold text-green-600 dark:text-green-300 font-sans">ZERO-KNOWLEDGE GUARANTEE</h5>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Never submit actual backup codes, phone numbers, or security answers. We evaluate channel architecture only.
            </p>
          </div>
        </div>

        {/* Presets */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-zinc-500">Evaluation Presets</label>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => applyPreset("DEDICATED_ISOLATED_2FA", "NO_SMS_FALLBACK", "STORED_ENCRYPTED_VAULT", "NEVER_USED_DISABLED", false)}
              className="text-xs font-mono px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-green-500/50 hover:bg-green-500/5 text-green-600 dark:text-green-300 transition-colors">
              Fortified Recovery (100 pts)
            </button>
            <button type="button" onClick={() => applyPreset("STANDARD_PERSONAL", "STANDARD_CELLULAR", "STORED_PLAINTEXT", "PSEUDORANDOM_PASSWORDS", false)}
              className="text-xs font-mono px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-amber-500/50 hover:bg-amber-500/5 text-amber-500 dark:text-amber-300 transition-colors">
              Standard Setup (60 pts)
            </button>
            <button type="button" onClick={() => applyPreset("UNPROTECTED_WORK", "STANDARD_CELLULAR", "NOT_GENERATED_OR_LOST", "BIOGRAPHICAL_ANSWERS", true)}
              className="text-xs font-mono px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-red-500/50 hover:bg-red-500/5 text-red-500 dark:text-red-300 transition-colors">
              Vulnerable Fallback (10 pts)
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Security Questions */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              1. Security Questions <span className="text-green-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
              {[
                { id: "NEVER_USED_DISABLED", label: "Disabled", desc: "Questions removed or never used" },
                { id: "PSEUDORANDOM_PASSWORDS", label: "Random Passwords", desc: "Stored in password manager" },
                { id: "BIOGRAPHICAL_ANSWERS", label: "Real Answers", desc: "Pets, maiden name, school" },
              ].map((opt) => (
                <label key={opt.id} className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                  securityQuestions === opt.id
                    ? "bg-green-500/10 border-green-500 text-green-700 dark:text-green-200"
                    : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}>
                  <div className="flex items-center gap-2 font-semibold font-sans text-black dark:text-white">
                    <input type="radio" name="securityQuestions" value={opt.id} checked={securityQuestions === opt.id}
                      onChange={() => setSecurityQuestions(opt.id as SecurityQuestionUsage)} className="text-green-500 focus:ring-green-500" />
                    <span>{opt.label}</span>
                  </div>
                  <span className="text-[11px] text-zinc-400 mt-1 pl-5">{opt.desc}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Backup Codes */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              2. Backup Codes <span className="text-green-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              {[
                { id: "STORED_ENCRYPTED_VAULT", label: "Encrypted Vault", desc: "Inside 1Password/Bitwarden" },
                { id: "PRINTED_PHYSICAL_SAFE", label: "Printed in Safe", desc: "Paper copy in secure location" },
                { id: "STORED_PLAINTEXT", label: "Plaintext File", desc: "Unencrypted .txt or screenshot" },
                { id: "NOT_GENERATED_OR_LOST", label: "Missing / Lost", desc: "No emergency codes ready" },
              ].map((opt) => (
                <label key={opt.id} className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                  backupCodes === opt.id
                    ? "bg-green-500/10 border-green-500 text-green-700 dark:text-green-200"
                    : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}>
                  <div className="flex items-center gap-2 font-semibold font-sans text-black dark:text-white">
                    <input type="radio" name="backupCodes" value={opt.id} checked={backupCodes === opt.id}
                      onChange={() => setBackupCodes(opt.id as BackupCodesStatus)} className="text-green-500 focus:ring-green-500" />
                    <span>{opt.label}</span>
                  </div>
                  <span className="text-[11px] text-zinc-400 mt-1 pl-5">{opt.desc}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Recovery Email */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              3. Recovery Email <span className="text-green-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              {[
                { id: "DEDICATED_ISOLATED_2FA", label: "Dedicated + 2FA", desc: "Strictly for recovery" },
                { id: "STANDARD_PERSONAL", label: "Personal Email", desc: "Daily use email" },
                { id: "UNPROTECTED_WORK", label: "Work Email", desc: "Subject to IT monitoring" },
                { id: "NONE", label: "No Email Set", desc: "No recovery email" },
              ].map((opt) => (
                <label key={opt.id} className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                  recoveryEmail === opt.id
                    ? "bg-green-500/10 border-green-500 text-green-700 dark:text-green-200"
                    : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}>
                  <div className="flex items-center gap-2 font-semibold font-sans text-black dark:text-white">
                    <input type="radio" name="recoveryEmail" value={opt.id} checked={recoveryEmail === opt.id}
                      onChange={() => setRecoveryEmail(opt.id as RecoveryEmailStatus)} className="text-green-500 focus:ring-green-500" />
                    <span>{opt.label}</span>
                  </div>
                  <span className="text-[11px] text-zinc-400 mt-1 pl-5">{opt.desc}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Recovery Phone */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              4. Recovery Phone <span className="text-green-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              {[
                { id: "NO_SMS_FALLBACK", label: "SMS Disabled", desc: "Safest option" },
                { id: "SIM_LOCKED_CELLULAR", label: "SIM PIN / Carrier Lock", desc: "Protected against swaps" },
                { id: "STANDARD_CELLULAR", label: "Standard Cell", desc: "Vulnerable to port-outs" },
                { id: "NONE", label: "No Phone", desc: "No phone number" },
              ].map((opt) => (
                <label key={opt.id} className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                  recoveryPhone === opt.id
                    ? "bg-green-500/10 border-green-500 text-green-700 dark:text-green-200"
                    : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}>
                  <div className="flex items-center gap-2 font-semibold font-sans text-black dark:text-white">
                    <input type="radio" name="recoveryPhone" value={opt.id} checked={recoveryPhone === opt.id}
                      onChange={() => setRecoveryPhone(opt.id as RecoveryPhoneStatus)} className="text-green-500 focus:ring-green-500" />
                    <span>{opt.label}</span>
                  </div>
                  <span className="text-[11px] text-zinc-400 mt-1 pl-5">{opt.desc}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Public Exposure Toggle */}
          <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 font-sans">
                Are recovery contacts publicly listed?
              </span>
              <p className="text-[11px] text-zinc-400">On LinkedIn, GitHub, resumes, or company websites.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className="sr-only peer" />
              <div className="w-9 h-5 bg-zinc-300 dark:bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>

          <div className="pt-2">
            <Button type="submit" size="lg" className="w-full font-mono text-sm" isLoading={isLoading} leftIcon={<Zap className="w-4 h-4" />}>
              Analyze Recovery Security
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
