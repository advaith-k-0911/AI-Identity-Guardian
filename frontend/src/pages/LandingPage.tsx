import React from "react";
import { Link } from "react-router-dom";
import { Shield, Fingerprint, EyeOff, Lock, ArrowRight, CheckCircle2, ShieldCheck, ExternalLink } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { ScoreRing } from "../components/ui/ScoreRing";
import { Badge } from "../components/ui/Badge";
import { ScrollReveal } from "../components/ui/ScrollReveal";

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

  const devs = [
    {
      name: "Advaith K",
      role: "B.Tech CSE (Cyber Security) Student",
      linkedin: "https://www.linkedin.com/in/advaith-k-21jul2006",
      github: "https://github.com/advaith-k-0911/AI-Identity-Guardian",
    },
    {
      name: "Anshaf Kurikkal",
      role: "Contributor",
      linkedin: null,
      github: null,
    },
  ];

  return (
    <div className="space-y-20 py-4">
      {/* Hero Section */}
      <section className="relative pt-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <ScrollReveal direction="left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-xs font-mono text-green-600 dark:text-green-400">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                IDENTITY RISK EVALUATION
              </div>
            </ScrollReveal>

            <ScrollReveal direction="left" delay={0.1}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-black dark:text-white leading-[1.15] font-sans">
                Is Your Digital Identity{" "}
                <span className="text-green-500 dark:text-green-400">
                  Exposing You?
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal direction="left" delay={0.2}>
              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
                AI Identity Guardian calculates your <strong>Digital Identity Exposure & Security Score (DIESS)</strong>.
                Discover how much personal data your usernames, profile visibility, and digital footprints reveal.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="left" delay={0.3}>
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
            </ScrollReveal>

            <ScrollReveal direction="left" delay={0.4}>
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
            </ScrollReveal>
          </div>

          {/* Score Preview Card */}
          <ScrollReveal direction="right" delay={0.2}>
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
          </ScrollReveal>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="space-y-8">
        <ScrollReveal>
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-black dark:text-white font-sans">
              How AI Identity Guardian Protects You
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              A deterministic risk framework engineered to identify attack surfaces before adversaries do.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <ScrollReveal key={idx} direction="scale" delay={idx * 0.1}>
                <Card variant="cyber" className="hover:border-green-500/40 transition-all duration-200 group h-full">
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
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* Explainable Security Findings */}
      <ScrollReveal>
        <section className="rounded-2xl p-8 sm:p-10 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <ScrollReveal direction="left" className="lg:col-span-7">
              <div className="space-y-4">
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
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.2} className="lg:col-span-5">
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
            </ScrollReveal>
          </div>
        </section>
      </ScrollReveal>

      {/* About the Developers */}
      <section className="space-y-8">
        <ScrollReveal>
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-black dark:text-white font-sans">
              Built By
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Security-minded developers passionate about protecting digital identities.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {devs.map((dev, idx) => (
            <ScrollReveal key={idx} direction="scale" delay={idx * 0.15}>
              <Card variant="cyber" className="text-center space-y-4 py-8 px-6 h-full">
                {/* Avatar circle */}
                <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center text-green-600 dark:text-green-400 text-2xl font-bold font-sans mx-auto">
                  {dev.name.split(" ").map(n => n[0]).join("")}
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-black dark:text-white font-sans">
                    {dev.name}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {dev.role}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  {dev.linkedin ? (
                    <a
                      href={dev.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-black dark:bg-zinc-900 border border-green-500/60 text-green-400 hover:border-green-400 hover:bg-green-500/10 transition-all font-semibold text-sm"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      <span>LinkedIn</span>
                      <ExternalLink className="w-4 h-4 opacity-60" />
                    </a>
                  ) : (
                    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-black dark:bg-zinc-900 border border-zinc-700 text-zinc-500 font-semibold text-sm cursor-not-allowed">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      <span>LinkedIn</span>
                    </div>
                  )}

                  {dev.github ? (
                    <a
                      href={dev.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-black dark:bg-zinc-900 border border-green-500/60 text-green-400 hover:border-green-400 hover:bg-green-500/10 transition-all font-semibold text-sm"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                      </svg>
                      <span>GitHub</span>
                      <ExternalLink className="w-4 h-4 opacity-60" />
                    </a>
                  ) : (
                    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-black dark:bg-zinc-900 border border-zinc-700 text-zinc-500 font-semibold text-sm cursor-not-allowed">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                      </svg>
                      <span>GitHub</span>
                    </div>
                  )}
                </div>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
};
