import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/cloud")({
  head: () => ({
    meta: [
      { title: "Cloud Dashboard — KrishiFeed AI" },
      { name: "description", content: "Sync status of tests uploaded to the cloud." },
      { property: "og:title", content: "Cloud Dashboard — KrishiFeed AI" },
      { property: "og:description", content: "Sync status of tests uploaded to the cloud." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CloudDashboardPage,
});

function CloudDashboardPage() {
  return (
    <AppShell title="Cloud Dashboard" subtitle="Sync status of tests uploaded to the cloud.">
      <Card>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Sync status of tests uploaded to the cloud.</p>
          <Button asChild className="min-h-11 w-full sm:w-auto">
            <Link to="/new-test">Start a new test</Link>
          </Button>
        </CardContent>
      </Card>
    </AppShell>
  );
}
