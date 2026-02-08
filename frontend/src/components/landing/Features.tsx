"use client";

import { motion } from "framer-motion";
import { Check, ShieldCheck, Layers, Rocket } from "lucide-react";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Proven actions, not raw APIs",
    description: "Generated MCP tools are typed, validated, and policy-governed — agents execute predictably every time.",
    points: ["JSON Schema validated inputs", "Auto-inferred access levels (read/write/destructive)", "Scoped allowlist & denylist per tool"],
    gradient: "from-primary/20 to-transparent",
    iconColor: "from-primary to-primary/60",
  },
  {
    icon: Layers,
    title: "Orchestrate across systems",
    description: "Runner provides memory, rollback, and transactional integrity across multi-step pipelines.",
    points: ["Retry with exponential backoff", "Stage-level rollback on failure", "Full pipeline observability & logging"],
    gradient: "from-[hsl(260_60%_60%/0.15)] to-transparent",
    iconColor: "from-[hsl(260_60%_60%)] to-[hsl(260_50%_50%)]",
  },
  {
    icon: Rocket,
    title: "Deploy with confidence",
    description: "Built-in governance, DAuth authentication, and audit trails at every layer of the stack.",
    points: ["Per-tenant OAuth2/PAT via DAuth", "Auto-generated Dockerfile & CI config", "Versioned artifacts with changelog"],
    gradient: "from-[hsl(200_80%_55%/0.12)] to-transparent",
    iconColor: "from-[hsl(200_80%_55%)] to-[hsl(210_70%_45%)]",
  },
];

export function Features() {
  return (
    <section id="features" className="py-28 relative">
      <div className="absolute inset-0 bg-gradient-mesh" />
      <div className="section-glow-line absolute top-0 left-0 right-0" />
      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4 glass rounded-full px-4 py-1.5">Features</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-5">Enterprise-grade from day one</h2>
          <p className="max-w-xl mx-auto text-muted-foreground text-lg">Security, governance, and reliability built into every generated artifact.</p>
        </motion.div>
        <div className="grid lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1, duration: 0.5 }} className="card-glass p-8 flex flex-col relative overflow-hidden group">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.iconColor} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{feature.description}</p>
                  <ul className="space-y-3 mt-auto">
                    {feature.points.map((point) => (
                      <li key={point} className="flex items-start gap-2.5 text-sm text-secondary-foreground">
                        <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
