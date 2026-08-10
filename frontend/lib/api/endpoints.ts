import type {
  AiAnomaliesResponse,
  CapacitySummary,
  CenterApiData,
  MoroccoHolidaysResponse,
  TrainerApiData,
} from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function fetchCapacitySummary(): Promise<CapacitySummary | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/capacity/summary`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch capacity summary from FastAPI:', err);
    return null;
  }
}

export async function fetchTrainers(): Promise<TrainerApiData[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/trainers/`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch trainers from FastAPI:', err);
    return [];
  }
}

export async function createTrainer(data: { name: string; email: string; center: string; domain: string; role?: string }): Promise<TrainerApiData | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/trainers/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.detail || `HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error('Failed to create trainer:', err);
    throw err;
  }
}

export async function fetchAiAnomalies(): Promise<AiAnomaliesResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/ai/detect-anomalies`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch AI anomalies:', err);
    return { status: 'error', count: 0, anomalies: [] };
  }
}

export async function fetchCenters(): Promise<CenterApiData[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/centers/`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch centers from FastAPI:', err);
    return [
      { id: 1, nom_centre: 'Ben Guerir' },
      { id: 2, nom_centre: 'Safi' },
      { id: 3, nom_centre: 'Jorf Lasfar' },
      { id: 4, nom_centre: 'Khouribga' },
    ];
  }
}

export async function fetchMoroccoHolidays(year: number = 2026): Promise<MoroccoHolidaysResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/calendar/auto-holidays?year=${year}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch Morocco holidays from FastAPI:', err);
    return { status: 'fallback', year, count: 0, holidays: [] };
  }
}
