import type {
  AiAnomaliesResponse,
  CapacitySummary,
  CenterApiData,
  MoroccoHolidaysResponse,
  TrainerApiData,
} from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      cache: 'no-store',
      ...options,
      headers,
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new ApiError(res.status, errJson.detail || `HTTP ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(0, err instanceof Error ? err.message : 'Network failure');
  }
}

export async function fetchCapacitySummary(): Promise<CapacitySummary | null> {
  try {
    return await apiFetch<CapacitySummary>('/capacity/summary');
  } catch (err) {
    console.error('Failed to fetch capacity summary from FastAPI:', err);
    return null;
  }
}

export async function fetchTrainers(): Promise<TrainerApiData[]> {
  try {
    return await apiFetch<TrainerApiData[]>('/trainers/');
  } catch (err) {
    console.error('Failed to fetch trainers from FastAPI:', err);
    return [];
  }
}

export async function createTrainer(data: { name: string; email: string; center: string; domain: string; role?: string }): Promise<TrainerApiData> {
  return apiFetch<TrainerApiData>('/trainers/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function fetchAiAnomalies(): Promise<AiAnomaliesResponse> {
  try {
    return await apiFetch<AiAnomaliesResponse>('/ai/detect-anomalies');
  } catch (err) {
    console.error('Failed to fetch AI anomalies:', err);
    return { status: 'error', count: 0, anomalies: [] };
  }
}

export async function fetchCenters(): Promise<CenterApiData[]> {
  try {
    return await apiFetch<CenterApiData[]>('/centers/');
  } catch (err) {
    console.error('Failed to fetch centers from FastAPI:', err);
    return [];
  }
}

export async function fetchMoroccoHolidays(year: number = 2026): Promise<MoroccoHolidaysResponse> {
  try {
    return await apiFetch<MoroccoHolidaysResponse>(`/calendar/auto-holidays?year=${year}`);
  } catch (err) {
    console.error('Failed to fetch Morocco holidays from FastAPI:', err);
    return { status: 'fallback', year, count: 0, holidays: [] };
  }
}

export async function fetchSessions() {
  try {
    return await apiFetch<any[]>('/sessions/');
  } catch (err) {
    console.error('Failed to fetch sessions from FastAPI:', err);
    return null;
  }
}

export async function createSessionApi(sessionData: any) {
  return apiFetch<any>('/sessions/', {
    method: 'POST',
    body: JSON.stringify(sessionData),
  });
}

export async function updateSessionApi(sessionId: string, sessionData: any) {
  return apiFetch<any>(`/sessions/${sessionId}`, {
    method: 'PUT',
    body: JSON.stringify(sessionData),
  });
}

export async function deleteSessionApi(sessionId: string) {
  return apiFetch<any>(`/sessions/${sessionId}`, {
    method: 'DELETE',
  });
}

export async function loginApi(credentials: { email: string; password: string }) {
  return apiFetch<{ access_token: string; token_type: string; user: any }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function deleteTrainerApi(trainerId: string | number) {
  return apiFetch<{ message: string }>(`/trainers/${trainerId}`, {
    method: 'DELETE',
  });
}
