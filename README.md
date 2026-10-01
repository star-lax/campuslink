# CampusLink

## Run the frontend

```powershell
cd C:\campuslink\campuslink
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Run the backend

In another PowerShell window:

```powershell
cd C:\campuslink\campuslink\backend
npm start
```

The API runs at `http://localhost:4000`. Check `http://localhost:4000/api/health`.

The current database is a local JSON file at `backend/data/campuslink.json`. Existing frontend mock data is retained while modules are migrated safely.
