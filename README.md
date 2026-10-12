# The Skill Tracker

The project is split into two independently installable applications:

- `frontend/` - Expo React Native application.
- `backend/` - Express API service.

## First-time setup

Install each app's dependencies:

```powershell
npm --prefix backend install
npm --prefix frontend install
```

Create local environment files:

```powershell
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.example frontend\.env
```

The frontend environment file contains the API URLs currently used by the
mobile app. Keep `frontend/.env` and `backend/.env` local; they are ignored by
Git. Do not commit credentials or private tokens.

## Run the applications

Start the backend on `http://127.0.0.1:4000`:

```powershell
npm run backend
```

Check it with:

```powershell
Invoke-RestMethod http://127.0.0.1:4000/health
```

Start Expo in a second terminal:

```powershell
npm run frontend
```

The backend currently provides health endpoints and the application boundary.
Feature-specific API routes should be added under `backend/src` as they are
moved from the existing external services; the frontend has deliberately not
been redirected automatically.

## Git workflow

This is one Git repository containing both applications. From the repository
root:

```powershell
git status
git add .
git commit -m "Set up frontend and backend workspace"
```

Use feature branches for future work, for example:

```powershell
git switch -c feature/backend-auth
```
