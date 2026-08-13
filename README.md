# Trainer_Capacity_Hub

## Mock data

Run the trainer seeder from the repository root:

```powershell
python generate_mock_data.py
```

This launcher uses `localhost:5432` by default when `DATABASE_URL` is not set, which is convenient for running against Postgres exposed on the host. Inside Docker, the backend still uses the container hostname `db` from the environment.
