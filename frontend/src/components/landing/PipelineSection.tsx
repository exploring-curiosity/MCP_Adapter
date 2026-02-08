"use client";

import { motion } from "framer-motion";
import { FileJson, Brain, Cpu, Code2, TestTube, Rocket } from "lucide-react";

const STEPS = [
  { icon: FileJson, label: "Ingest Spec", description: "Parse OpenAPI, SDK types, docs, or traffic captures", color: "from-primary to-primary/60" },
  { icon: Brain, label: "Mine Capabilities", description: "AI-powered extraction of tools, resources, and schemas", color: "from-[hsl(260_60%_60%)] to-[hsl(260_50%_50%)]" },
  { icon: Cpu, label: "Synth Schemas", description: "Generate JSON Schema inputs with validation rules", color: "from-[hsl(200_80%_55%)] to-[hsl(210_70%_45%)]" },
  { icon: Code2, label: "Generate Server", description: "Emit typed MCP server with policy + auth layers", color: "from-[hsl(155_55%_45%)] to-[hsl(160_45%_35%)]" },
  { icon: TestTube, label: "Test", description: "Run auto-generated test suite against the server", color: "from-[hsl(40_90%_55%)] to-[hsl(30_80%_45%)]" },
  { icon: Rocket, label: "Deploy", description: "Push to GitHub and deploy to Dedalus", color: "from-[hsl(330_60%_55%)] to-[hsl(340_50%_45%)]" },
];

export function PipelineSection() {
  return (
    <section id="pipeline" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-20" />
      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4 glass rounded-full px-4 py-1.5">Pipeline</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-5">Six-stage agent pipeline</h2>
          <p className="max-w-xl mx-auto text-muted-foreground text-lg">Orchestrates each stage with retries, rollback, and full observability.</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div key={step.label} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08, duration: 0.5 }} className="card-glass p-6 relative overflow-hidden group">
                <div className="absolute top-4 right-4 text-5xl font-black text-foreground/[0.03] leading-none select-none">{String(idx + 1).padStart(2, "0")}</div>
                <div className="relative flex items-start gap-4">
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono font-bold text-primary tracking-wider">{String(idx + 1).padStart(2, "0")}</span>
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1.5">{step.label}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
