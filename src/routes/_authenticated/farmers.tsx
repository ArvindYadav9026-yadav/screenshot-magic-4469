import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/farmers")({
  head: () => ({
    meta: [
      { title: "Farmer Dashboard — KrishiFeed AI" },
      { name: "description", content: "Farmers registered with their farms, locations and tests." },
      { property: "og:title", content: "Farmer Dashboard — KrishiFeed AI" },
      { property: "og:description", content: "Farmers registered with their farms, locations and tests." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FarmerDashboardPage,
});

function FarmerDashboardPage() {
  return (
    <AppShell title="Farmer Dashboard" subtitle="Farmers registered with their farms, locations and tests.">
      <Card>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Farmers registered with their farms, locations and tests.</p>
          <Button asChild className="min-h-11 w-full sm:w-auto">
            <Link to="/new-test">Start a new test</Link>
          </Button>
        </CardContent>
      </Card>
    </AppShell>
  );
}
