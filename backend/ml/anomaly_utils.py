sample_trainers = [
    {"id": 1, "name": "Youssef Benali", "email": "youssef.benali@um6p.ma", "anim": 82.0, "absence": 4.0},
    {"id": 2, "name": "Fatima Zahra El Idrissi", "email": "fatimazahra.elidrissi@um6p.ma", "anim": 168.0, "absence": 12.0},
    {"id": 3, "name": "Karim Tazi", "email": "karim.tazi@um6p.ma", "anim": 64.0, "absence": 2.0},
    {"id": 4, "name": "Nadia Amrani", "email": "nadia.amrani@um6p.ma", "anim": 185.0, "absence": 14.0},
    {"id": 5, "name": "Omar Chraibi", "email": "omar.chraibi@um6p.ma", "anim": 51.0, "absence": 1.0},
    {"id": 6, "name": "Salma Bennis", "email": "salma.bennis@um6p.ma", "anim": 112.0, "absence": 5.0},
]

def format_anomaly_diagnostic(row: dict) -> dict:
    anim_decl = float(row["animation_declared"])
    absence = float(row["absence_days"])
    delta = int(round(anim_decl - 107))
    if anim_decl > 120:
        diagnostic = f"Surcharge critique : {anim_decl:.0f} jours d'animation déclarés (dépasse la cible de 107j de +{delta}j)."
        niveau = "Critique (Surcharge)"
    elif absence > 10 and anim_decl > 100:
        diagnostic = f"Incohérence planning : Volume d'animation élevé ({anim_decl:.0f}j) cumulé avec un taux d'absence important ({absence:.0f}j)."
        niveau = "Attention (Volume/Absence)"
    else:
        diagnostic = f"Profil atypique détecté : Volume global de {anim_decl:.0f} jours d'animation hors des moyennes habituelles du centre."
        niveau = "À auditer"
    return {
        "trainer_id": int(row["trainer_id"]),
        "name": str(row["name"]),
        "email": str(row["email"]),
        "level": niveau,
        "reason": diagnostic,
        "anim_days": int(round(anim_decl)),
        "target_days": 107,
        "delta": delta,
        "metrics": f"Animation : {anim_decl:.0f}j | Absences : {absence:.0f}j",
    }
