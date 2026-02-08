"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StepHeader } from "@/components/adapter/StepHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePipeline } from "@/lib/pipeline-context";
import { FileJson, Globe, Package, Upload, ArrowRight, Loader2, AlertCircle } from "lucide-react";

const INPUT_SOURCES = [
  { key: "openapi", label: "OpenAPI / Swagger", sub: "JSON or YAML spec", icon: FileJson },
  { key: "docs", label: "API Docs URL", sub: "Scrape & extract", icon: Globe },
  { key: "sdk", label: "SDK / Client Lib", sub: "TS, Python, Java", icon: Package },
  { key: "postman", label: "Postman Collection", sub: "Export & import", icon: Upload },
];

export default function IngestPage() {
  const router = useRouter();
  const { runIngest, loading, error } = usePipeline();
  const [selected, setSelected] = useState("openapi");
  const [specUrl, setSpecUrl] = useState("");

  const handleParse = async () => {
    if (!specUrl.trim()) return;
    await runIngest(specUrl.trim(), selected);
    router.push("/adapter/discover");
  };

  return (
    <>
      <StepHeader
        currentStep="ingest"
        title="Create New Adapter"
        description="Generate an MCP server from any software interface"
      />

      <div className="space-y-8">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-4">Select Input Source</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {INPUT_SOURCES.map((src) => {
              const Icon = src.icon;
              const isSelected = selected === src.key;
              return (
                <button
                  key={src.key}
                  onClick={() => setSelected(src.key)}
                  className={cn(
                    "card-glass p-4 text-left transition-all cursor-pointer group",
                    isSelected
                      ? "border-primary/50 bg-primary/5 glow-border"
                      : "hover:border-primary/20"
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5 mb-3 transition-colors",
                    isSelected ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                  <p className={cn(
                    "text-sm font-semibold mb-0.5 transition-colors",
                    isSelected ? "text-primary" : "text-foreground"
                  )}>{src.label}</p>
                  <p className="text-[11px] text-muted-foreground">{src.sub}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-foreground mb-3 block">
            Paste spec URL or local file path
          </label>
          <textarea
            value={specUrl}
            onChange={(e) => setSpecUrl(e.target.value)}
            placeholder="http://127.0.0.1:8001/openapi.json  or  /path/to/openapi.yaml"
            className="w-full h-40 rounded-xl bg-card border border-border px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 resize-none"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-muted-foreground">
            Supported: OpenAPI 3.x, Swagger 2.x, Postman Collection v2.1
          </p>
          <Button
            onClick={handleParse}
            disabled={!specUrl.trim() || loading}
            className="btn-gradient rounded-full px-6 relative z-10"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Parsing...</>
            ) : (
              <><span>Parse & Continue</span> <ArrowRight className="w-4 h-4" /></>
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
