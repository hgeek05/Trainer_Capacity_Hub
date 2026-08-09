from __future__ import annotations


WEEK_COEFFICIENTS = {
    "neutralized": 0.0,
    "very_low": 0.25,
    "low": 0.50,
    "normal": 1.00,
}


def calculate_animation_capacity(global_capacity: float, week_type: str) -> float:
    """Apply the week coefficient to the available capacity."""
    coefficient = WEEK_COEFFICIENTS.get(week_type, 1.0)
    return global_capacity * coefficient


def check_animation_alert(declared_animation_days: float, week_type: str) -> str:
    """Return the alert state for an animation declaration."""
    coefficient = WEEK_COEFFICIENTS.get(week_type, 1.0)

    if coefficient == 0.0 and declared_animation_days > 0:
        return "Bloquée"
    if declared_animation_days > (178 * 0.6 / 365) * 5:
        return "Surveille"

    return "Normale"


def get_week_status_label(week_type: str) -> str:
    labels = {
        "neutralized": "Bloquée",
        "very_low": "Très réduite",
        "low": "Réduite",
        "normal": "Normale",
    }
    return labels.get(week_type, "Normale")


def get_current_week_type(month: int) -> str:
    if month in (7, 8):
        return "neutralized"
    return "normal"