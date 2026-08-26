import React from "react";
import { Link } from "react-router-dom";
import { Shield, Fingerprint, EyeOff, Lock, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { ScoreRing } from "../components/ui/ScoreRing";
import { Badge } from "../components/ui/Badge";

export const LandingPage: React.FC = () => {
  const pillars = [
    {
      icon: Fingerprint,
      title: "Username Threat Analysis",
      description: "Detects real names, birth years, sequential patterns, and multi-attribute leaks in your public handles.",
      badge: "ACTIVE",
    },
    {
      icon: EyeOff,
      title: "Privacy Exposure Engine",
      description: "Evaluates public profile attributes against sensitivity ratings and oversharing risks to identify attack vectors.",
      badge: "ACTIVE",
    },
    {
      icon: Shield,
      title: "Composite DIESS Metric",
      description: "Calculates a unified 0-100 security score representing your overall digital identity attack surface.",
      badge: "DETERMINISTIC",
    },
    {
      icon: Lock,
      title: "Zero-Knowledge Architecture",
      description: "Inputs are analyzed transiently in memory with zero plaintext retention or telemetry.",
      badge: "PRIVACY-FIRST",
    },
  ];

  const features = [
    "Deterministic, explainable security scoring (0-100)",
    "Granular severity grading (LOW, MEDIUM, HIGH, CRITICAL)",
    "Actionable remediation recommendations per finding",
    "No passwords or sensitive identifiers permanently stored",
    "Real-time identification of social engineering risk vectors",
  ];

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="relative pt-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-xs font-mono text-green-600 dark:text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              IDENTITY RISK EVALUATION
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-black dark:text-white leading-[1.15] font-sans">
              Is Your Digital Identity{" "}
              <span className="text-green-500 dark:text-green-400">
                Exposing You?
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
              AI Identity Guardian calculates your <strong>Digital Identity Exposure & Security Score (DIESS)</strong>.
              Discover how much personal data your usernames, profile visibility, and digital footprints reveal.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/scan">
                <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Start Identity Scan
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="secondary" size="lg">
                  View Dashboard
                </Button>
              </Link>
            </div>

            {/* Quick Guarantees */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 dark:text-green-400" />
                <span>No Account Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 dark:text-green-400" />
                <span>No Data Retention</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 dark:text-green-400" />
                <span>Instant Report</span>
              </div>
            </div>
          </div>

          {/* Score Preview Card */}
          <div className="lg:col-span-5 flex justify-center">
            <Card variant="glow" glowColor="emerald" className="w-full max-w-md">
              <CardHeader className="text-center pb-2">
                <div className="flex items-center justify-between">
                  <Badge severity="MEDIUM">DIESS PREVIEW</Badge>
                  <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">SAMPLE AUDIT</span>
                </div>
                <CardTitle className="text-xl mt-2 font-mono">Identity Posture</CardTitle>
                <CardDescription>Multi-vector score synthesis</CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col items-center space-y-6 pt-4">
                <ScoreRing score={78} size={200} strokeWidth={16} label="DIESS" />

                <div className="w-full space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center p-2 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <span className="text-zinc-600 dark:text-zinc-400">Username Security:</span>
                    <span className="text-green-600 dark:text-green-400 font-semibold">85 / 100</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <span className="text-zinc-600 dark:text-zinc-400">Privacy Exposure:</span>
                    <span className="text-green-600 dark:text-green-400 font-semibold">72 / 100</span>
                  </div>
                </div>

                <Link to="/scan" className="w-full">
                  <Button variant="outline" className="w-full text-xs font-mono">
                    Run Scan On Your Identity
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-black dark:text-white font-sans">
            How AI Identity Guardian Protects You
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            A deterministic risk framework engineered to identify attack surfaces before adversaries do.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <Card key={idx} variant="cyber" className="hover:border-green-500/40 transition-all duration-200 group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400 flex-shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-black dark:text-white font-sans">
                        {pillar.title}
                      </h3>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-green-500/10 text-green-700 dark:text-green-300 border border-green-500/30">
                        {pillar.badge}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Explainable Security Findings */}
      <section className="rounded-2xl p-8 sm:p-10 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-2xl font-bold text-black dark:text-white font-sans">
              Explainable Security Findings
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Unlike black-box scoring tools, AI Identity Guardian executes deterministic security heuristics.
              Every score deduction maps directly to an identifiable risk finding with transparent remediation steps.
            </p>
            <ul className="space-y-2 pt-2 text-sm text-zinc-700 dark:text-zinc-300">
              {features.map((feat, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full p-6 rounded-xl bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 space-y-4 font-mono text-xs">
              <div className="text-green-600 dark:text-green-400 font-semibold uppercase tracking-wider">
                DIESS Evaluation Model
              </div>
              <div className="space-y-1.5 text-zinc-600 dark:text-zinc-400">
                <p>Username Security: 20%</p>
                <p>Privacy Exposure: 25%</p>
                <p>Impersonation Security: 20%</p>
                <p>Credential Security: 20%</p>
                <p>Recovery Security: 15%</p>
              </div>
              <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 text-zinc-500">
                Formula: DIESS = Sum(w_i * S_i)
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
