import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  CloudUpload,
  FlaskConical,
  Leaf,
  LayoutDashboard,
  MessageSquareHeart,
  Menu,
  Sprout,
  Users,
  Wheat,
  History,
  FileText,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { useKrishi } from "@/lib/krishi-store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/new-test", label: "New Test", icon: FlaskConical },
  { to: "/feed-analysis", label: "Feed Analysis", icon: Wheat },
  { to: "/silage-analysis", label: "Silage Analysis", icon: Sprout },
  { to: "/sensors", label: "Sensor Monitoring", icon: Activity },
  { to: "/advisory", label: "Farmer Advisory", icon: MessageSquareHeart },
  { to: "/farmers", label: "Farmer Dashboard", icon: Users },
  { to: "/history", label: "Test History", icon: History },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/cloud", label: "Cloud Dashboard", icon: CloudUpload },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active = pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "grid grid-cols-[1rem_minmax(0,1fr)] items-center gap-x-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground/85 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <span className="grid size-4 place-items-center">
              <item.icon className="size-4" />
            </span>
            <span className="min-w-0">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <Link to="/" className="grid grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-x-2.5">
      <span className="grid size-9 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
        <Leaf className="size-5" />
      </span>
      <span className="min-w-0 leading-tight">
        <span className="block font-display text-base font-semibold text-sidebar-foreground">
          KrishiFeed AI
        </span>
        <span className="block text-[0.68rem] tracking-wide text-sidebar-foreground/60">
          FEED &amp; SILAGE INTELLIGENCE
        </span>
      </span>
    </Link>
  );
}

export function AppShell({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  const { online, setOnline } = useKrishi();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background lg:flex">
      <aside className="sticky top-0 hidden h-screen w-[17rem] shrink-0 flex-col justify-between bg-sidebar p-5 lg:flex">
        <div className="space-y-7">
          <Brand />
          <NavList />
        </div>
        <div className="rounded-xl bg-sidebar-accent p-3 text-xs text-sidebar-accent-foreground">
          <p className="font-semibold">Demo Mode</p>
          <p className="mt-1 opacity-80">All readings and results are simulated prototype data.</p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-border bg-card/85 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3.5 sm:px-6">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[17rem] border-none bg-sidebar p-5">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <div className="space-y-7">
                  <Brand />
                  <NavList onNavigate={() => setOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>

            <div className="min-w-0 flex-1">
              <h1 className="truncate font-display text-lg font-semibold sm:text-xl">{title}</h1>
              {subtitle ? (
                <p className="truncate text-xs text-muted-foreground sm:text-sm">{subtitle}</p>
              ) : null}
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              <span className="stat-label">{online ? "Online" : "Offline"}</span>
              <Switch checked={online} onCheckedChange={setOnline} aria-label="Toggle offline mode" />
            </div>
            <Badge variant="secondary" className="hidden shrink-0 md:inline-flex">
              Demo Mode
            </Badge>
            {action}
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
