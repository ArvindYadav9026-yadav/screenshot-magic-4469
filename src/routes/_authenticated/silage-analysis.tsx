import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/silage-analysis")({
  head: () => ({
    meta: [
      { title: "Silage Analysis — KrishiFeed AI" },
      { name: "description", content: "Fermentation quality, pH profile and spoilage risk." },
      { property: "og:title", content: "Silage Analysis — KrishiFeed AI" },
      { property: "og:description", content: "Fermentation quality, pH profile and spoilage risk." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SilageAnalysisPage,
});

function SilageAnalysisPage() {
  return (
    <AppShell title="Silage Analysis" subtitle="Fermentation quality, pH profile and spoilage risk.">
      <Card>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Fermentation quality, pH profile and spoilage risk.</p>
          <Button asChild className="min-h-11 w-full sm:w-auto">
            <Link to="/new-test">Start a new test</Link>
          </Button>
        </CardContent>
      </Card>
    </AppShell>
  );
}
