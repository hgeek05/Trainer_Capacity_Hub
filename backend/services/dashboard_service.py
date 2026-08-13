from __future__ import annotations

from collections import defaultdict
from datetime import date

from sqlalchemy.orm import Session

import models
from services.capacity_calculator import get_capacity_summary
from services.rules_engine import check_animation_alert, get_current_week_type, get_week_status_label

def _format_days(value: float, total: int) -> str:
    return f"{int(round(value))}/{int(total)} j"

def _inclusive_days(start_date: date | None, end_date: date | None) -> float:
    if start_date is None or end_date is None:
        return 0.0
    if end_date < start_date:
        return 0.0
    return float((end_date - start_date).days + 1)

def get_trainer_dashboard_items(db: Session) -> list[dict]:
    summary = get_capacity_summary()
    week_type = get_current_week_type(date.today().month)
    week_label = get_week_status_label(week_type)

    formateur_role_id = db.query(models.Role.id).filter(models.Role.nom_role == "Formateur").scalar()
    if formateur_role_id is None:
        return []

    user_rows = (
        db.query(models.User, models.Profile)
        .filter(models.User.is_active.is_(True), models.User.role_id == formateur_role_id)
        .outerjoin(models.Profile, models.Profile.user_id == models.User.id)
        .all()
    )

    activity_rows = (
        db.query(models.Activity.trainer_id, models.Activity.duration_days, models.ActivityType.nom_type)
        .join(models.ActivityType, models.Activity.activity_type_id == models.ActivityType.id)
        .all()
    )

    leave_rows = db.query(models.Leave.user_id, models.Leave.start_date, models.Leave.end_date).all()

    target_rows = db.query(models.CapacityTarget.user_id, models.CapacityTarget.available_capacity_days).all()

    declared_capacity_by_user: defaultdict[int, float] = defaultdict(float)
    declared_animation_by_user: defaultdict[int, float] = defaultdict(float)
    for trainer_id, duration_days, activity_type_name in activity_rows:
        declared_capacity_by_user[trainer_id] += float(duration_days or 0.0)
        if activity_type_name == "Animation":
            declared_animation_by_user[trainer_id] += float(duration_days or 0.0)

    absence_by_user: defaultdict[int, float] = defaultdict(float)
    for user_id, start_date, end_date in leave_rows:
        absence_by_user[user_id] += _inclusive_days(start_date, end_date)

    target_capacity_by_user = {
        user_id: float(available_capacity_days or summary["capacite_globale_nette"])
        for user_id, available_capacity_days in target_rows
    }

    items: list[dict] = []
    for user, profile in user_rows:
        total_capacity = int(target_capacity_by_user.get(user.id, summary["capacite_globale_nette"]))
        declared_capacity = declared_capacity_by_user.get(user.id, 0.0)
        declared_animation = declared_animation_by_user.get(user.id, 0.0)
        taux = int(round((declared_capacity / total_capacity) * 100)) if total_capacity else 0

        items.append(
            {
                "formateur_id": user.employee_id,
                "global_days": _format_days(declared_capacity, total_capacity),
                "animation_days": _format_days(declared_animation, summary["cible_animation"]),
                "statut_fenetre": week_label,
                "taux": taux,
                "alerte": check_animation_alert(declared_animation, week_type),
            }
        )

    return items
