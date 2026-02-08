"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Network, FileCode2, Key, LayoutDashboard } from "lucide-react";

const SERVICES = [
  { icon: FileCode2, title: "MCP Generator", description: "Auto-generate fully typed MCP servers from OpenAPI specs, SDKs, docs, or recorded traffic.", badge: "Core", gradient: "from-primary/20 to-primary/5", iconGradient: "from-primary to-primary/60" },
  { icon: Network, title: "Agent Orchestration", description: "Run multi-step pipelines: ingest → mine → synth → generate → test → deploy.", badge: "Pipeline", gradient: "from-[hsl(260_60%_60%/0.15)] to-[hsl(260_60%_60%/0.03)]", iconGradient: "from-[hsl(260_60%_60%)] to-[hsl(260_50%_50%)]" },
  { icon: Key, title: "DAuth", description: "First-class per-tenant credential management. Users grant access with OAuth2/PAT flows.", badge: "Security", gradient: "from-[hsl(40_90%_55%/0.12)] to-[hsl(40_90%_55%/0.02)]", iconGradient: "from-[hsl(40_90%_55%)] to-[hsl(30_80%_45%)]" },
  { icon: Zap, title: "Multi-Model Routing", description: "Unified OpenAI-compatible API layer to call any provider. Automatic fallback and cost optimization.", badge: "AI", gradient: "from-[hsl(200_80%_55%/0.15)] to-[hsl(200_80%_55%/0.03)]", iconGradient: "from-[hsl(200_80%_55%)] to-[hsl(210_70%_45%)]" },
  { icon: Shield, title: "Policy Engine", description: "Granular read/write/destructive controls per tool. Allowlist, denylist, and scope-based authorization.", badge: "Governance", gradient: "from-[hsl(155_55%_45%/0.12)] to-[hsl(155_55%_45%/0.02)]", iconGradient: "from-[hsl(155_55%_45%)] to-[hsl(160_45%_35%)]" },
  { icon: LayoutDashboard, title: "Test & Deploy", description: "Auto-generated test harness, containerization with Docker, and one-click deployment.", badge: "DevOps", gradient: "from-[hsl(330_60%_55%/0.12)] to-[hsl(330_60%_55%/0.02)]", iconGradient: "from-[hsl(330_60%_55%)] to-[hsl(340_50%_45%)]" },
];

export function Services() {
  return (
    <section id="services" className="py-28 relative">
      <div className="absolute inset-0 bg-gradient-mesh" />
      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4 glass rounded-full px-4 py-1.5">Platform</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-5">
            Everything you need to ship<br />
            <span className="text-gradient-cyan">MCP servers at scale</span>
          </h2>
          <p className="max-w-xl mx-auto text-muted-foreground text-lg">From spec ingestion to production deployment — one platform, no glue code.</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((service, idx) => {
            const Icon = service.icon;
            return (
              <motion.div key={service.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08, duration: 0.5 }} className="group card-glass p-7 relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative">
                  <div className="flex items-start justify-between mb-5">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.iconGradient} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-3 py-1 rounded-full glass">{service.badge}</span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2.5">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
