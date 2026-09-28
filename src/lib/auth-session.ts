import { supabase } from "@/integrations/supabase/client";

const DEMO_SESSION_KEY = "krishifeed.demo-session.v1";

export function hasDemoSession() {
  return typeof window !== "undefined" && sessionStorage.getItem(DEMO_SESSION_KEY) === "active";
}

export function startDemoSession() {
  sessionStorage.setItem(DEMO_SESSION_KEY, "active");
}

export function clearDemoSession() {
  if (typeof window !== "undefined") sessionStorage.removeItem(DEMO_SESSION_KEY);
}

export async function hasAppAccess() {
  if (hasDemoSession()) return true;
  const { data, error } = await supabase.auth.getUser();
  return !error && Boolean(data.user);
}