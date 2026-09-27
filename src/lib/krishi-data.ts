export type Language = "English" | "हिंदी" | "Bengali" | "Tamil" | "Haryanvi" | "Kannada";

export const LANGUAGES: Language[] = [
  "English",
  "हिंदी",
  "Bengali",
  "Tamil",
  "Haryanvi",
  "Kannada",
];

export type Farmer = {
  id: string;
  name: string;
  phone: string;
  farm_name: string;
  location: string;
  language: Language;
  cattle_count: number | null;
  created_at: string;
};

export type SampleType = "Feed" | "Silage";

export type Sample = {
  id: string;
  farmer_id: string;
  sample_type: SampleType;
  material: string;
  batch_number: string;
  qr_code: string;
  image_url: string | null;
  created_at: string;
};

export type SensorReadings = {
  moisture: number;
  ph: number;
  temperature: number;
  humidity: number;
  nir: string;
};

export type AnalysisResult = {
  quality_score: number;
  status: string;
  nutrition: { label: string; value: string }[];
  contamination: { label: string; risk: "Low Risk" | "Moderate Risk" | "Screening Required" }[];
  confidence: { label: string; value: number }[];
  advisory: string[];
};

export type TestRecord = {
  id: string;
  farmer: Farmer;
  sample: Sample;
  sensors: SensorReadings;
  result: AnalysisResult;
  created_at: string;
  synced: boolean;
};

export const FEED_MATERIALS = [
  "Compound Cattle Feed",
  "Cotton Seed Cake",
  "Maize Grain",
  "Wheat Bran",
  "Groundnut Cake",
  "Total Mixed Ration",
];

export const SILAGE_MATERIALS = [
  "Maize Silage",
  "Sorghum Silage",
  "Napier Silage",
  "Oat Silage",
  "Bajra Silage",
];

export const DEMO_SENSORS: SensorReadings = {
  moisture: 9.2,
  ph: 4.8,
  temperature: 27,
  humidity: 62,
  nir: "Complete",
};

export const SENSOR_DEVICES = [
  { name: "NIR Spectrometer", detail: "KF-NIR 1200 · 900–1700 nm" },
  { name: "Moisture Sensor", detail: "Capacitive probe · ±0.3%" },
  { name: "pH Sensor", detail: "Glass electrode · ±0.05 pH" },
  { name: "Temperature Sensor", detail: "PT-100 · ±0.2 °C" },
  { name: "Humidity Sensor", detail: "Digital RH · ±2%" },
];

export const AI_PIPELINE = [
  "Image preprocessing",
  "Computer vision analysis",
  "NIR spectral analysis",
  "Sensor analysis",
  "Feature fusion",
  "AI prediction",
  "Advisory generation",
];

export const NIR_SPECTRUM = Array.from({ length: 34 }, (_, i) => {
  const wavelength = 900 + i * 24;
  const base =
    0.42 +
    0.24 * Math.sin((i / 33) * Math.PI * 1.6) +
    0.1 * Math.sin((i / 33) * Math.PI * 5.2) +
    0.04 * Math.cos((i / 33) * Math.PI * 9);
  return { wavelength, absorbance: Number(base.toFixed(3)) };
});

export function makeId(prefix: string) {
  const n = Math.floor(Math.random() * 90000) + 10000;
  return `${prefix}-2026-${n}`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function buildResult(type: SampleType, sensors: SensorReadings): AnalysisResult {
  if (type === "Silage") {
    return {
      quality_score: 82,
      status: "GOOD FERMENTATION",
      nutrition: [
        { label: "Dry Matter", value: "32.6%" },
        { label: "Crude Protein", value: "8.4%" },
        { label: "Lactic Acid", value: "6.2% DM" },
        { label: "pH", value: `${sensors.ph}` },
        { label: "Ammonia-N", value: "7.1% of total N" },
        { label: "Energy", value: "2,480 kcal/kg" },
      ],
      contamination: [
        { label: "Butyric Fermentation", risk: "Low Risk" },
        { label: "Yeast / Mould", risk: "Moderate Risk" },
        { label: "Soil / Ash Contamination", risk: "Low Risk" },
        { label: "Mycotoxin", risk: "Screening Required" },
      ],
      confidence: [
        { label: "Dry matter prediction", value: 93 },
        { label: "Fermentation profile", value: 90 },
        { label: "Spoilage screening", value: 85 },
      ],
      advisory: [
        "Fermentation is well settled — pH 4.8 is within the safe range for maize silage.",
        "Seal the pit face tightly after every feeding to limit yeast and mould growth.",
        "Feed out at least 15 cm of the face daily to keep the silage stable.",
        "Mix with 1.5 kg dry fodder per animal to balance the ration.",
      ],
    };
  }
  return {
    quality_score: 86,
    status: "GOOD QUALITY",
    nutrition: [
      { label: "Crude Protein", value: "18.4%" },
      { label: "Moisture", value: `${sensors.moisture}%` },
      { label: "Fibre", value: "13.8%" },
      { label: "Energy", value: "3,150 kcal/kg" },
      { label: "Mineral Status", value: "Normal" },
      { label: "Ash", value: "8.1%" },
    ],
    contamination: [
      { label: "Urea Adulteration", risk: "Low Risk" },
      { label: "Sand / Silica", risk: "Low Risk" },
      { label: "Fungal Contamination", risk: "Low Risk" },
      { label: "Mycotoxin", risk: "Screening Required" },
    ],
    confidence: [
      { label: "Protein prediction", value: 92 },
      { label: "Moisture prediction", value: 95 },
      { label: "Adulteration screening", value: 87 },
    ],
    advisory: [
      "Protein at 18.4% suits mid-lactation cattle — feed 4 to 5 kg per animal per day.",
      "Moisture is low at 9.2%, so the batch stores well. Keep bags off the floor.",
      "Add a mineral mixture of 50 g per animal per day to support milk yield.",
      "Send a sample for laboratory mycotoxin confirmation before bulk purchase.",
    ],
  };
}

const demoFarmers: Farmer[] = [
  {
    id: "FR-1001",
    name: "Ramesh Patil",
    phone: "9876543210",
    farm_name: "Patil Dairy Farm",
    location: "Shirur, Pune",
    language: "English",
    cattle_count: 24,
    created_at: "2026-09-18T09:20:00.000Z",
  },
  {
    id: "FR-1002",
    name: "Sunita Devi",
    phone: "9812233445",
    farm_name: "Devi Gaushala",
    location: "Rohtak, Haryana",
    language: "Haryanvi",
    cattle_count: 41,
    created_at: "2026-09-20T06:05:00.000Z",
  },
  {
    id: "FR-1003",
    name: "Murugan S",
    phone: "9791122334",
    farm_name: "Kaveri Milk Farm",
    location: "Erode, Tamil Nadu",
    language: "Tamil",
    cattle_count: 17,
    created_at: "2026-09-23T11:40:00.000Z",
  },
];

export const DEMO_TESTS: TestRecord[] = [
  {
    id: "FD-2026-00124",
    farmer: demoFarmers[0],
    sample: {
      id: "FD-2026-00124",
      farmer_id: "FR-1001",
      sample_type: "Feed",
      material: "Compound Cattle Feed",
      batch_number: "BT-4471",
      qr_code: "KF-FD-00124",
      image_url: null,
      created_at: "2026-09-26T05:30:00.000Z",
    },
    sensors: DEMO_SENSORS,
    result: buildResult("Feed", DEMO_SENSORS),
    created_at: "2026-09-26T05:30:00.000Z",
    synced: true,
  },
  {
    id: "SL-2026-00089",
    farmer: demoFarmers[1],
    sample: {
      id: "SL-2026-00089",
      farmer_id: "FR-1002",
      sample_type: "Silage",
      material: "Maize Silage",
      batch_number: "BT-3390",
      qr_code: "KF-SL-00089",
      image_url: null,
      created_at: "2026-09-24T08:10:00.000Z",
    },
    sensors: { moisture: 33.4, ph: 4.8, temperature: 29, humidity: 71, nir: "Complete" },
    result: buildResult("Silage", { moisture: 33.4, ph: 4.8, temperature: 29, humidity: 71, nir: "Complete" }),
    created_at: "2026-09-24T08:10:00.000Z",
    synced: true,
  },
  {
    id: "FD-2026-00121",
    farmer: demoFarmers[2],
    sample: {
      id: "FD-2026-00121",
      farmer_id: "FR-1003",
      sample_type: "Feed",
      material: "Cotton Seed Cake",
      batch_number: "BT-4468",
      qr_code: "KF-FD-00121",
      image_url: null,
      created_at: "2026-09-23T12:00:00.000Z",
    },
    sensors: { moisture: 11.6, ph: 6.2, temperature: 31, humidity: 58, nir: "Complete" },
    result: {
      ...buildResult("Feed", { moisture: 11.6, ph: 6.2, temperature: 31, humidity: 58, nir: "Complete" }),
      quality_score: 64,
      status: "NEEDS ATTENTION",
    },
    created_at: "2026-09-23T12:00:00.000Z",
    synced: false,
  },
];

export const DEMO_FARMERS = demoFarmers;
