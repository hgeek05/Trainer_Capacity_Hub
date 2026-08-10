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
