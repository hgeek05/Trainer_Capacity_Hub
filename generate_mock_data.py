"""Convenience launcher for backend/generate_mock_data.py.

Run this from the repository root with:
    python generate_mock_data.py
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent / "backend"
if str(BACKEND_DIR) not in sys.path:
	sys.path.insert(0, str(BACKEND_DIR))

os.environ.setdefault(
	"DATABASE_URL",
	"postgresql://postgres:postgres@localhost:5432/trainer_capacity_hub",
)

from generate_mock_data import create_fake_trainers  # noqa: E402

if __name__ == "__main__":
	create_fake_trainers(20)
