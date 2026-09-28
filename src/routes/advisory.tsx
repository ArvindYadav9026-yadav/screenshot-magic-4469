import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/advisory")({
  head: () => ({
    meta: [
      { title: "Farmer Advisory — KrishiFeed AI" },
      { name: "description", content: "Feeding advice for farmers based on their latest test results." },
      { property: "og:title", content: "Farmer Advisory — KrishiFeed AI" },
      { property: "og:description", content: "Feeding advice for farmers based on their latest test results." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FarmerAdvisoryPage,
});

function FarmerAdvisoryPage() {
  return (
    <AppShell title="Farmer Advisory" subtitle="Feeding advice for farmers based on their latest test results.">
      <Card>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Feeding advice for farmers based on their latest test results.</p>
          <Button asChild className="min-h-11 w-full sm:w-auto">
            <Link to="/new-test">Start a new test</Link>
          </Button>
        </CardContent>
      </Card>
    </AppShell>
  );
}
