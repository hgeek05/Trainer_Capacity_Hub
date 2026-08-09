const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface CapacitySummary {
  capacite_globale_nette: number;
  jours_favorables_animation: number;
  cible_animation: number;
  fenetres_bloquees: number;
  hors_animation_cible: number;
}

export interface TrainerApiData {
  id?: number | string;
  employee_id?: string;
  formateur_id?: string;
  name: string;
  email?: string;
  role?: string;
  center?: string;
  domain?: string;
  global_days?: string;
  animation_days?: string;
  global_used?: number;
  global_total?: number;
  anim_used?: number;
  anim_total?: number;
  statut_fenetre?: string;
  taux?: number;
  alerte?: string;
  status?: 'ok' | 'watch' | 'blocked';
}

export interface AiAnomaly {
  trainer_id: number;
  name: string;
  email?: string;
  level: string;
  reason: string;
  anim_days?: number;
  target_days?: number;
  delta?: number;
  metrics: string;
}

export interface AiAnomaliesResponse {
  status: string;
  count: number;
  anomalies: AiAnomaly[];
}

export interface CenterApiData {
  id: number;
  nom_centre: string;
}

export interface MoroccoHoliday {
  date: string;
  name: string;
  type: string;
  status: string;
}

export interface MoroccoHolidaysResponse {
  status: string;
  year: number;
  count: number;
  holidays: MoroccoHoliday[];
}

export async function fetchCapacitySummary(): Promise<CapacitySummary | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/capacity/summary`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch capacity summary from FastAPI:', err);
    return null;
  }
}

export async function fetchTrainers(): Promise<TrainerApiData[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/trainers/`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch trainers from FastAPI:', err);
    return [];
  }
}

export async function createTrainer(data: {
  name: string;
  email: string;
  center: string;
  domain: string;
  role?: string;
}): Promise<TrainerApiData | null> {
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
    const res = await fetch(`${API_BASE_URL}/ai/detect-anomalies`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch AI anomalies:', err);
    return { status: 'error', count: 0, anomalies: [] };
  }
}

export async function fetchCenters(): Promise<CenterApiData[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/centers/`, {
      cache: 'no-store',
    });
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
    const res = await fetch(`${API_BASE_URL}/calendar/auto-holidays?year=${year}`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch Morocco holidays from FastAPI:', err);
    return {
      status: 'fallback',
      year,
      count: 0,
      holidays: [],
    };
  }
}
