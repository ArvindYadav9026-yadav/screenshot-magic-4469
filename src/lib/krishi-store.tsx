import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEMO_TESTS,
  type AnalysisResult,
  type Farmer,
  type SampleType,
  type SensorReadings,
  type TestRecord,
} from "./krishi-data";

export type FarmerDraft = {
  name: string;
  phone: string;
  farm_name: string;
  location: string;
  language: Farmer["language"];
  cattle_count: string;
  consent: boolean;
  skip_phone: boolean;
};

export type SampleDraft = {
  sample_type: SampleType;
  material: string;
  sample_id: string;
  batch_number: string;
  qr_code: string;
  created_at: string;
};

export type TestDraft = {
  step: number;
  completed: number[];
  farmer: FarmerDraft;
  sample: SampleDraft;
  image_url: string | null;
  sensors: SensorReadings | null;
  result: AnalysisResult | null;
};

export const emptyFarmerDraft: FarmerDraft = {
  name: "",
  phone: "",
  farm_name: "",
  location: "",
  language: "English",
  cattle_count: "",
  consent: false,
  skip_phone: false,
};

export const emptyDraft: TestDraft = {
  step: 1,
  completed: [],
  farmer: emptyFarmerDraft,
  sample: {
    sample_type: "Feed",
    material: "",
    sample_id: "",
    batch_number: "",
    qr_code: "",
    created_at: new Date().toISOString(),
  },
  image_url: null,
  sensors: null,
  result: null,
};

type Store = {
  draft: TestDraft;
  tests: TestRecord[];
  online: boolean;
  setOnline: (v: boolean) => void;
  patchDraft: (patch: Partial<TestDraft>) => void;
  patchFarmer: (patch: Partial<FarmerDraft>) => void;
  patchSample: (patch: Partial<SampleDraft>) => void;
  goToStep: (step: number) => void;
  completeStep: (step: number) => void;
  resetDraft: () => void;
  saveTest: () => TestRecord | null;
};

const KrishiContext = createContext<Store | null>(null);
const DRAFT_KEY = "krishifeed.draft.v1";
const TESTS_KEY = "krishifeed.tests.v1";

export function KrishiProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<TestDraft>(emptyDraft);
  const [tests, setTests] = useState<TestRecord[]>(DEMO_TESTS);
  const [online, setOnline] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const d = localStorage.getItem(DRAFT_KEY);
      if (d) setDraft({ ...emptyDraft, ...(JSON.parse(d) as TestDraft) });
      const t = localStorage.getItem(TESTS_KEY);
      if (t) setTests(JSON.parse(t) as TestRecord[]);
    } catch {
      /* ignore corrupt local data */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [draft, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem(TESTS_KEY, JSON.stringify(tests));
  }, [tests, hydrated]);

  const patchDraft = useCallback((patch: Partial<TestDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const patchFarmer = useCallback((patch: Partial<FarmerDraft>) => {
    setDraft((prev) => ({ ...prev, farmer: { ...prev.farmer, ...patch } }));
  }, []);

  const patchSample = useCallback((patch: Partial<SampleDraft>) => {
    setDraft((prev) => ({ ...prev, sample: { ...prev.sample, ...patch } }));
  }, []);

  const completeStep = useCallback((step: number) => {
    setDraft((prev) => ({
      ...prev,
      completed: prev.completed.includes(step) ? prev.completed : [...prev.completed, step],
      step: Math.max(prev.step, step + 1),
    }));
  }, []);

  const goToStep = useCallback((step: number) => {
    setDraft((prev) => {
      const unlocked = step === 1 || prev.completed.includes(step - 1);
      return unlocked ? { ...prev, step } : prev;
    });
  }, []);

  const resetDraft = useCallback(() => {
    setDraft({ ...emptyDraft, sample: { ...emptyDraft.sample, created_at: new Date().toISOString() } });
  }, []);

  const saveTest = useCallback((): TestRecord | null => {
    let saved: TestRecord | null = null;
    setDraft((prev) => {
      if (!prev.result || !prev.sensors) return prev;
      const farmer: Farmer = {
        id: `FR-${Math.floor(Math.random() * 9000) + 1000}`,
        name: prev.farmer.name,
        phone: prev.farmer.skip_phone ? "" : prev.farmer.phone,
        farm_name: prev.farmer.farm_name,
        location: prev.farmer.location,
        language: prev.farmer.language,
        cattle_count: prev.farmer.cattle_count ? Number(prev.farmer.cattle_count) : null,
        created_at: new Date().toISOString(),
      };
      const record: TestRecord = {
        id: prev.sample.sample_id,
        farmer,
        sample: {
          id: prev.sample.sample_id,
          farmer_id: farmer.id,
          sample_type: prev.sample.sample_type,
          material: prev.sample.material,
          batch_number: prev.sample.batch_number,
          qr_code: prev.sample.qr_code || `KF-${prev.sample.sample_id}`,
          image_url: prev.image_url,
          created_at: prev.sample.created_at,
        },
        sensors: prev.sensors,
        result: prev.result,
        created_at: new Date().toISOString(),
        synced: online,
      };
      saved = record;
      setTests((list) => (list.some((t) => t.id === record.id) ? list : [record, ...list]));
      return prev;
    });
    return saved;
  }, [online]);

  const value = useMemo<Store>(
    () => ({
      draft,
      tests,
      online,
      setOnline,
      patchDraft,
      patchFarmer,
      patchSample,
      goToStep,
      completeStep,
      resetDraft,
      saveTest,
    }),
    [draft, tests, online, patchDraft, patchFarmer, patchSample, goToStep, completeStep, resetDraft, saveTest],
  );

  return <KrishiContext.Provider value={value}>{children}</KrishiContext.Provider>;
}

export function useKrishi() {
  const ctx = useContext(KrishiContext);
  if (!ctx) throw new Error("useKrishi must be used inside KrishiProvider");
  return ctx;
}
