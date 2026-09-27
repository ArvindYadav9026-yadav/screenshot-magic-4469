import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  BadgeCheck,
  CloudUpload,
  Leaf,
  QrCode as QrIcon,
  ScanLine,
  Sprout,
  Wheat,
} from "lucide-react";
import heroImage from "@/assets/hero-farm.jpg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KrishiFeed AI — Test Cattle Feed & Silage Quality in Minutes" },
      {
        name: "description",
        content:
          "KrishiFeed AI checks cattle feed and silage for nutrition, adulteration and spoilage using AI, NIR spectra and field sensors, then gives farmers plain advice.",
      },
      { property: "og:title", content: "KrishiFeed AI — Feed & Silage Quality Testing" },
      {
        property: "og:description",
        content:
          "Nutrition, contamination screening and farmer advisory from one sample — in minutes, in your own language.",
      },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  {
    icon: Wheat,
    title: "Feed analysis",
    text: "Protein, moisture, fibre, energy and mineral status estimated from one sample.",
  },
  {
    icon: Sprout,
    title: "Silage analysis",
    text: "Fermentation quality, pH, lactic acid and spoilage risk for your pit or bale.",
  },
  {
    icon: ScanLine,
    title: "Adulteration screening",
    text: "Urea, sand, fungal and mycotoxin risk flagged before you buy in bulk.",
  },
  {
    icon: Activity,
    title: "Sensor fusion",
    text: "NIR spectrometer, moisture, pH, temperature and humidity read together.",
  },
  {
    icon: QrIcon,
    title: "QR traceability",
    text: "Every batch gets a code so buyers can trace the test back to the farm.",
  },
  {
    icon: CloudUpload,
    title: "Works offline",
    text: "Test in the field without a network; results sync when you are back online.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-field">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Leaf className="size-5" />
          </span>
          <span className="font-display text-lg font-semibold">KrishiFeed AI</span>
        </div>
        <Button asChild>
          <Link to="/dashboard">Open Dashboard</Link>
        </Button>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:py-16">
        <div>
          <Badge variant="secondary">Prototype · Demo Mode</Badge>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl">
            Know your cattle feed quality before you feed it.
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            KrishiFeed AI combines a photo of the sample, NIR spectra and field sensors to estimate
            nutrition, screen for adulteration, and give advice in your own language.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/new-test">Start New Test</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/dashboard">See the dashboard</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <BadgeCheck className="size-4 text-primary" /> Results in under 3 minutes
            </span>
            <span className="flex items-center gap-2">
              <BadgeCheck className="size-4 text-primary" /> 6 Indian languages
            </span>
            <span className="flex items-center gap-2">
              <BadgeCheck className="size-4 text-primary" /> No laboratory needed on site
            </span>
          </div>
        </div>
        <div className="overflow-hidden rounded-3xl border border-border shadow-lift">
          <img
            src={heroImage}
            alt="Dairy farmer holding cattle feed pellets in a green field"
            width={1600}
            height={1008}
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <h2 className="font-display text-2xl font-semibold">What KrishiFeed AI checks</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Card key={f.title}>
              <CardContent className="space-y-3">
                <span className="grid size-10 place-items-center rounded-xl bg-secondary text-secondary-foreground">
                  <f.icon className="size-5" />
                </span>
                <h3 className="font-display text-base font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="rounded-3xl bg-gradient-leaf p-8 text-primary-foreground sm:p-12">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            One sample. Six steps. A clear answer.
          </h2>
          <p className="mt-3 max-w-2xl opacity-90">
            Farmer details, sample registration, photo capture, sensor readings, AI analysis and a
            shareable report with a traceability code.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-6">
            <Link to="/new-test">Start New Test</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        KrishiFeed AI prototype — all readings, scores and advisories shown are simulated demo data.
      </footer>
    </div>
  );
}
