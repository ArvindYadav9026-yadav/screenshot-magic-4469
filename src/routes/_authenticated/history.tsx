import { createFileRoute, Link } from "@tanstack/react-router";
import { CloudOff, CloudUpload } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/krishi-data";
import { useKrishi } from "@/lib/krishi-store";

export const Route = createFileRoute("/_authenticated/history")({
  head: () => ({
    meta: [
      { title: "Test History — KrishiFeed AI" },
      {
        name: "description",
        content:
          "Every completed feed and silage test with the farmer, batch, quality score and sync status.",
      },
      { property: "og:title", content: "Test History — KrishiFeed AI" },
      {
        property: "og:description",
        content: "Search past tests by farmer, batch and quality score.",
      },
    ],
  }),
  component: History,
});

function History() {
  const { tests } = useKrishi();

  return (
    <AppShell title="Test History" subtitle="All completed feed and silage tests.">
      <div className="space-y-4">
        {tests.map((t) => (
          <Card key={t.id}>
            <CardContent className="flex flex-wrap items-center gap-4">
              <div className="min-w-0 flex-1">
                <p className="font-display text-base font-semibold">
                  {t.sample.id} · {t.sample.material}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t.farmer.name} · {t.farmer.farm_name} · {t.farmer.location}
                </p>
                <p className="text-xs text-muted-foreground">
                  Batch {t.sample.batch_number} · {formatDate(t.created_at)} ·{" "}
                  {t.farmer.cattle_count ?? "—"} cattle · {t.farmer.language}
                </p>
              </div>
              <Badge variant="outline">{t.sample.sample_type}</Badge>
              <div className="text-right">
                <p className="stat-label">Quality</p>
                <p className="font-display text-lg font-semibold">{t.result.quality_score}/100</p>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                {t.synced ? (
                  <>
                    <CloudUpload className="size-4 text-success" /> Synced
                  </>
                ) : (
                  <>
                    <CloudOff className="size-4 text-warning" /> Pending
                  </>
                )}
              </span>
              <Button asChild size="sm" variant="secondary">
                <Link to="/reports" search={{ test: t.id }}>
                  View report
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
