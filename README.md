# Restaurant Staff Scheduler

Full-stack TypeScript app for managing **staff**, **shifts**, and **assignments** (who works which shift). The API is an Express + Prisma service on PostgreSQL; the UI is a React (Vite) SPA that talks to the API over HTTP.

This README explains how to run everything, what ships in the MVP, and how the backend is structured.

---

## Quick start [Docker]

From the **repository root** (same directory as `docker-compose.yml`):

1. **Clone** the repository and **environment files**
   - Copy the root template and adjust if needed:  
      - `copy .env.example .env` for Windows 
      - `cp .env.example .env` for Unix/Mac  
      - Defaults match `docker-compose.yml` (`postgres` / `password`, DB `restaurant_scheduler`). _Override only if you must avoid port or credential clashes._
   - Copy the backend template for the mounted env file (required for the backend service volume):  
     - `copy "backend/.env.example" "backend/.env"` for Windows
     - `cp backend/.env.example backend/.env` for Unix/Mac  
     - Open `backend/.env` and set **`DATABASE_URL`** so the API can reach Postgres **from inside Docker**. The Compose file names the database service **`db`**, so use **`db`** as the hostname (not `localhost`, which would point at the API container itself). Example:  
       `DATABASE_URL=postgresql://postgres:password@db:5432/restaurant_scheduler`  
       The same URL appears as a commented line in `backend/.env.example` for copy-paste.

2. **Start Postgres + API** (builds images on first run):
   ```bash
   docker compose up --build
   ```
   - API: [http://localhost:3000](http://localhost:3000)  
   - Postgres is exposed on **localhost:5432** (see `docker-compose.yml`).

3. **Database migrations**  (OPTIONAL)  
   The backend container **applies migrations automatically on startup** (`prisma migrate deploy` in the image entrypoint before `node dist/server.js`). You do not need a separate migrate step for a normal first run.  
   If for any reason you need to run migrations manually inside the running backend container:
   ```bash
   docker compose exec backend npx prisma migrate deploy --schema src/prisma/schema.prisma
   ```

4. **Seed sample data (staff + shifts)**  (OPTIONAL):  run once after the stack is up:
   ```bash
   docker compose exec backend npm run prisma:seed
   ```
   - Seeding is an optional step. Creation of all resources is possible from a blank start.

5. **Frontend (host machine)** :  the SPA is not containerized in this MVP; run it against the API on port 3000:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Open the URL Vite prints (usually [http://localhost:5173](http://localhost:5173)).  
   The client defaults to `http://localhost:3000/api`; override with **`VITE_API_BASE_URL`** if needed (see `frontend/.env.example`).

**Happy Path usage:**  
- With the API up, you should be able to navigate to the root URL which displays the Staff Listing page. If no data is created/seeded yet, the table will be blank.  
- From this page, you can click the 'Add staff member' button to _(you guessed it)_ Add a Staff Member!  
- Once you have filled out and saved the modal form, you can navigate to the Shift Listing page (top right). Like the Staff Listing page, this is blank unless seeded. But once again you can Create Shift with the respective button, and save.    
- _It's worth noting here that the 'Required Role' of the shift must match one of the Roles of an existing Staff member in order to be assignable._  
- Still on the Shift Listing page, you can click 'View' to enter the Shift Details page. This outlines the the full data associated with the shift (for now, minimal) and gives you the option to Assign a Staff Member to that shift. 

---

## MVP scope and time-boxing

Within a 4–6 hour style window, scope was fixed early as a **Minimum Viable Product**: one complete vertical slice (working API + UI + tests) rather than many half-finished features. That trade-off keeps my project reviewable end-to-end.

**In scope (delivered MVP):**

- Full CRUD for staff members  
- Full CRUD for shifts  
- Assign and unassign staff to/from shifts  
- Validation and error handling from HTTP through to the UI (Zod on the API, Zod + forms on the client where applicable)  
- Backend feature and unit tests (Jest)  
- Responsive frontend for staff list, shifts list, and shift detail (including assignment flows)

**With more time**
- Finish building out tests for remaining routes
- Form field validation on staff/shift creation

**Potential next steps:**
- Shift conflict detection (e.g. prevent double-booking the same staff member)  
- Authentication and role-based access (e.g. manager login)  
- Pagination, search, and filters on list views  
- Frontend automated tests (e.g. React Testing Library)  
- Full Docker image for the frontend (static build served in the same stack)  
- Audit log / history of schedule changes  

---

## Architecture decisions (backend)

The backend follows a layered layout so each concern stays testable and replaceable.

Controllers stay thin on purpose: they parse route parameters, call a service, and return HTTP status + JSON. They avoid implementing business logic so that the same rules are not duplicated when you add new entry points (CLI, jobs, etc.).

Validation uses Zod in dedicated validators, wired through middleware (`validateRequest`) so invalid bodies are rejected before controller logic runs. That keeps failure modes consistent (status codes, error shape) and avoids ad-hoc checks.

Services implement domain behavior (create/update/delete, assignment variants as defined) and depend on Prisma to inform the structure. They return domain results or throw `AppError` objects. They do not set status codes or serialize JSON which makes services easy to unit test without mocking HTTP services.

Mappers (`toStaffDto`, `toShiftDto`, etc.) are the single place the wire format is defined: Prisma models are turned into structured JSON shapes (ISO dates, nested staff on shifts etc). Controllers always return DTOs, not raw ORM rows, so the API contract stays explicit and the database structure is obscured from the user interface.

---

## Tech stack

| Layer        | Technology                                      |
|-------------|--------------------------------------------------|
| API         | Express 5, Node 20                              | 
| Persistence | PostgreSQL 17, Prisma ORM                       | 
| Validation  | Zod (API + shared patterns with client forms)     | 
| API tests   | Jest, supertest                                 | 
| UI          | React 19, Vite 8, React Router 7                | 
| UI state    | TanStack Query v5                               | 
| Forms       | React Hook Form + Zod resolvers                 | 
| Styling     | Tailwind CSS 3                                    | 

---

## Running tests

**Backend**:

```bash
cd backend
npm install
npm run test
```

**With coverage** (writes under `backend/coverage/`):

```bash
cd backend
npm run test:coverage
```

Integration tests expect a **running PostgreSQL** and `DATABASE_URL` (see `backend/.env` / `backend/.env.example`). Jest is configured with **`maxWorkers: 1`** so integration suites do not race on shared DB fixtures.

**Frontend:** there is no automated test script in this MVP (`npm run build` and `npm run lint` are the main quality gates).

---

## Assumptions

- A staff member can appear on many shifts; a shift can have many staff (many-to-many relationship via assignments).  
- Roles are a fixed enum (`SERVER`, `COOK`, `MANAGER`, `HOST`, `BARTENDER`), extensible but not configurable.
- Shift times are stored as `HH:MM` strings; day is a calendar date in the API as `YYYY-MM-DD` strings in JSON.   
- The browser client defaults the API base to `http://localhost:3000/api` unless `VITE_API_BASE_URL` is set.

---

## Repository layout

```
restaurant-scheduler/
├── backend/          # Express API, Prisma schema & migrations, Jest tests
├── frontend/         # Vite + React SPA
├── docker-compose.yml
├── .env.example      # Root env template for Compose (DB credentials, etc.)
├── API-SURFACE.md    # API surface overview, route syntax and request structure
└── README.md         # This file
```

---
