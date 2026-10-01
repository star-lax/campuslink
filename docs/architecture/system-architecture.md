# CampusLink architecture

The current frontend under `src` is the stable prototype baseline. The backend under `backend/src` uses a master `app.js` route registry and isolated feature modules. The first persistence layer is a local JSON database so the API can be run without introducing an unverified database dependency. It can be replaced behind `database/connection.js` during the next migration.

## Runtime flow

`frontend page → src/services/apiClient.ts → /api namespace → module route → controller → service → repository → database`

Existing local data remains available while each feature is migrated and verified.
