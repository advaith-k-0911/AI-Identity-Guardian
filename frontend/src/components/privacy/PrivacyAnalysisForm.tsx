import React, { useState } from "react";
import { EyeOff, Eye, ShieldCheck, Sparkles, Lock, Zap, Check } from "lucide-react";
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
  {
    key: "phone_number",
    label: "Phone Number",
    description: "High-value target for SIM swapping, phishing, and reverse phone lookups.",
    defaultSensitivity: "CRITICAL",
  },
  {
    key: "date_of_birth",
    label: "Date of Birth",
    description: "Frequently exploited for identity verification and account recovery bypass.",
    defaultSensitivity: "HIGH",
  },
  {
    key: "email",
    label: "Email Address",
    description: "Primary key for credential stuffing and cross-site data correlation.",
    defaultSensitivity: "HIGH",
  },
  {
    key: "full_name",
    label: "Full Legal Name",
    description: "Facilitates social engineering, background searches, and doxxing.",
    defaultSensitivity: "MEDIUM",
  },
  {
    key: "country",
    label: "Country / Location",
    description: "Broad geographic identifier; lower sensitivity unless combined with other PII.",
    defaultSensitivity: "LOW",
  },
  {
    key: "interests",
    label: "Interests & Bio",
    description: "Lifestyle and hobby details used for crafting spear-phishing messages.",
    defaultSensitivity: "LOW",
  },
];

export const PrivacyAnalysisForm: React.FC<PrivacyAnalysisFormProps> = ({
  onSubmit,
  isLoading,
}) => {
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
          // If unprovided, force is_public to false
          if (key === "is_provided" && !value) {
            updated.is_public = false;
          }
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
    } else if (presetType === "exposed") {
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
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <EyeOff className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-xl font-sans">Privacy Exposure Evaluator</CardTitle>
            <CardDescription>
              Configure profile attributes to assess your exposure, oversharing, and attack surface.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Quick Presets */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Quick Configuration Presets
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => applyPreset("minimal")}
              className="text-xs font-mono px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-500/5 text-emerald-300 transition-colors"
            >
              ✓ Minimalist (Private)
            </button>
            <button
              type="button"
              onClick={() => applyPreset("social")}
              className="text-xs font-mono px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-500/5 text-cyan-300 transition-colors"
            >
              ⚠ Typical Social Profile
            </button>
            <button
              type="button"
              onClick={() => applyPreset("exposed")}
              className="text-xs font-mono px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-rose-500/50 hover:bg-rose-500/5 text-rose-300 transition-colors"
            >
              ⚠ Over-Exposed Profile
            </button>
          </div>
        </div>

        {/* Column Explanations Info Box */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-400 font-mono">
          <div className="space-y-1">
            <span className="text-slate-200 font-semibold flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-cyan-400" /> 1. Provided?
            </span>
            <p className="text-[11px] text-slate-500">
              Do you supply this information to the platform / profile?
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-slate-200 font-semibold flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-amber-400" /> 2. Publicly Visible?
            </span>
            <p className="text-[11px] text-slate-500">
              Can untrusted visitors, search engines, or scrapers view it?
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-slate-200 font-semibold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" /> 3. Strictly Necessary?
            </span>
            <p className="text-[11px] text-slate-500">
              Is this data essential for core service functionality?
            </p>
          </div>
        </div>

        {/* Profile Field Matrix */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            {FIELD_METAS.map((meta) => {
              const current = fields.find((f) => f.field_name === meta.key) || {
                field_name: meta.key,
                is_provided: false,
                is_public: false,
                is_necessary: false,
                sensitivity: meta.defaultSensitivity,
              };

              return (
                <div
                  key={meta.key}
                  className={`p-4 rounded-xl border transition-all ${
                    current.is_provided && current.is_public
                      ? "bg-rose-950/10 border-rose-500/30"
                      : current.is_provided
                      ? "bg-slate-900/60 border-slate-800"
                      : "bg-slate-950/40 border-slate-800/40 opacity-70"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Attribute Label, Sensitivity & Description */}
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-semibold text-slate-100 font-sans">
                          {meta.label}
                        </span>
                        <Badge severity={meta.defaultSensitivity} size="sm">
                          {meta.defaultSensitivity}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {meta.description}
                      </p>
                    </div>

                    {/* Right: Three Toggles */}
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 self-start lg:self-auto text-xs font-mono">
                      {/* Toggle 1: Provided */}
                      <label className="flex items-center gap-2 cursor-pointer bg-slate-950/80 px-2.5 py-1.5 rounded-lg border border-slate-800 select-none">
                        <input
                          type="checkbox"
                          checked={current.is_provided}
                          onChange={(e) => updateField(meta.key, "is_provided", e.target.checked)}
                          className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-950"
                          disabled={isLoading}
                        />
                        <span className={current.is_provided ? "text-slate-200 font-semibold" : "text-slate-500"}>
                          Provided
                        </span>
                      </label>

                      {/* Toggle 2: Public */}
                      <label
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border select-none transition-all ${
                          !current.is_provided
                            ? "opacity-30 cursor-not-allowed bg-slate-950/40 border-slate-900"
                            : current.is_public
                            ? "cursor-pointer bg-rose-500/10 border-rose-500/40 text-rose-300 font-semibold"
                            : "cursor-pointer bg-slate-950/80 border-slate-800 text-slate-400"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={current.is_public}
                          disabled={!current.is_provided || isLoading}
                          onChange={(e) => updateField(meta.key, "is_public", e.target.checked)}
                          className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-rose-500 focus:ring-rose-500 focus:ring-offset-slate-950"
                        />
                        <span>Public</span>
                      </label>

                      {/* Toggle 3: Necessary */}
                      <label
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border select-none transition-all ${
                          !current.is_provided
                            ? "opacity-30 cursor-not-allowed bg-slate-950/40 border-slate-900"
                            : current.is_necessary
                            ? "cursor-pointer bg-emerald-500/10 border-emerald-500/40 text-emerald-300 font-semibold"
                            : "cursor-pointer bg-slate-950/80 border-slate-800 text-slate-400"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={current.is_necessary}
                          disabled={!current.is_provided || isLoading}
                          onChange={(e) => updateField(meta.key, "is_necessary", e.target.checked)}
                          className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-950"
                        />
                        <span>Necessary</span>
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              size="lg"
              className="w-full font-mono text-sm"
              isLoading={isLoading}
              leftIcon={<Zap className="w-4 h-4" />}
            >
              Analyze Privacy Exposure
            </Button>
          </div>
        </form>

        <div className="pt-2 flex items-center gap-2 text-xs text-slate-500 font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span>Zero Persistent Storage: Privacy analysis runs transiently without saving your profile configuration.</span>
        </div>
      </CardContent>
    </Card>
  );
};
