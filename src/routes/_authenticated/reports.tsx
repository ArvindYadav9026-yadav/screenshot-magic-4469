import { createFileRoute, Link } from "@tanstack/react-router";
import { Printer } from "lucide-react";
import { QrCode } from "@/components/QrCode";
import { AppShell } from "@/components/AppShell";
import { FarmerSummary, ResultPanel } from "@/components/ResultPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/krishi-data";
import { useKrishi } from "@/lib/krishi-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/reports")({
  validateSearch: (search: Record<string, unknown>) => ({
    test: typeof search.test === "string" ? search.test : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Reports — KrishiFeed AI" },
      {
        name: "description",
        content:
          "Printable feed and silage quality reports with farmer details, nutrition, contamination screening and a traceability code.",
      },
      { property: "og:title", content: "Reports — KrishiFeed AI" },
      {
        property: "og:description",
        content: "Share a complete quality report with buyers, vets and cooperatives.",
      },
    ],
  }),
  component: Reports,
});

function Reports() {
  const { test } = Route.useSearch();
  const { tests } = useKrishi();
  const selected = tests.find((t) => t.id === test) ?? tests[0];

  if (!selected) {
    return (
      <AppShell title="Reports" subtitle="No tests recorded yet.">
        <Card>
          <CardContent className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">Run a test to generate your first report.</p>
            <Button asChild>
              <Link to="/new-test">Start New Test</Link>
            </Button>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Reports"
      subtitle={`${selected.sample.id} · ${selected.farmer.name}`}
      action={
        <Button variant="outline" onClick={() => window.print()}>
          <Printer className="size-4" /> Print / PDF
        </Button>
      }
    >
      <div className="space-y-5">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tests.map((t) => (
            <Link
              key={t.id}
              to="/reports"
              search={{ test: t.id }}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                t.id === selected.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:bg-muted",
              )}
            >
              {t.sample.id}
            </Link>
          ))}
        </div>

        <FarmerSummary record={selected} />
        <ResultPanel record={selected} />

        <Card>
          <CardHeader>
            <CardTitle className="text-base">QR Traceability</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-6">
            <div className="text-primary">
              <QrCode value={selected.sample.qr_code} size={132} />
            </div>
            <div className="text-sm">
              <p className="font-display text-lg font-semibold">{selected.sample.qr_code}</p>
              <p className="text-muted-foreground">
                Batch {selected.sample.batch_number} · {formatDate(selected.created_at)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Prototype traceability tag — values in this report are AI-estimated.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
