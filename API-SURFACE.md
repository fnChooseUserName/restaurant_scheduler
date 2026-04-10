# API surface (quick reference)

Automated tests live under `restaurant-scheduler/backend/src/__tests__/` (**integration** = HTTP via supertest in `features/`, **unit** = mocked Prisma in `unit/`). A row is **checked** in **Has test** when at least one test exercises that route or the underlying service used by it.

| Method | Path | Notes | Idempotency | Has test |
|--------|------|--------|-------------|----------|
| GET | `/api/staff` | List staff | N/A | [x] |
| POST | `/api/staff` | Create (Zod body) | With duplicate email: 409, otherwise: no | [x] |
| GET | `/api/staff/:id` | Detail + shift assignments → shifts | N/A | [x] |
| PUT | `/api/staff/:id` | Partial update | N/A | [x] |
| DELETE | `/api/staff/:id` | 204 | N/A | [x] |
| GET | `/api/shifts` | List shifts + assigned staff | N/A | [ ] |
| POST | `/api/shifts` | Create (day `YYYY-MM-DD`, times `HH:MM`, end after start in service) | No | [x] |
| GET | `/api/shifts/:id` | One shift + assignments | N/A | [x] |
| PUT | `/api/shifts/:id` | Partial update | N/A | [ ] |
| DELETE | `/api/shifts/:id` | 204 | N/A | [ ] |
| POST | `/api/shifts/:id/assign` | Body `{ staffMemberId }`; 201 → updated shift | Duplicate assign: 409 | [x] |
| DELETE | `/api/shifts/:id/assign/:staffId` | 204 | N/A | [x] |

**Gaps (no dedicated test yet):** `GET /api/shifts` (list), `PUT /api/shifts/:id`, `DELETE /api/shifts/:id`.

---

## Request bodies (JSON)


### Staff

**`POST /api/staff`**   create (all fields shown; `phone` optional)

```json
{
  "name": "string (min length 1)",
  "role": "SERVER | COOK | MANAGER | HOST | BARTENDER",
  "email": "valid email string",
  "phone": "optional string"
}
```

**`PUT /api/staff/:id`**   partial update (any subset of the create fields)

```json
{
  "name": "optional string",
  "role": "optional, same enum as above",
  "email": "optional valid email",
  "phone": "optional string"
}
```

### Shifts

**`POST /api/shifts`**   create

```json
{
  "day": "YYYY-MM-DD",
  "startTime": "HH:MM (24-hour)",
  "endTime": "HH:MM (24-hour), must be after startTime (enforced in service)",
  "role": "SERVER | COOK | MANAGER | HOST | BARTENDER"
}
```

**`PUT /api/shifts/:id`**   partial update (any subset of the create fields)

```json
{
  "day": "optional YYYY-MM-DD",
  "startTime": "optional HH:MM",
  "endTime": "optional HH:MM",
  "role": "optional enum as above"
}
```

### Assignments

**`POST /api/shifts/:id/assign`**

```json
{
  "staffMemberId": 1
}
```


**`DELETE /api/shifts/:id/assign/:staffId`**   no body; `:staffId` is the staff member id.
