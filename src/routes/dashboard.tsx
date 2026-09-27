import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  CloudUpload,
  FlaskConical,
  Sprout,
  Users,
  Wheat,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/krishi-data";
import { useKrishi } from "@/lib/krishi-store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — KrishiFeed AI" },
      {
        name: "description",
        content:
          "Overview of feed and silage tests, average quality scores, sensor status and pending cloud syncs.",
      },
      { property: "og:title", content: "Dashboard — KrishiFeed AI" },
      {
        property: "og:description",
        content: "Track tests, quality trends and sensor health across your farms.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { tests, resetDraft } = useKrishi();
  const avg = tests.length
    ? Math.round(tests.reduce((s, t) => s + t.result.quality_score, 0) / tests.length)
    : 0;
  const pending = tests.filter((t) => !t.synced).length;
  const farmers = new Set(tests.map((t) => t.farmer.name)).size;

  const stats = [
    { label: "Tests completed", value: String(tests.length), icon: FlaskConical },
    { label: "Average quality", value: `${avg}/100`, icon: Activity },
    { label: "Farmers served", value: String(farmers), icon: Users },
    { label: "Pending sync", value: String(pending), icon: CloudUpload },
  ];

  return (
    <AppShell
      title="Dashboard"
      subtitle="Feed and silage quality across your farms."
      action={
        <Button asChild onClick={resetDraft}>
          <Link to="/new-test">Start New Test</Link>
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label}>
              <CardContent className="flex items-center gap-4">
                <span className="grid size-11 place-items-center rounded-xl bg-secondary text-secondary-foreground">
                  <s.icon className="size-5" />
                </span>
                <div>
                  <p className="stat-label">{s.label}</p>
                  <p className="font-display text-xl font-semibold">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <QuickCard
            to="/feed-analysis"
            icon={Wheat}
            title="Feed Analysis"
            text="Nutrition and adulteration results for concentrate feed batches."
          />
          <QuickCard
            to="/silage-analysis"
            icon={Sprout}
            title="Silage Analysis"
            text="Fermentation quality, pH profile and spoilage risk."
          />
          <QuickCard
            to="/sensors"
            icon={Activity}
            title="Sensor Monitoring"
            text="Live status of the NIR, moisture, pH and climate sensors."
          />
        </div>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Recent tests</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/history">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            {tests.slice(0, 5).map((t) => (
              <div key={t.id} className="flex flex-wrap items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {t.sample.id} · {t.sample.material}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {t.farmer.name} · {t.farmer.farm_name} · {formatDate(t.created_at)}
                  </p>
                </div>
                <Badge variant="outline">{t.sample.sample_type}</Badge>
                <span className="font-display text-sm font-semibold">
                  {t.result.quality_score}/100
                </span>
                <Button asChild size="sm" variant="secondary">
                  <Link to="/reports" search={{ test: t.id }}>
                    Report
                  </Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function QuickCard({
  to,
  icon: Icon,
  title,
  text,
}: {
  to: "/feed-analysis" | "/silage-analysis" | "/sensors";
  icon: typeof Wheat;
  title: string;
  text: string;
}) {
  return (
    <Link to={to} className="group">
      <Card className="h-full transition-shadow group-hover:shadow-lift">
        <CardContent className="space-y-3">
          <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Icon className="size-5" />
          </span>
          <h3 className="font-display text-base font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{text}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
