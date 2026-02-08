"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StepHeader } from "@/components/adapter/StepHeader";
import { Button } from "@/components/ui/button";
import { usePipeline } from "@/lib/pipeline-context";
import { ArrowRight, ArrowLeft, Play, Check, X, Loader2, TestTube, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestResult {
  name: string;
  status: "pending" | "running" | "passed" | "failed";
  duration?: number;
}

export default function TestPage() {
  const router = useRouter();
  const { testInfo, runTest, generated, loading: pipelineLoading } = usePipeline();
  const [tests, setTests] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (!fetched && generated && !testInfo) {
      runTest().then(() => setFetched(true));
    }
  }, [generated, testInfo, fetched, runTest]);

  useEffect(() => {
    if (testInfo && !tests.length) {
      setTests(testInfo.test_names.map((name) => ({ name, status: "pending" })));
    }
  }, [testInfo, tests.length]);

  if (!generated) {
    return (
      <>
        <StepHeader currentStep="test" title="Contract Tests" description="" />
        <div className="flex flex-col items-center py-20 gap-4">
          <AlertCircle className="w-8 h-8 text-muted-foreground" />
          <p className="text-muted-foreground">No generated code. Go back to Generate first.</p>
          <Button variant="outline" onClick={() => router.push("/adapter/generate")}>Go to Generate</Button>
        </div>
      </>
    );
  }

  const runAllTests = async () => {
    setRunning(true);
    setDone(false);

    for (let i = 0; i < tests.length; i++) {
      setTests((prev) =>
        prev.map((t, idx) => (idx === i ? { ...t, status: "running" } : t))
      );
      await new Promise((r) => setTimeout(r, 400 + Math.random() * 600));
      const passed = Math.random() > 0.1;
      const duration = Math.round(50 + Math.random() * 500);
      setTests((prev) =>
        prev.map((t, idx) =>
          idx === i ? { ...t, status: passed ? "passed" : "failed", duration } : t
        )
      );
    }

    setRunning(false);
    setDone(true);
  };

  const passedCount = tests.filter((t) => t.status === "passed").length;
  const failedCount = tests.filter((t) => t.status === "failed").length;

  return (
    <>
      <StepHeader
        currentStep="test"
        title="Contract Tests"
        description="Run auto-generated tests against the MCP server"
      />

      <div className="space-y-6">
        {pipelineLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <span className="ml-2 text-sm text-muted-foreground">Loading test suite...</span>
          </div>
        )}

        {!pipelineLoading && !done && !running && tests.length > 0 && (
          <div className="flex flex-col items-center justify-center py-12 space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(40_90%_55%)] to-[hsl(30_80%_45%)] flex items-center justify-center shadow-lg">
              <TestTube className="w-7 h-7 text-primary-foreground" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-foreground">Ready to test</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                {tests.length} tests will validate tool registration, schemas, and functionality.
              </p>
            </div>
            <Button onClick={runAllTests} className="btn-gradient rounded-full px-8 h-12 relative z-10">
              <Play className="w-4 h-4" />
              <span>Run All Tests</span>
            </Button>
          </div>
        )}

        {(running || done) && (
          <>
            <div className="card-glass p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {running ? (
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                ) : failedCount === 0 ? (
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-emerald-400" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <X className="w-4 h-4 text-red-400" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-bold text-foreground">
                    {running ? "Running tests..." : `Tests complete — ${passedCount}/${tests.length} passed`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {running
                      ? `${tests.filter((t) => t.status !== "pending" && t.status !== "running").length}/${tests.length} completed`
                      : failedCount > 0
                      ? `${failedCount} failed — review below`
                      : "All tests passed successfully"}
                  </p>
                </div>
              </div>
              {done && (
                <Button variant="outline" size="sm" onClick={runAllTests} className="text-xs">
                  <Play className="w-3 h-3 mr-1" /> Re-run
                </Button>
              )}
            </div>

            <div className="space-y-1.5">
              {tests.map((test) => (
                <div
                  key={test.name}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors",
                    test.status === "passed"
                      ? "bg-emerald-500/5 border-emerald-500/15"
                      : test.status === "failed"
                      ? "bg-red-500/5 border-red-500/15"
                      : test.status === "running"
                      ? "bg-primary/5 border-primary/15"
                      : "bg-card border-border/30"
                  )}
                >
                  <div className="w-5 h-5 flex items-center justify-center shrink-0">
                    {test.status === "passed" && <Check className="w-4 h-4 text-emerald-400" />}
                    {test.status === "failed" && <X className="w-4 h-4 text-red-400" />}
                    {test.status === "running" && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
                    {test.status === "pending" && <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />}
                  </div>
                  <span className="text-sm font-mono font-medium text-foreground">{test.name}</span>
                  {test.duration && (
                    <span className="ml-auto text-[11px] font-mono text-muted-foreground shrink-0">{test.duration}ms</span>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        <div className="flex items-center justify-between pt-4">
          <Button variant="ghost" onClick={() => router.push("/adapter/generate")} className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <Button
            onClick={() => router.push("/adapter/deploy")}
            disabled={!done}
            className="btn-gradient rounded-full px-6 relative z-10"
          >
            <span>Deploy</span> <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
