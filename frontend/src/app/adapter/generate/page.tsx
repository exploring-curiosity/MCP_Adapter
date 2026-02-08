"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StepHeader } from "@/components/adapter/StepHeader";
import { Button } from "@/components/ui/button";
import { usePipeline } from "@/lib/pipeline-context";
import { ArrowRight, ArrowLeft, FileCode2, Folder, File, Loader2, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function GeneratePage() {
  const router = useRouter();
  const { generated, runGenerate, loading, error, tools, spec } = usePipeline();
  const [selectedFile, setSelectedFile] = useState("server.py");

  if (!tools.length) {
    return (
      <>
        <StepHeader currentStep="generate" title="Generate MCP Server" description="" />
        <div className="flex flex-col items-center py-20 gap-4">
          <AlertCircle className="w-8 h-8 text-muted-foreground" />
          <p className="text-muted-foreground">No tools loaded. Go back to Ingest first.</p>
          <Button variant="outline" onClick={() => router.push("/adapter/ingest")}>Go to Ingest</Button>
        </div>
      </>
    );
  }

  const handleGenerate = async () => {
    await runGenerate();
  };

  const files = generated?.files || {};
  const fileNames = Object.keys(files);
  const currentFileContent = files[selectedFile]?.content || "";
  const currentFileLang = files[selectedFile]?.lang || "";

  return (
    <>
      <StepHeader
        currentStep="generate"
        title="Generate MCP Server"
        description="AI-powered code generation using DeepSeek-V3 via Featherless"
      />

      {!generated ? (
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg animate-pulse-glow">
              <FileCode2 className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-foreground">Ready to generate</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                The LLM will generate a complete MCP server with {tools.length} tools, policy enforcement, and test suite
                {spec ? ` for ${spec.title}` : ""}.
              </p>
            </div>
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive max-w-md">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
            <Button onClick={handleGenerate} disabled={loading} className="btn-gradient rounded-full px-8 h-12 relative z-10">
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Generating with DeepSeek-V3...</>
              ) : (
                <><FileCode2 className="w-4 h-4" /> Generate Server Code</>
              )}
            </Button>
          </div>
          <div className="flex items-center justify-start">
            <Button variant="ghost" onClick={() => router.push("/adapter/policy")} className="text-muted-foreground">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="card-glass p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Check className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Generation complete</p>
              <p className="text-xs text-muted-foreground">
                {fileNames.length} files generated — {generated.server_name} with {generated.tool_count} tools
              </p>
            </div>
          </div>

          <div className="grid grid-cols-[240px_1fr] gap-4">
            <div className="card-glass p-3 space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground px-2 mb-2">Files</p>
              <button
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-muted-foreground text-left"
              >
                <Folder className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate font-mono">{generated.server_name}/</span>
              </button>
              {fileNames.map((name) => (
                <button
                  key={name}
                  onClick={() => setSelectedFile(name)}
                  className={cn(
                    "w-full flex items-center gap-2 py-1.5 rounded-md text-xs transition-colors text-left cursor-pointer",
                    selectedFile === name
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                  )}
                  style={{ paddingLeft: "24px", paddingRight: "8px" }}
                >
                  <File className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate font-mono">{name}</span>
                  <span className="ml-auto text-[10px] text-muted-foreground">{files[name].lines}L</span>
                </button>
              ))}
            </div>

            <div className="code-block overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-border/30">
                <span className="text-xs font-mono text-muted-foreground">{selectedFile}</span>
                <span className="text-[10px] text-muted-foreground">{currentFileLang}</span>
              </div>
              <pre className="p-4 overflow-x-auto text-xs leading-relaxed max-h-[600px] overflow-y-auto">
                <code className="text-foreground/80">{currentFileContent}</code>
              </pre>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button variant="ghost" onClick={() => router.push("/adapter/policy")} className="text-muted-foreground">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <Button onClick={() => router.push("/adapter/test")} className="btn-gradient rounded-full px-6 relative z-10">
              <span>Run Tests</span> <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
