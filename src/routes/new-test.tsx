import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CheckCircle2,
  Cpu,
  Image as ImageIcon,
  Loader2,
  QrCode as QrIcon,
  RefreshCw,
  Save,
  Upload,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { QrCode } from "@/components/QrCode";
import { FarmerSummary, ResultPanel } from "@/components/ResultPanel";
import { STEPS, TestStepper } from "@/components/TestStepper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AI_PIPELINE,
  DEMO_SENSORS,
  FEED_MATERIALS,
  LANGUAGES,
  SENSOR_DEVICES,
  SILAGE_MATERIALS,
  buildResult,
  formatDate,
  makeId,
  type Language,
  type SampleType,
  type TestRecord,
} from "@/lib/krishi-data";
import { useKrishi } from "@/lib/krishi-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/new-test")({
  head: () => ({
    meta: [
      { title: "New Test — KrishiFeed AI" },
      {
        name: "description",
        content:
          "Run a six-step feed or silage test: farmer details, sample registration, photo capture, sensor readings, AI analysis and results.",
      },
      { property: "og:title", content: "New Test — KrishiFeed AI" },
      {
        property: "og:description",
        content: "Six guided steps from farmer details to a shareable quality report.",
      },
    ],
  }),
  component: NewTest,
});

function NewTest() {
  const { draft } = useKrishi();
  const step = draft.step;

  return (
    <AppShell
      title={step === 1 ? "Farmer Details" : STEPS[step - 1]}
      subtitle={
        step === 1
          ? "Enter farmer information before starting the test."
          : step === 2
            ? "Select and register your feed or silage sample."
            : `Step ${step} of 6 — ${STEPS[step - 1]}`
      }
    >
      <div className="grid gap-6 lg:grid-cols-[15rem_1fr] [&>*]:min-w-0">
        <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <TestStepper />
        </div>
        <div>
          {step === 1 && <StepFarmer />}
          {step === 2 && <StepSample />}
          {step === 3 && <StepCapture />}
          {step === 4 && <StepSensors />}
          {step === 5 && <StepAnalysis />}
          {step === 6 && <StepResults />}
        </div>
      </div>
    </AppShell>
  );
}

/* ---------------- Step 1 — Farmer Details ---------------- */

function StepFarmer() {
  const { draft, patchFarmer, completeStep } = useKrishi();
  const f = draft.farmer;
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = () => {
    const next: Record<string, string> = {};
    if (!f.name.trim()) next.name = "Farmer name is required.";
    if (!f.farm_name.trim()) next.farm_name = "Farm name is required.";
    if (!f.location.trim()) next.location = "Village or location is required.";
    if (!f.skip_phone && !/^\d{10}$/.test(f.phone.trim()))
      next.phone = "Enter a 10-digit phone number, or choose to continue without phone.";
    if (!f.consent) next.consent = "Please agree to save these details for this test.";
    setErrors(next);
    if (Object.keys(next).length) return;
    completeStep(1);
    toast.success("Farmer details saved for this test");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Farmer Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Farmer Name" error={errors.name}>
            <Input
              className="h-12"
              placeholder="Enter farmer name"
              value={f.name}
              onChange={(e) => patchFarmer({ name: e.target.value })}
            />
          </Field>

          <Field label="Phone Number" error={errors.phone}>
            <Input
              className="h-12"
              inputMode="numeric"
              placeholder="Enter phone number"
              disabled={f.skip_phone}
              value={f.phone}
              onChange={(e) => patchFarmer({ phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
            />
            <button
              type="button"
              onClick={() => patchFarmer({ skip_phone: !f.skip_phone, phone: "" })}
              className="mt-2 text-xs font-semibold text-primary underline-offset-4 hover:underline"
            >
              {f.skip_phone ? "Add a phone number instead" : "Continue without phone"}
            </button>
          </Field>

          <Field label="Farm Name" error={errors.farm_name}>
            <Input
              className="h-12"
              placeholder="Enter farm name"
              value={f.farm_name}
              onChange={(e) => patchFarmer({ farm_name: e.target.value })}
            />
          </Field>

          <Field label="Village / Location" error={errors.location}>
            <Input
              className="h-12"
              placeholder="Enter village or location"
              value={f.location}
              onChange={(e) => patchFarmer({ location: e.target.value })}
            />
          </Field>

          <Field label="Preferred Language">
            <Select
              value={f.language}
              onValueChange={(v) => patchFarmer({ language: v as Language })}
            >
              <SelectTrigger className="!h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Number of Cattle">
            <Input
              className="h-12"
              inputMode="numeric"
              placeholder="Enter number of cattle"
              value={f.cattle_count}
              onChange={(e) => patchFarmer({ cattle_count: e.target.value.replace(/\D/g, "") })}
            />
          </Field>
        </div>

        <div className="rounded-xl bg-surface p-4">
          <label className="flex items-start gap-3 text-sm">
            <Checkbox
              checked={f.consent}
              onCheckedChange={(v) => patchFarmer({ consent: Boolean(v) })}
              className="mt-0.5"
            />
            <span>I agree to save these details for this test.</span>
          </label>
          {errors.consent ? (
            <p className="mt-2 text-xs font-medium text-destructive">{errors.consent}</p>
          ) : null}
        </div>

        <Button size="lg" className="h-13 w-full text-base" onClick={submit}>
          Continue to New Test <ArrowRight className="size-4" />
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Farmer information will be linked to this test and included in the final report.
        </p>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="mb-2 block text-sm font-semibold">{label}</Label>
      {children}
      {error ? <p className="mt-1.5 text-xs font-medium text-destructive">{error}</p> : null}
    </div>
  );
}

/* ---------------- Step 2 — New Test / Sample ---------------- */

function StepSample() {
  const { draft, patchSample, completeStep, goToStep } = useKrishi();
  const s = draft.sample;
  const materials = s.sample_type === "Feed" ? FEED_MATERIALS : SILAGE_MATERIALS;

  const submit = () => {
    const id = s.sample_id.trim() || makeId(s.sample_type === "Feed" ? "FD" : "SL");
    patchSample({
      sample_id: id,
      material: s.material || materials[0],
      batch_number: s.batch_number || `BT-${Math.floor(Math.random() * 9000) + 1000}`,
      qr_code: s.qr_code || `KF-${id}`,
    });
    completeStep(2);
  };

  return (
    <div className="space-y-5">
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="stat-label">Farmer</p>
            <p className="font-display text-base font-semibold">{draft.farmer.name}</p>
            <p className="text-sm text-muted-foreground">
              Farm: {draft.farmer.farm_name}
              {draft.farmer.location ? ` · ${draft.farmer.location}` : ""}
            </p>
          </div>
          <Button variant="ghost" onClick={() => goToStep(1)}>
            Edit farmer
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sample Registration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="mb-2 block text-sm font-semibold">Sample Type</Label>
            <div className="grid gap-3 sm:grid-cols-2">
              {(["Feed", "Silage"] as SampleType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => patchSample({ sample_type: t, material: "" })}
                  className={cn(
                    "rounded-2xl border p-4 text-left transition-colors",
                    s.sample_type === t
                      ? "border-primary bg-secondary"
                      : "border-border hover:bg-muted",
                  )}
                >
                  <span className="font-display text-base font-semibold">{t}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {t === "Feed"
                      ? "Concentrate, cake, grain or mixed ration"
                      : "Pit, bunker or baled silage"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Sample ID">
              <Input
                className="h-12"
                placeholder="Leave blank to generate automatically"
                value={s.sample_id}
                onChange={(e) => patchSample({ sample_id: e.target.value.toUpperCase() })}
              />
            </Field>

            <Field label={`${s.sample_type} Type`}>
              <Select
                value={s.material || materials[0]}
                onValueChange={(v) => patchSample({ material: v })}
              >
                <SelectTrigger className="!h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {materials.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Batch Number">
              <Input
                className="h-12"
                placeholder="Enter batch number"
                value={s.batch_number}
                onChange={(e) => patchSample({ batch_number: e.target.value.toUpperCase() })}
              />
            </Field>

            <Field label="QR Code (optional)">
              <div className="flex gap-2">
                <Input
                  className="h-12"
                  placeholder="Scan or enter code"
                  value={s.qr_code}
                  onChange={(e) => patchSample({ qr_code: e.target.value.toUpperCase() })}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 shrink-0"
                  onClick={() => {
                    patchSample({ qr_code: `KF-SCAN-${Math.floor(Math.random() * 9000) + 1000}` });
                    toast.success("Demo QR scanned");
                  }}
                >
                  <QrIcon className="size-4" /> Scan
                </Button>
              </div>
            </Field>

            <Field label="Date / Time">
              <Input className="h-12" readOnly value={new Date(s.created_at).toLocaleString("en-IN")} />
            </Field>
          </div>

          <StepNav
            backLabel="Back to Farmer Details"
            onBack={() => goToStep(1)}
            nextLabel="Continue to Capture Sample"
            onNext={submit}
          />
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------------- Step 3 — Capture Sample ---------------- */

function StepCapture() {
  const { draft, patchDraft, completeStep, goToStep } = useKrishi();
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => patchDraft({ image_url: String(reader.result) });
    reader.readAsDataURL(file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Capture Sample Image</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            variant="outline"
            className="h-24 flex-col gap-2"
            onClick={() => fileRef.current?.click()}
          >
            <Camera className="size-6" /> Open Camera
          </Button>
          <Button
            variant="outline"
            className="h-24 flex-col gap-2"
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="size-6" /> Upload Image
          </Button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />

        <div className="grid place-items-center overflow-hidden rounded-2xl border border-dashed border-border bg-surface p-4">
          {draft.image_url ? (
            <img
              src={draft.image_url}
              alt="Captured sample"
              className="max-h-72 w-full rounded-xl object-cover"
            />
          ) : (
            <div className="py-12 text-center text-sm text-muted-foreground">
              <ImageIcon className="mx-auto mb-3 size-8" />
              No image captured yet
            </div>
          )}
        </div>

        <p className="rounded-xl bg-muted p-3 text-xs text-muted-foreground">
          Ensure the sample is evenly spread and well illuminated.
        </p>

        <StepNav
          backLabel="Back to New Test"
          onBack={() => goToStep(2)}
          nextLabel="Continue to Sensor Data"
          onNext={() => completeStep(3)}
        />
      </CardContent>
    </Card>
  );
}

/* ---------------- Step 4 — Sensor Data ---------------- */

function StepSensors() {
  const { draft, patchDraft, completeStep, goToStep } = useKrishi();
  const sensors = draft.sensors;

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Connected Sensors</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {SENSOR_DEVICES.map((d) => (
            <div
              key={d.name}
              className="flex items-center justify-between gap-3 rounded-xl bg-surface px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold">{d.name}</p>
                <p className="text-xs text-muted-foreground">{d.detail}</p>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-success">
                <span className="size-2 rounded-full bg-success" /> Connected
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Readings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <Button
            size="lg"
            className="w-full"
            onClick={() => {
              patchDraft({ sensors: DEMO_SENSORS });
              toast.success("Demo sensor data loaded");
            }}
          >
            <RefreshCw className="size-4" /> Use Demo Sensor Data
          </Button>

          {sensors ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              <Reading label="Moisture" value={`${sensors.moisture}%`} />
              <Reading label="pH" value={`${sensors.ph}`} />
              <Reading label="Temperature" value={`${sensors.temperature}°C`} />
              <Reading label="Humidity" value={`${sensors.humidity}%`} />
              <Reading label="NIR Scan" value={sensors.nir} />
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No readings captured yet. Load the demo sensor data to continue.
            </p>
          )}

          <Badge variant="outline" className="w-full justify-center py-2">
            Demo Mode — Sensor readings are simulated prototype data.
          </Badge>

          <StepNav
            backLabel="Back to Capture Sample"
            onBack={() => goToStep(3)}
            nextLabel="Continue to AI Analysis"
            nextDisabled={!sensors}
            onNext={() => completeStep(4)}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function Reading({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface px-3 py-2.5">
      <p className="stat-label">{label}</p>
      <p className="font-display text-lg font-semibold">{value}</p>
    </div>
  );
}

/* ---------------- Step 5 — AI Analysis ---------------- */

function StepAnalysis() {
  const { draft, patchDraft, completeStep } = useKrishi();
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + 2);
        setStage(Math.min(AI_PIPELINE.length - 1, Math.floor((next / 100) * AI_PIPELINE.length)));
        return next;
      });
    }, 60);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (progress < 100) return;
    const sensors = draft.sensors ?? DEMO_SENSORS;
    patchDraft({ sensors, result: buildResult(draft.sample.sample_type, sensors) });
    const id = setTimeout(() => completeStep(5), 500);
    return () => clearTimeout(id);
  }, [progress, draft.sensors, draft.sample.sample_type, patchDraft, completeStep]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Cpu className="size-5 text-primary" /> AI Analysis in progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-muted-foreground">Multi-modal fusion model</span>
            <span className="font-display font-semibold">{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>

        <ol className="space-y-2.5">
          {AI_PIPELINE.map((label, i) => {
            const done = i < stage || progress === 100;
            const active = i === stage && progress < 100;
            return (
              <li
                key={label}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm",
                  active ? "bg-secondary font-semibold" : "text-muted-foreground",
                )}
              >
                {done ? (
                  <CheckCircle2 className="size-4 text-success" />
                ) : active ? (
                  <Loader2 className="size-4 animate-spin text-primary" />
                ) : (
                  <span className="size-4 rounded-full border border-border" />
                )}
                {label}
              </li>
            );
          })}
        </ol>

        <p className="text-center text-xs text-muted-foreground">
          Image, NIR spectra and sensor readings are fused to estimate quality. Prototype model.
        </p>
      </CardContent>
    </Card>
  );
}

/* ---------------- Step 6 — Results ---------------- */

function StepResults() {
  const { draft, goToStep, saveTest, resetDraft, online } = useKrishi();
  const navigate = useNavigate();
  const [saved, setSaved] = useState<TestRecord | null>(null);

  if (!draft.result || !draft.sensors) {
    return (
      <Card>
        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">Analysis has not been run yet.</p>
          <Button onClick={() => goToStep(5)}>Run AI Analysis</Button>
        </CardContent>
      </Card>
    );
  }

  const record: TestRecord =
    saved ?? {
      id: draft.sample.sample_id,
      farmer: {
        id: "FR-DRAFT",
        name: draft.farmer.name,
        phone: draft.farmer.skip_phone ? "" : draft.farmer.phone,
        farm_name: draft.farmer.farm_name,
        location: draft.farmer.location,
        language: draft.farmer.language,
        cattle_count: draft.farmer.cattle_count ? Number(draft.farmer.cattle_count) : null,
        created_at: draft.sample.created_at,
      },
      sample: {
        id: draft.sample.sample_id,
        farmer_id: "FR-DRAFT",
        sample_type: draft.sample.sample_type,
        material: draft.sample.material,
        batch_number: draft.sample.batch_number,
        qr_code: draft.sample.qr_code || `KF-${draft.sample.sample_id}`,
        image_url: draft.image_url,
        created_at: draft.sample.created_at,
      },
      sensors: draft.sensors,
      result: draft.result,
      created_at: draft.sample.created_at,
      synced: online,
    };

  return (
    <div className="space-y-5">
      <FarmerSummary record={record} />
      <ResultPanel record={record} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">QR Traceability</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-6">
          <div className="text-primary">
            <QrCode value={record.sample.qr_code} size={132} />
          </div>
          <div className="text-sm">
            <p className="stat-label">Traceability code</p>
            <p className="font-display text-lg font-semibold">{record.sample.qr_code}</p>
            <p className="mt-1 text-muted-foreground">
              Batch {record.sample.batch_number} · {formatDate(record.created_at)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Prototype code — links the batch to this test record.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={() => goToStep(4)}>
          <ArrowLeft className="size-4" /> Back to Sensor Data
        </Button>
        <Button
          onClick={() => {
            const rec = saveTest();
            if (rec) setSaved(rec);
            toast.success(
              online ? "Test saved and synced to cloud" : "Test saved offline — will sync later",
            );
          }}
        >
          <Save className="size-4" /> Save Test
        </Button>
        <Button asChild variant="secondary">
          <Link to="/reports" search={{ test: record.id }}>
            Open full report
          </Link>
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            resetDraft();
            navigate({ to: "/new-test" });
          }}
        >
          Start another test
        </Button>
      </div>
    </div>
  );
}

/* ---------------- shared nav ---------------- */

function StepNav({
  backLabel,
  onBack,
  nextLabel,
  onNext,
  nextDisabled,
}: {
  backLabel: string;
  onBack: () => void;
  nextLabel: string;
  onNext: () => void;
  nextDisabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
      <Button variant="outline" onClick={onBack} className="sm:order-1">
        <ArrowLeft className="size-4" /> {backLabel}
      </Button>
      <Button onClick={onNext} disabled={nextDisabled} className="sm:order-2">
        {nextLabel} <ArrowRight className="size-4" />
      </Button>
    </div>
  );
}
