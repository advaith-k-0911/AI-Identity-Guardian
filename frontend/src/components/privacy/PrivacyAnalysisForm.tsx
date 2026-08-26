import React, { useState } from "react";
import { EyeOff, ShieldCheck, Lock, Zap, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { PrivacyFieldInput, Sensitivity } from "../../types";

export interface PrivacyAnalysisFormProps {
  onSubmit: (fields: PrivacyFieldInput[]) => void;
  isLoading: boolean;
}

interface FieldMeta {
  key: string;
  label: string;
  description: string;
  defaultSensitivity: Sensitivity;
}

const FIELD_METAS: FieldMeta[] = [
  { key: "phone_number", label: "Phone Number", description: "High-value target for SIM swapping and phishing.", defaultSensitivity: "CRITICAL" },
  { key: "date_of_birth", label: "Date of Birth", description: "Exploited for identity verification bypass.", defaultSensitivity: "HIGH" },
  { key: "email", label: "Email Address", description: "Primary key for credential stuffing attacks.", defaultSensitivity: "HIGH" },
  { key: "full_name", label: "Full Legal Name", description: "Facilitates social engineering and background searches.", defaultSensitivity: "MEDIUM" },
  { key: "country", label: "Country / Location", description: "Geographic identifier; lower sensitivity alone.", defaultSensitivity: "LOW" },
  { key: "interests", label: "Interests & Bio", description: "Lifestyle details used for spear-phishing.", defaultSensitivity: "LOW" },
];

export const PrivacyAnalysisForm: React.FC<PrivacyAnalysisFormProps> = ({ onSubmit, isLoading }) => {
  const [fields, setFields] = useState<PrivacyFieldInput[]>([
    { field_name: "phone_number", is_provided: true, is_public: false, is_necessary: false, sensitivity: "CRITICAL" },
    { field_name: "date_of_birth", is_provided: true, is_public: true, is_necessary: false, sensitivity: "HIGH" },
    { field_name: "email", is_provided: true, is_public: false, is_necessary: true, sensitivity: "HIGH" },
    { field_name: "full_name", is_provided: true, is_public: true, is_necessary: true, sensitivity: "MEDIUM" },
    { field_name: "country", is_provided: true, is_public: true, is_necessary: false, sensitivity: "LOW" },
    { field_name: "interests", is_provided: true, is_public: true, is_necessary: false, sensitivity: "LOW" },
  ]);

  const updateField = (fieldName: string, key: keyof PrivacyFieldInput, value: boolean) => {
    setFields((prev) =>
      prev.map((f) => {
        if (f.field_name === fieldName) {
          const updated = { ...f, [key]: value };
          if (key === "is_provided" && !value) updated.is_public = false;
          return updated;
        }
        return f;
      })
    );
  };

  const applyPreset = (presetType: "minimal" | "social" | "exposed") => {
    if (presetType === "minimal") {
      setFields([
        { field_name: "phone_number", is_provided: false, is_public: false, is_necessary: false, sensitivity: "CRITICAL" },
        { field_name: "date_of_birth", is_provided: false, is_public: false, is_necessary: false, sensitivity: "HIGH" },
        { field_name: "email", is_provided: true, is_public: false, is_necessary: true, sensitivity: "HIGH" },
        { field_name: "full_name", is_provided: true, is_public: false, is_necessary: true, sensitivity: "MEDIUM" },
        { field_name: "country", is_provided: false, is_public: false, is_necessary: false, sensitivity: "LOW" },
        { field_name: "interests", is_provided: false, is_public: false, is_necessary: false, sensitivity: "LOW" },
      ]);
    } else if (presetType === "social") {
      setFields([
        { field_name: "phone_number", is_provided: true, is_public: false, is_necessary: false, sensitivity: "CRITICAL" },
        { field_name: "date_of_birth", is_provided: true, is_public: false, is_necessary: false, sensitivity: "HIGH" },
        { field_name: "email", is_provided: true, is_public: false, is_necessary: true, sensitivity: "HIGH" },
        { field_name: "full_name", is_provided: true, is_public: true, is_necessary: true, sensitivity: "MEDIUM" },
        { field_name: "country", is_provided: true, is_public: true, is_necessary: false, sensitivity: "LOW" },
        { field_name: "interests", is_provided: true, is_public: true, is_necessary: false, sensitivity: "LOW" },
      ]);
    } else {
      setFields([
        { field_name: "phone_number", is_provided: true, is_public: true, is_necessary: false, sensitivity: "CRITICAL" },
        { field_name: "date_of_birth", is_provided: true, is_public: true, is_necessary: false, sensitivity: "HIGH" },
        { field_name: "email", is_provided: true, is_public: true, is_necessary: false, sensitivity: "HIGH" },
        { field_name: "full_name", is_provided: true, is_public: true, is_necessary: false, sensitivity: "MEDIUM" },
        { field_name: "country", is_provided: true, is_public: true, is_necessary: false, sensitivity: "LOW" },
        { field_name: "interests", is_provided: true, is_public: true, is_necessary: false, sensitivity: "LOW" },
      ]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(fields);
  };

  return (
    <Card variant="cyber" className="max-w-4xl mx-auto space-y-6">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400">
            <EyeOff className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-xl font-sans">Privacy Exposure Evaluator</CardTitle>
            <CardDescription>Configure profile attributes to assess your exposure.</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Presets */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-zinc-500">Quick Presets</label>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => applyPreset("minimal")} className="text-xs font-mono px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-green-500/50 hover:bg-green-500/5 text-green-600 dark:text-green-300 transition-colors">
              Minimalist (Private)
            </button>
            <button type="button" onClick={() => applyPreset("social")} className="text-xs font-mono px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-green-500/50 hover:bg-green-500/5 text-green-500 dark:text-green-300 transition-colors">
              Typical Social Profile
            </button>
            <button type="button" onClick={() => applyPreset("exposed")} className="text-xs font-mono px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-red-500/50 hover:bg-red-500/5 text-red-500 dark:text-red-300 transition-colors">
              Over-Exposed Profile
            </button>
          </div>
        </div>

        {/* Column Info */}
        <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-zinc-500">
          <div className="space-y-1">
            <span className="text-zinc-700 dark:text-zinc-300 font-semibold flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-green-500" /> Provided?
            </span>
            <p className="text-[11px] text-zinc-400">Do you supply this to the platform?</p>
          </div>
          <div className="space-y-1">
            <span className="text-zinc-700 dark:text-zinc-300 font-semibold flex items-center gap-1.5">
              <EyeOff className="w-3.5 h-3.5 text-zinc-400" /> Publicly Visible?
            </span>
            <p className="text-[11px] text-zinc-400">Can untrusted visitors view it?</p>
          </div>
          <div className="space-y-1">
            <span className="text-zinc-700 dark:text-zinc-300 font-semibold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-green-500" /> Strictly Necessary?
            </span>
            <p className="text-[11px] text-zinc-400">Essential for core service?</p>
          </div>
        </div>

        {/* Field Matrix */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            {FIELD_METAS.map((meta) => {
              const current = fields.find((f) => f.field_name === meta.key) || {
                field_name: meta.key, is_provided: false, is_public: false, is_necessary: false, sensitivity: meta.defaultSensitivity,
              };
              return (
                <div key={meta.key} className={`p-4 rounded-xl border transition-all ${
                  current.is_provided && current.is_public
                    ? "bg-red-500/5 border-red-500/30"
                    : current.is_provided
                    ? "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                    : "bg-zinc-50 dark:bg-zinc-900/40 border-zinc-200/50 dark:border-zinc-800/40 opacity-70"
                }`}>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-semibold text-black dark:text-white font-sans">{meta.label}</span>
                        <Badge severity={meta.defaultSensitivity} size="sm">{meta.defaultSensitivity}</Badge>
                      </div>
                      <p className="text-xs text-zinc-500 leading-relaxed">{meta.description}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-mono">
                      <label className="flex items-center gap-2 cursor-pointer bg-zinc-50 dark:bg-zinc-900 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 select-none">
                        <input type="checkbox" checked={current.is_provided} onChange={(e) => updateField(meta.key, "is_provided", e.target.checked)}
                          className="w-4 h-4 rounded border-zinc-300 text-green-500 focus:ring-green-500" disabled={isLoading} />
                        <span className={current.is_provided ? "text-zinc-700 dark:text-zinc-200 font-semibold" : "text-zinc-400"}>Provided</span>
                      </label>

                      <label className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border select-none transition-all ${
                        !current.is_provided
                          ? "opacity-30 cursor-not-allowed bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                          : current.is_public
                          ? "cursor-pointer bg-red-500/10 border-red-500/40 text-red-500 font-semibold"
                          : "cursor-pointer bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500"
                      }`}>
                        <input type="checkbox" checked={current.is_public} disabled={!current.is_provided || isLoading}
                          onChange={(e) => updateField(meta.key, "is_public", e.target.checked)}
                          className="w-4 h-4 rounded border-zinc-300 text-red-500 focus:ring-red-500" />
                        <span>Public</span>
                      </label>

                      <label className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border select-none transition-all ${
                        !current.is_provided
                          ? "opacity-30 cursor-not-allowed bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                          : current.is_necessary
                          ? "cursor-pointer bg-green-500/10 border-green-500/40 text-green-600 dark:text-green-300 font-semibold"
                          : "cursor-pointer bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500"
                      }`}>
                        <input type="checkbox" checked={current.is_necessary} disabled={!current.is_provided || isLoading}
                          onChange={(e) => updateField(meta.key, "is_necessary", e.target.checked)}
                          className="w-4 h-4 rounded border-zinc-300 text-green-500 focus:ring-green-500" />
                        <span>Necessary</span>
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4">
            <Button type="submit" size="lg" className="w-full font-mono text-sm" isLoading={isLoading} leftIcon={<Zap className="w-4 h-4" />}>
              Analyze Privacy Exposure
            </Button>
          </div>
        </form>

        <div className="pt-2 flex items-center gap-2 text-xs text-zinc-500">
          <ShieldCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
          <span>Zero Persistent Storage: Analysis runs transiently.</span>
        </div>
      </CardContent>
    </Card>
  );
};
