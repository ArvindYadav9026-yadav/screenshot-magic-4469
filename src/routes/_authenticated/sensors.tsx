import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DEMO_SENSORS, NIR_SPECTRUM, SENSOR_DEVICES } from "@/lib/krishi-data";

export const Route = createFileRoute("/_authenticated/sensors")({
  head: () => ({
    meta: [
      { title: "Sensor Monitoring — KrishiFeed AI" },
      {
        name: "description",
        content:
          "Live status of the NIR spectrometer, moisture, pH, temperature and humidity sensors with the latest spectral scan.",
      },
      { property: "og:title", content: "Sensor Monitoring — KrishiFeed AI" },
      {
        property: "og:description",
        content: "Check every sensor before you test a sample in the field.",
      },
    ],
  }),
  component: Sensors,
});

function Sensors() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2500);
    return () => clearInterval(id);
  }, []);

  const jitter = (base: number, amount: number) =>
    Number((base + Math.sin(tick + base) * amount).toFixed(1));

  const live = [
    { label: "Moisture", value: `${jitter(DEMO_SENSORS.moisture, 0.3)}%` },
    { label: "pH", value: `${jitter(DEMO_SENSORS.ph, 0.05)}` },
    { label: "Temperature", value: `${jitter(DEMO_SENSORS.temperature, 0.6)}°C` },
    { label: "Humidity", value: `${jitter(DEMO_SENSORS.humidity, 1.5)}%` },
  ];

  const max = Math.max(...NIR_SPECTRUM.map((p) => p.absorbance));
  const points = NIR_SPECTRUM.map((p, i) => {
    const x = (i / (NIR_SPECTRUM.length - 1)) * 100;
    const y = 100 - (p.absorbance / max) * 90;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ");

  return (
    <AppShell title="Sensor Monitoring" subtitle="Device health and live readings.">
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          {SENSOR_DEVICES.map((d) => (
            <Card key={d.name}>
              <CardContent className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{d.name}</p>
                  <p className="text-xs text-muted-foreground">{d.detail}</p>
                </div>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-success">
                  <span className="size-2 animate-pulse rounded-full bg-success" /> Connected
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Live readings</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {live.map((r) => (
              <div key={r.label} className="rounded-xl bg-surface px-3 py-2.5">
                <p className="stat-label">{r.label}</p>
                <p className="font-display text-lg font-semibold">{r.value}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">NIR spectrum — last scan (900–1700 nm)</CardTitle>
          </CardHeader>
          <CardContent>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-56 w-full">
              {[20, 40, 60, 80].map((y) => (
                <line key={y} x1="0" y1={y} x2="100" y2={y} className="stroke-border" strokeWidth="0.3" />
              ))}
              <polyline
                points={points}
                className="fill-none stroke-primary"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </svg>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>900 nm</span>
              <span>1300 nm</span>
              <span>1700 nm</span>
            </div>
          </CardContent>
        </Card>

        <Badge variant="outline" className="w-full justify-center py-2">
          Demo Mode — Sensor readings are simulated prototype data.
        </Badge>
      </div>
    </AppShell>
  );
}
