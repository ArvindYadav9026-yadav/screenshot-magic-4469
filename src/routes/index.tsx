import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Leaf, LockKeyhole, Phone, ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { clearDemoSession, hasAppAccess, startDemoSession } from "@/lib/auth-session";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    if (typeof window !== "undefined" && (await hasAppAccess())) {
      throw redirect({ to: "/dashboard" });
    }
  },
  head: () => ({
    meta: [
      { title: "Login — KrishiFeed AI" },
      {
        name: "description",
        content: "Sign in to KrishiFeed AI or continue in Demo Mode to explore feed and silage intelligence.",
      },
      { property: "og:title", content: "Login — KrishiFeed AI" },
      {
        property: "og:description",
        content: "Secure access to KrishiFeed AI feed and silage quality testing.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const normalizedPhone = phone.replace(/[\s()-]/g, "");

    if (!/^\+[1-9]\d{7,14}$/.test(normalizedPhone)) {
      setError("Enter a valid phone number with country code, for example +91 98765 43210.");
      return;
    }
    if (!password) {
      setError("Enter your password.");
      return;
    }

    setSubmitting(true);
    clearDemoSession();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      phone: normalizedPhone,
      password,
    });
    setSubmitting(false);

    if (signInError) {
      setError("The phone number or password is incorrect.");
      return;
    }
    await navigate({ to: "/dashboard", replace: true });
  }

  async function handleDemo() {
    clearDemoSession();
    await supabase.auth.signOut();
    startDemoSession();
    await navigate({ to: "/dashboard", replace: true });
  }

  return (
    <main className="grid min-h-screen bg-gradient-field lg:grid-cols-[minmax(0,1fr)_minmax(25rem,0.78fr)]">
      <section className="hidden min-h-screen flex-col justify-between bg-sidebar p-10 text-sidebar-foreground lg:flex xl:p-14">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
            <Leaf className="size-6" />
          </span>
          <div>
            <p className="font-display text-xl font-semibold">KrishiFeed AI</p>
            <p className="text-xs tracking-wide text-sidebar-foreground/65">FEED &amp; SILAGE INTELLIGENCE</p>
          </div>
        </div>
        <div className="max-w-xl pb-12">
          <p className="font-display text-4xl font-semibold leading-tight xl:text-5xl">
            Better feed decisions begin with a reliable test.
          </p>
          <p className="mt-5 max-w-lg text-base leading-7 text-sidebar-foreground/75">
            Field-ready feed and silage analysis for clear nutrition, quality, and farmer advisory results.
          </p>
        </div>
        <p className="text-xs text-sidebar-foreground/55">Secure field intelligence for dairy teams.</p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-8 lg:px-12">
        <div className="w-full max-w-md">
          <div className="mb-9 flex items-center gap-3 lg:hidden">
            <span className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Leaf className="size-6" />
            </span>
            <div>
              <p className="font-display text-xl font-semibold">KrishiFeed AI</p>
              <p className="text-xs tracking-wide text-muted-foreground">FEED &amp; SILAGE INTELLIGENCE</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
            <h1 className="font-display text-3xl font-semibold">Welcome back</h1>
            <p className="mt-2 text-sm text-muted-foreground">Sign in to continue to your dashboard.</p>

            <form className="mt-7 space-y-5" onSubmit={handleLogin} noValidate>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+91 98765 43210" value={phone} onChange={(event) => setPhone(event.target.value)} className="h-12 pl-10" aria-invalid={Boolean(error)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 px-10" aria-invalid={Boolean(error)} />
                  <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 size-10 -translate-y-1/2" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
              </div>

              {error ? <p className="text-sm font-medium text-destructive" role="alert">{error}</p> : null}

              <Button type="submit" className="h-12 w-full" disabled={submitting}>
                {submitting ? "Signing in…" : "Login"}
              </Button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs font-medium uppercase text-muted-foreground">or</span>
              <Separator className="flex-1" />
            </div>

            <Button type="button" variant="secondary" className="h-12 w-full" onClick={handleDemo}>
              <ShieldCheck /> Continue in Demo Mode
            </Button>
            <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
              Explore realistic pre-filled sample data without credentials.
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">Authorized access for KrishiFeed AI field teams.</p>
        </div>
      </section>
    </main>
  );
}
