import { AlertTriangle, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatDate, type TestRecord } from "@/lib/krishi-data";
import { cn } from "@/lib/utils";

export function ScoreDial({ score, status }: { score: number; status: string }) {
  const tone = score >= 80 ? "text-success" : score >= 65 ? "text-warning" : "text-destructive";
  return (
    <div className="flex items-center gap-5">
      <div className="relative grid size-28 place-items-center">
        <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
          <circle cx="50" cy="50" r="42" className="fill-none stroke-muted" strokeWidth="10" />
          <circle
            cx="50"
            cy="50"
            r="42"
            className={cn("fill-none", tone)}
            stroke="currentColor"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${(score / 100) * 264} 264`}
          />
        </svg>
        <div className="text-center">
          <span className="font-display text-2xl font-semibold">{score}</span>
          <span className="block text-[0.65rem] text-muted-foreground">/ 100</span>
        </div>
      </div>
      <div>
        <p className="stat-label">Quality Score</p>
        <p className={cn("font-display text-xl font-semibold", tone)}>{status}</p>
        <p className="mt-1 text-xs text-muted-foreground">AI-estimated / prototype values</p>
      </div>
    </div>
  );
}

export function FarmerSummary({ record }: { record: TestRecord }) {
  const rows = [
    ["Name", record.farmer.name],
    ["Phone", record.farmer.phone || "Not provided"],
    ["Farm", record.farmer.farm_name],
    ["Location", record.farmer.location],
    ["Cattle", record.farmer.cattle_count ? String(record.farmer.cattle_count) : "—"],
    ["Language", record.farmer.language],
    ["Sample", record.sample.id],
    ["Type", record.sample.sample_type],
    ["Date", formatDate(record.created_at)],
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Farmer Details</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map(([label, value]) => (
          <div key={label}>
            <p className="stat-label">{label}</p>
            <p className="text-sm font-medium">{value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function ResultPanel({ record }: { record: TestRecord }) {
  const { result } = record;
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card className="lg:col-span-2">
        <CardContent className="flex flex-wrap items-center justify-between gap-6">
          <ScoreDial score={result.quality_score} status={result.status} />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Reading label="Moisture" value={`${record.sensors.moisture}%`} />
            <Reading label="pH" value={`${record.sensors.ph}`} />
            <Reading label="Temperature" value={`${record.sensors.temperature}°C`} />
            <Reading label="Humidity" value={`${record.sensors.humidity}%`} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nutritional Analysis</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {result.nutrition.map((n) => (
            <div key={n.label} className="flex items-center justify-between py-2.5 text-sm">
              <span className="text-muted-foreground">{n.label}</span>
              <span className="font-semibold">{n.value}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contamination Screening</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {result.contamination.map((c) => (
            <div key={c.label} className="flex items-center justify-between gap-3 text-sm">
              <span className="text-muted-foreground">{c.label}</span>
              <Badge
                variant={
                  c.risk === "Low Risk"
                    ? "secondary"
                    : c.risk === "Moderate Risk"
                      ? "outline"
                      : "destructive"
                }
              >
                {c.risk}
              </Badge>
            </div>
          ))}
          <p className="flex gap-2 rounded-xl bg-muted p-3 text-xs text-muted-foreground">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            AI screening only — laboratory confirmation recommended when contamination is suspected.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Model Confidence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {result.confidence.map((c) => (
            <div key={c.label}>
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="text-muted-foreground">{c.label}</span>
                <span className="font-semibold">{c.value}%</span>
              </div>
              <Progress value={c.value} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="size-4 text-primary" /> Farmer Advisory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2.5 text-sm">
            {result.advisory.map((a) => (
              <li key={a} className="flex gap-2.5">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function Reading({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface px-3 py-2.5">
      <p className="stat-label">{label}</p>
      <p className="font-display text-lg font-semibold">{value}</p>
    </div>
  );
}
