import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/feed-analysis")({
  head: () => ({
    meta: [
      { title: "Feed Analysis — KrishiFeed AI" },
      { name: "description", content: "Nutrition and adulteration results for concentrate feed batches." },
      { property: "og:title", content: "Feed Analysis — KrishiFeed AI" },
      { property: "og:description", content: "Nutrition and adulteration results for concentrate feed batches." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FeedAnalysisPage,
});

function FeedAnalysisPage() {
  return (
    <AppShell title="Feed Analysis" subtitle="Nutrition and adulteration results for concentrate feed batches.">
      <Card>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Nutrition and adulteration results for concentrate feed batches.</p>
          <Button asChild className="min-h-11 w-full sm:w-auto">
            <Link to="/new-test">Start a new test</Link>
          </Button>
        </CardContent>
      </Card>
    </AppShell>
  );
}
