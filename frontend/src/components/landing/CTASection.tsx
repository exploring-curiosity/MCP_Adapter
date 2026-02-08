"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[radial-gradient(ellipse,hsl(172_66%_50%/0.1),transparent_60%)] blur-3xl" />
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-[radial-gradient(ellipse,hsl(260_60%_60%/0.06),transparent_60%)] blur-3xl" />
      </div>
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="glass-strong rounded-3xl p-12 md:p-16 gradient-border glow-subtle">
            <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-5">
              Start generating<br />
              <span className="text-gradient-cyan">MCP servers today</span>
            </h2>
            <p className="max-w-lg mx-auto text-muted-foreground text-lg mb-10">
              Paste an OpenAPI spec, configure policies, and get a production-ready MCP server in seconds.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/adapter/ingest">
                <Button size="lg" className="btn-gradient rounded-full text-base px-12 h-14 text-lg relative z-10">
                  <span>Open Generator</span>
                  <ArrowUpRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
