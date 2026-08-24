import React from "react";
import { Link } from "react-router-dom";
import { Shield, Fingerprint, EyeOff, Lock, ArrowRight, CheckCircle2, Zap, ShieldCheck } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { ScoreRing } from "../components/ui/ScoreRing";
import { Badge } from "../components/ui/Badge";

export const LandingPage: React.FC = () => {
  const pillars = [
    {
      icon: Fingerprint,
      title: "Username Exposure Analysis",
      description: "Detects real names, birth years, sequential patterns, and compounding multi-attribute leaks embedded within your public handles.",
      color: "cyan",
      badge: "ACTIVE",
    },
    {
      icon: EyeOff,
      title: "Privacy Exposure Engine",
      description: "Evaluates public profile attributes against sensitivity ratings, necessity, and oversharing risks to identify attack vectors.",
      color: "emerald",
      badge: "ACTIVE",
    },
    {
      icon: Shield,
      title: "Composite DIESS Metric",
      description: "Calculates the Digital Identity Exposure & Security Score—a unified 0–100 benchmark representing your overall attack surface.",
      color: "amber",
      badge: "DETERMINISTIC",
    },
    {
      icon: Lock,
      title: "Zero-Knowledge Architecture",
      description: "Built with defense-in-depth principles. Inputs are analyzed transiently in memory with zero plaintext retention or telemetry.",
      color: "cyan",
      badge: "PRIVACY-FIRST",
    },
  ];

  const features = [
    "Deterministic, explainable security scoring (0–100)",
    "Granular severity grading (LOW, MEDIUM, HIGH, CRITICAL)",
    "Actionable remediation recommendations per finding",
    "No passwords or sensitive identifiers permanently stored",
    "Real-time identification of social engineering risk vectors",
  ];

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              NEXT-GEN IDENTITY RISK EVALUATION
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-100 leading-[1.15] font-sans">
              Is Your Digital Identity <br />
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                Exposing You Online?
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
              AI Identity Guardian calculates your <strong>Digital Identity Exposure & Security Score (DIESS)</strong>. 
              Discover how much personal data your usernames, profile visibility, and digital footprints reveal to adversaries.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/scan">
                <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Start Identity Scan
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="secondary" size="lg">
                  Explore Posture Dashboard
                </Button>
              </Link>
            </div>

            {/* Quick Guarantees */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero Account Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>No Data Retention</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Instant Actionable Report</span>
              </div>
            </div>
          </div>

          {/* Interactive Score Preview Card */}
          <div className="lg:col-span-5 flex justify-center">
            <Card variant="glow" glowColor="cyan" className="w-full max-w-md relative overflow-hidden">
              <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
              <CardHeader className="text-center pb-2">
                <div className="flex items-center justify-between">
                  <Badge severity="MEDIUM">DIESS PREVIEW</Badge>
                  <span className="text-xs font-mono text-slate-400">SAMPLE AUDIT</span>
                </div>
                <CardTitle className="text-xl mt-2 font-mono">Identity Posture Gauge</CardTitle>
                <CardDescription>Composite multi-vector score synthesis</CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col items-center space-y-6 pt-4">
                <ScoreRing score={78} size={200} strokeWidth={16} label="DIESS" />

                <div className="w-full space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center p-2 rounded bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400">Username Security:</span>
                    <span className="text-emerald-400 font-semibold">85 / 100</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400">Privacy Exposure:</span>
                    <span className="text-cyan-400 font-semibold">72 / 100</span>
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

      {/* Core Architectural Pillars */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100 font-sans">
            How AI Identity Guardian Protects You
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            A deterministic, multi-dimensional risk framework engineered to identify attack surfaces before adversaries do.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <Card key={idx} variant="cyber" className="hover:border-cyan-500/40 transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:shadow-glow-cyan transition-all flex-shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-100 font-sans">
                        {pillar.title}
                      </h3>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                        {pillar.badge}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Why Deterministic Security Matters */}
      <section className="cyber-glass rounded-2xl p-8 sm:p-10 border border-cyan-500/20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-2xl font-bold text-slate-100 font-sans">
              Explainable & Grounded Security Findings
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Unlike black-box scoring tools that generate opaque numbers, AI Identity Guardian executes deterministic security heuristics. Every score deduction maps directly to an identifiable risk finding with transparent remediation steps.
            </p>
            <ul className="space-y-2 pt-2 text-sm text-slate-300">
              {features.map((feat, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full p-6 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4 font-mono text-xs">
              <div className="text-cyan-400 font-semibold uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4" /> DIESS Evaluation Model
              </div>
              <div className="space-y-1.5 text-slate-400">
                <p>• Username Security: 20%</p>
                <p>• Privacy Exposure: 25%</p>
                <p>• Impersonation Security: 20% (Roadmap)</p>
                <p>• Credential Security: 20% (Roadmap)</p>
                <p>• Recovery Security: 15% (Roadmap)</p>
              </div>
              <div className="pt-2 border-t border-slate-800 text-slate-500">
                Formula: DIESS = &Sigma; (w_i &times; S_i)
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
