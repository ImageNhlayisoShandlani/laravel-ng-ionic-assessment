# Project & Task Manager — Full Stack Assessment

A small system for managing Projects and their Tasks, built with:

- **Backend:** Laravel (RESTful API)
- **Web Frontend:** Angular + Angular Material
- **Mobile:** Ionic Angular
- **Database:** SQLite (chosen over SQL Server — see note below)

---

## Prerequisites

- PHP 8.2+ and Composer
- Node.js and npm
- Angular CLI (`npm install -g @angular/cli`)
- Ionic CLI (`npm install -g @ionic/cli`)

---

## 1. Backend Setup (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

### Database setup

The assessment brief prefers **SQL Server**, with MySQL/PostgreSQL/SQLite listed as
acceptable alternatives. **This submission uses SQLite** — no database server to
install or configure, which keeps setup to a single command and removes any
environment-specific database connectivity issues during review.

```bash
cd backend
touch database/database.sqlite
```

In `.env`, confirm:

```
DB_CONNECTION=sqlite
```

(You can leave `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
commented out or blank — SQLite doesn't use them.)

### Migrate and run

```bash
php artisan migrate
php artisan serve
```

The API is now available at **`http://127.0.0.1:8000/api`**.

### Verify it's working

```bash
curl http://127.0.0.1:8000/api/projects
```

Should return `[]` on a fresh database.

### API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/projects` | List all projects (with tasks) |
| POST | `/api/projects` | Create a project |
| GET | `/api/projects/{id}` | Get one project (with tasks) |
| PUT | `/api/projects/{id}` | Update a project |
| DELETE | `/api/projects/{id}` | Delete a project (cascades to its tasks) |
| GET | `/api/projects/{id}/tasks` | List tasks for a project |
| POST | `/api/projects/{id}/tasks` | Create a task under a project |
| PUT | `/api/tasks/{id}` | Update a task |
| DELETE | `/api/tasks/{id}` | Delete a task |

---

## 2. Frontend Setup (Angular)

```bash
cd frontend
npm install
```

### Configuring the API URL

Open `src/environments/environment.ts` and confirm `apiUrl` points at your local
backend (this is already set by default, but worth checking):

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://127.0.0.1:8000',
};
```

This assumes the backend is running via `php artisan serve` on its default port, per
[Backend Setup](#1-backend-setup-laravel) above.

### Run

```bash
ng serve
```

Open **`http://localhost:4200`**.

### Pages

- **Projects** (`/projects`) — list, create, edit, delete projects.
- **Tasks** (`/projects/:id/tasks`) — list, create, edit, delete tasks for a selected
  project.

---

## 3. Mobile Setup (Ionic Angular)

```bash
cd mobile
npm install
```

### Configuring the API URL

Same as the frontend — open `src/environments/environment.ts` and confirm `apiUrl`
points at your local backend (`http://127.0.0.1:8000` by default).

> **Note:** if you're testing on a physical device or emulator rather than a desktop
> browser, `127.0.0.1` refers to the device itself, not your development machine. In
> that case, use your machine's LAN IP (e.g. `http://192.168.1.x:8000`) instead,
> and make sure `php artisan serve --host=0.0.0.0` is running so it accepts
> connections from other devices on the network.

### Run

```bash
ionic serve
```

Open **`http://localhost:8100`**.

### Functionality

Single page: select a project from the dropdown → view its tasks → add / edit /
delete tasks (swipe a task row left to reveal Edit/Delete actions).

---

## CORS

The backend's `config/cors.php` allows all origins (`allowed_origins => ['*']`) for
`api/*` routes, so the web and mobile apps can call it regardless of which host/port
they're served from. This is appropriate for a local assessment with no
authentication; a production setup would restrict this to known origins.

---

## Extra Notes

- **Database:** SQLite was used instead of SQL Server
- **Authentication:** Not implemented, per the brief.
- **Validation:** Project name and task title are required. Task due date must be a
  future date on creation (relaxed on edit, so an already-overdue task can still be
  updated without the form blocking the save).
- **Cascading delete:** Deleting a project deletes its tasks (enforced at the database
  level via a foreign key constraint).