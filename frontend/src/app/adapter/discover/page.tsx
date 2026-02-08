"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StepHeader } from "@/components/adapter/StepHeader";
import { Button } from "@/components/ui/button";
import { usePipeline } from "@/lib/pipeline-context";
import { ArrowRight, ArrowLeft, Search, Tag, Globe, AlertCircle } from "lucide-react";

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  POST: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  PUT: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  DELETE: "bg-red-500/15 text-red-400 border-red-500/30",
  PATCH: "bg-purple-500/15 text-purple-400 border-purple-500/30",
};

export default function DiscoverPage() {
  const router = useRouter();
  const { endpoints, spec } = usePipeline();
  const [filter, setFilter] = useState("");

  if (!endpoints.length) {
    return (
      <>
        <StepHeader currentStep="discover" title="Discovered Endpoints" description="" />
        <div className="flex flex-col items-center py-20 gap-4">
          <AlertCircle className="w-8 h-8 text-muted-foreground" />
          <p className="text-muted-foreground">No endpoints loaded. Go back to Ingest and parse a spec first.</p>
          <Button variant="outline" onClick={() => router.push("/adapter/ingest")}>Go to Ingest</Button>
        </div>
      </>
    );
  }

  const filtered = endpoints.filter(
    (ep) =>
      ep.path.toLowerCase().includes(filter.toLowerCase()) ||
      (ep.summary || ep.description).toLowerCase().includes(filter.toLowerCase()) ||
      ep.method.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      <StepHeader
        currentStep="discover"
        title="Discovered Endpoints"
        description={spec ? `${spec.title} v${spec.version} — ${spec.base_url}` : "APIs extracted from your spec"}
      />

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter endpoints..."
              className="w-full h-10 rounded-lg bg-card border border-border pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Globe className="w-3.5 h-3.5" />
            {endpoints.length} endpoints found
          </div>
        </div>

        <div className="space-y-2">
          {filtered.map((ep, idx) => (
            <div
              key={`${ep.method}-${ep.path}-${idx}`}
              className="card-glass p-4 flex items-center gap-4 group"
            >
              <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold font-mono border ${METHOD_COLORS[ep.method] || "bg-muted text-muted-foreground"}`}>
                {ep.method}
              </span>
              <code className="text-sm font-mono text-foreground flex-1 truncate">{ep.path}</code>
              <span className="text-xs text-muted-foreground hidden sm:block flex-1 truncate">{ep.summary || ep.description}</span>
              <div className="flex items-center gap-2 shrink-0">
                {ep.tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground px-2 py-0.5 rounded-full glass">
                    <Tag className="w-2.5 h-2.5" />
                    {tag}
                  </span>
                ))}
                <span className="text-[10px] text-muted-foreground">{ep.params.length} params</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4">
          <Button variant="ghost" onClick={() => router.push("/adapter/ingest")} className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <Button onClick={() => router.push("/adapter/schema")} className="btn-gradient rounded-full px-6 relative z-10">
            <span>Continue to Schema</span> <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
