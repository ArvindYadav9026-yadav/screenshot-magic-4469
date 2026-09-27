import { Check } from "lucide-react";
import { useKrishi } from "@/lib/krishi-store";
import { cn } from "@/lib/utils";

export const STEPS = [
  "Farmer Details",
  "New Test",
  "Capture Sample",
  "Sensor Data",
  "AI Analysis",
  "Results",
] as const;

export function TestStepper() {
  const { draft, goToStep } = useKrishi();

  return (
    <ol className="card-soft flex gap-2 overflow-x-auto p-3 sm:gap-1 lg:flex-col lg:overflow-visible lg:p-4">
      {STEPS.map((label, i) => {
        const step = i + 1;
        const done = draft.completed.includes(step);
        const active = draft.step === step;
        const unlocked = step === 1 || draft.completed.includes(step - 1);
        return (
          <li key={label} className="shrink-0 lg:w-full">
            <button
              type="button"
              disabled={!unlocked}
              onClick={() => goToStep(step)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                active && "bg-primary text-primary-foreground",
                !active && unlocked && "hover:bg-secondary",
                !unlocked && "cursor-not-allowed opacity-45",
              )}
            >
              <span
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-full border text-xs font-semibold",
                  active && "border-primary-foreground/40 bg-primary-foreground/15",
                  !active && done && "border-success bg-success text-success-foreground",
                  !active && !done && "border-border bg-muted text-muted-foreground",
                )}
              >
                {done && !active ? <Check className="size-4" /> : step}
              </span>
              <span className="whitespace-nowrap font-medium lg:whitespace-normal">{label}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
