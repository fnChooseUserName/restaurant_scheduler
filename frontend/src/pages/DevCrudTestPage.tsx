/* LLM Generated CRUD Sandbox for testing UI functions prior to styling */

import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import * as staffApi from '../api/staff'
import * as shiftsApi from '../api/shifts'
import type {
  Role,
  Shift,
  StaffMember,
  StaffMemberDetail,
  UpdateStaffPayload,
} from '../types'

const ROLES: Role[] = ['SERVER', 'COOK', 'MANAGER', 'HOST', 'BARTENDER']

function apiError(e: unknown): string {
  if (axios.isAxiosError(e)) {
    const d = e.response?.data as
      | { message?: string }
      | { error?: string }
      | undefined
    const msg =
      d && typeof d === 'object' && 'message' in d
        ? (d as { message?: string }).message
        : d && typeof d === 'object' && 'error' in d
          ? String((d as { error?: unknown }).error)
          : undefined
    return msg ?? e.message
  }
  return e instanceof Error ? e.message : String(e)
}

export function DevCrudTestPage() {
  const [banner, setBanner] = useState<{ kind: 'ok' | 'err'; text: string } | null>(
    null,
  )
  const [lastPayload, setLastPayload] = useState<unknown>(null)

  const showOk = (text: string, payload?: unknown) => {
    setBanner({ kind: 'ok', text })
    if (payload !== undefined) setLastPayload(payload)
  }
  const showErr = (e: unknown) => {
    setBanner({ kind: 'err', text: apiError(e) })
  }

  const [staffList, setStaffList] = useState<StaffMember[]>([])
  const [shiftsList, setShiftsList] = useState<Shift[]>([])

  const refreshStaff = useCallback(async () => {
    const rows = await staffApi.getStaff()
    setStaffList(rows)
  }, [])

  const refreshShifts = useCallback(async () => {
    const rows = await shiftsApi.getShifts()
    setShiftsList(rows)
  }, [])

  useEffect(() => {
    void (async () => {
      try {
        await refreshStaff()
      } catch (e) {
        setBanner({ kind: 'err', text: apiError(e) })
      }
      try {
        await refreshShifts()
      } catch (e) {
        setBanner({ kind: 'err', text: apiError(e) })
      }
    })()
  }, [refreshStaff, refreshShifts])

  // --- Staff: create ---
  const [scName, setScName] = useState('')
  const [scEmail, setScEmail] = useState('')
  const [scRole, setScRole] = useState<Role>('SERVER')
  const [scPhone, setScPhone] = useState('')

  // --- Staff: get one ---
  const [sgId, setSgId] = useState('')
  const [sgDetail, setSgDetail] = useState<StaffMemberDetail | null>(null)

  // --- Staff: update ---
  const [suId, setSuId] = useState('')
  const [suName, setSuName] = useState('')
  const [suEmail, setSuEmail] = useState('')
  const [suRole, setSuRole] = useState<Role>('SERVER')
  const [suPhone, setSuPhone] = useState('')

  // --- Staff: delete ---
  const [sdId, setSdId] = useState('')

  // --- Shifts: create ---
  const [cfDay, setCfDay] = useState(() =>
    new Date().toISOString().slice(0, 10),
  )
  const [cfStart, setCfStart] = useState('09:00')
  const [cfEnd, setCfEnd] = useState('17:00')
  const [cfRole, setCfRole] = useState<Role>('SERVER')

  // --- Shifts: get one ---
  const [zgId, setZgId] = useState('')
  const [zgShift, setZgShift] = useState<Shift | null>(null)

  // --- Shifts: update ---
  const [zuId, setZuId] = useState('')
  const [zuDay, setZuDay] = useState('')
  const [zuStart, setZuStart] = useState('')
  const [zuEnd, setZuEnd] = useState('')
  const [zuRole, setZuRole] = useState<Role>('SERVER')

  // --- Shifts: delete ---
  const [zdId, setZdId] = useState('')

  // --- Assign ---
  const [asShiftId, setAsShiftId] = useState('')
  const [asStaffId, setAsStaffId] = useState('')

  return (
    <div className="min-h-screen bg-neutral-950 p-4 font-sans text-neutral-100">
      <header className="mb-4 border-b border-neutral-700 pb-2">
        <Link to="/" className="text-sky-400 underline">
          ← Home
        </Link>
        <h1 className="mt-2 text-xl font-semibold">API playground (dev only)</h1>
        <p className="text-sm text-neutral-500">
          Backend must be running at <code>http://localhost:3000</code>.
        </p>
      </header>

      {banner && (
        <div
          className={
            banner.kind === 'ok'
              ? 'mb-3 rounded border border-green-800 bg-green-950/80 px-2 py-1 text-sm text-green-200'
              : 'mb-3 rounded border border-red-800 bg-red-950/80 px-2 py-1 text-sm text-red-200'
          }
        >
          {banner.text}
        </div>
      )}

      <section className="mb-8">
        <h2 className="mb-2 text-lg font-medium">Staff — list (getStaff)</h2>
        <button
          type="button"
          className="mb-2 rounded border border-neutral-600 px-2 py-1 text-sm"
          onClick={() =>
            refreshStaff()
              .then(() => showOk('Staff list refreshed'))
              .catch(showErr)
          }
        >
          Refresh
        </button>
        <pre className="max-h-48 overflow-auto rounded border border-neutral-700 bg-neutral-900 p-2 text-xs">
          {JSON.stringify(staffList, null, 2)}
        </pre>

        <h3 className="mt-4 font-medium">Create (createStaff)</h3>
        <div className="flex flex-wrap items-end gap-2 text-sm">
          <label>
            name{' '}
            <input
              className="ml-1 rounded border border-neutral-600 bg-neutral-900 px-1"
              value={scName}
              onChange={(e) => setScName(e.target.value)}
            />
          </label>
          <label>
            email{' '}
            <input
              className="ml-1 rounded border border-neutral-600 bg-neutral-900 px-1"
              value={scEmail}
              onChange={(e) => setScEmail(e.target.value)}
              type="email"
            />
          </label>
          <label>
            role{' '}
            <select
              className="ml-1 rounded border border-neutral-600 bg-neutral-900 px-1"
              value={scRole}
              onChange={(e) => setScRole(e.target.value as Role)}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <label>
            phone{' '}
            <input
              className="ml-1 rounded border border-neutral-600 bg-neutral-900 px-1"
              value={scPhone}
              onChange={(e) => setScPhone(e.target.value)}
            />
          </label>
          <button
            type="button"
            className="rounded border border-neutral-600 px-2 py-1"
            onClick={() =>
              staffApi
                .createStaff({
                  name: scName,
                  email: scEmail,
                  role: scRole,
                  phone: scPhone.trim() || undefined,
                })
                .then((row) => {
                  void refreshStaff()
                  showOk('Staff created', row)
                })
                .catch(showErr)
            }
          >
            Create
          </button>
        </div>

        <h3 className="mt-4 font-medium">Get one (getStaffMember)</h3>
        <div className="flex flex-wrap items-end gap-2 text-sm">
          <label>
            id{' '}
            <input
              className="ml-1 w-20 rounded border border-neutral-600 bg-neutral-900 px-1"
              value={sgId}
              onChange={(e) => setSgId(e.target.value)}
            />
          </label>
          <button
            type="button"
            className="rounded border border-neutral-600 px-2 py-1"
            onClick={() => {
              const id = Number(sgId)
              if (!Number.isFinite(id) || id < 1) {
                showErr(new Error('Invalid id'))
                return
              }
              staffApi
                .getStaffMember(id)
                .then((d) => {
                  setSgDetail(d)
                  showOk('Loaded staff detail', d)
                })
                .catch(showErr)
            }}
          >
            Fetch
          </button>
        </div>
        {sgDetail && (
          <pre className="mt-2 max-h-40 overflow-auto rounded border border-neutral-700 bg-neutral-900 p-2 text-xs">
            {JSON.stringify(sgDetail, null, 2)}
          </pre>
        )}

        <h3 className="mt-4 font-medium">Update (updateStaff) — fill id + any fields</h3>
        <div className="flex flex-wrap items-end gap-2 text-sm">
          <label>
            id{' '}
            <input
              className="ml-1 w-20 rounded border border-neutral-600 bg-neutral-900 px-1"
              value={suId}
              onChange={(e) => setSuId(e.target.value)}
            />
          </label>
          <label>
            name{' '}
            <input
              className="ml-1 rounded border border-neutral-600 bg-neutral-900 px-1"
              value={suName}
              onChange={(e) => setSuName(e.target.value)}
            />
          </label>
          <label>
            email{' '}
            <input
              className="ml-1 rounded border border-neutral-600 bg-neutral-900 px-1"
              value={suEmail}
              onChange={(e) => setSuEmail(e.target.value)}
            />
          </label>
          <label>
            role{' '}
            <select
              className="ml-1 rounded border border-neutral-600 bg-neutral-900 px-1"
              value={suRole}
              onChange={(e) => setSuRole(e.target.value as Role)}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <label>
            phone{' '}
            <input
              className="ml-1 rounded border border-neutral-600 bg-neutral-900 px-1"
              value={suPhone}
              onChange={(e) => setSuPhone(e.target.value)}
            />
          </label>
          <button
            type="button"
            className="rounded border border-neutral-600 px-2 py-1"
            onClick={() => {
              const id = Number(suId)
              if (!Number.isFinite(id) || id < 1) {
                showErr(new Error('Invalid id'))
                return
              }
              const payload: UpdateStaffPayload = {}
              if (suName.trim()) payload.name = suName.trim()
              if (suEmail.trim()) payload.email = suEmail.trim()
              if (suPhone.trim()) payload.phone = suPhone.trim()
              payload.role = suRole
              staffApi
                .updateStaff(id, payload)
                .then((row) => {
                  void refreshStaff()
                  showOk('Staff updated', row)
                })
                .catch(showErr)
            }}
          >
            Update
          </button>
        </div>

        <h3 className="mt-4 font-medium">Delete (deleteStaff)</h3>
        <div className="flex flex-wrap items-end gap-2 text-sm">
          <label>
            id{' '}
            <input
              className="ml-1 w-20 rounded border border-neutral-600 bg-neutral-900 px-1"
              value={sdId}
              onChange={(e) => setSdId(e.target.value)}
            />
          </label>
          <button
            type="button"
            className="rounded border border-red-900 px-2 py-1 text-red-300"
            onClick={() => {
              const id = Number(sdId)
              if (!Number.isFinite(id) || id < 1) {
                showErr(new Error('Invalid id'))
                return
              }
              staffApi
                .deleteStaff(id)
                .then(() => {
                  void refreshStaff()
                  showOk('Staff deleted (204)')
                  setLastPayload(null)
                })
                .catch(showErr)
            }}
          >
            Delete
          </button>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-lg font-medium">Shifts — list (getShifts)</h2>
        <button
          type="button"
          className="mb-2 rounded border border-neutral-600 px-2 py-1 text-sm"
          onClick={() =>
            refreshShifts()
              .then(() => showOk('Shifts list refreshed'))
              .catch(showErr)
          }
        >
          Refresh
        </button>
        <pre className="max-h-48 overflow-auto rounded border border-neutral-700 bg-neutral-900 p-2 text-xs">
          {JSON.stringify(shiftsList, null, 2)}
        </pre>

        <h3 className="mt-4 font-medium">Create (createShift)</h3>
        <div className="flex flex-wrap items-end gap-2 text-sm">
          <label>
            day{' '}
            <input
              type="date"
              className="ml-1 rounded border border-neutral-600 bg-neutral-900 px-1"
              value={cfDay}
              onChange={(e) => setCfDay(e.target.value)}
            />
          </label>
          <label>
            start{' '}
            <input
              type="time"
              className="ml-1 rounded border border-neutral-600 bg-neutral-900 px-1"
              value={cfStart}
              onChange={(e) => setCfStart(e.target.value)}
            />
          </label>
          <label>
            end{' '}
            <input
              type="time"
              className="ml-1 rounded border border-neutral-600 bg-neutral-900 px-1"
              value={cfEnd}
              onChange={(e) => setCfEnd(e.target.value)}
            />
          </label>
          <label>
            role{' '}
            <select
              className="ml-1 rounded border border-neutral-600 bg-neutral-900 px-1"
              value={cfRole}
              onChange={(e) => setCfRole(e.target.value as Role)}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="rounded border border-neutral-600 px-2 py-1"
            onClick={() =>
              shiftsApi
                .createShift({
                  day: cfDay,
                  startTime: cfStart,
                  endTime: cfEnd,
                  role: cfRole,
                })
                .then((row) => {
                  void refreshShifts()
                  showOk('Shift created', row)
                })
                .catch(showErr)
            }
          >
            Create
          </button>
        </div>

        <h3 className="mt-4 font-medium">Get one (getShift)</h3>
        <div className="flex flex-wrap items-end gap-2 text-sm">
          <label>
            id{' '}
            <input
              className="ml-1 w-20 rounded border border-neutral-600 bg-neutral-900 px-1"
              value={zgId}
              onChange={(e) => setZgId(e.target.value)}
            />
          </label>
          <button
            type="button"
            className="rounded border border-neutral-600 px-2 py-1"
            onClick={() => {
              const id = Number(zgId)
              if (!Number.isFinite(id) || id < 1) {
                showErr(new Error('Invalid id'))
                return
              }
              shiftsApi
                .getShift(id)
                .then((s) => {
                  setZgShift(s)
                  showOk('Loaded shift', s)
                })
                .catch(showErr)
            }}
          >
            Fetch
          </button>
        </div>
        {zgShift && (
          <pre className="mt-2 max-h-40 overflow-auto rounded border border-neutral-700 bg-neutral-900 p-2 text-xs">
            {JSON.stringify(zgShift, null, 2)}
          </pre>
        )}

        <h3 className="mt-4 font-medium">Update (updateShift)</h3>
        <div className="flex flex-wrap items-end gap-2 text-sm">
          <label>
            id{' '}
            <input
              className="ml-1 w-20 rounded border border-neutral-600 bg-neutral-900 px-1"
              value={zuId}
              onChange={(e) => setZuId(e.target.value)}
            />
          </label>
          <label>
            day{' '}
            <input
              type="date"
              className="ml-1 rounded border border-neutral-600 bg-neutral-900 px-1"
              value={zuDay}
              onChange={(e) => setZuDay(e.target.value)}
            />
          </label>
          <label>
            start{' '}
            <input
              type="time"
              className="ml-1 rounded border border-neutral-600 bg-neutral-900 px-1"
              value={zuStart}
              onChange={(e) => setZuStart(e.target.value)}
            />
          </label>
          <label>
            end{' '}
            <input
              type="time"
              className="ml-1 rounded border border-neutral-600 bg-neutral-900 px-1"
              value={zuEnd}
              onChange={(e) => setZuEnd(e.target.value)}
            />
          </label>
          <label>
            role{' '}
            <select
              className="ml-1 rounded border border-neutral-600 bg-neutral-900 px-1"
              value={zuRole}
              onChange={(e) => setZuRole(e.target.value as Role)}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="rounded border border-neutral-600 px-2 py-1"
            onClick={() => {
              const id = Number(zuId)
              if (!Number.isFinite(id) || id < 1) {
                showErr(new Error('Invalid id'))
                return
              }
              const payload: {
                day?: string
                startTime?: string
                endTime?: string
                role?: Role
              } = {}
              if (zuDay.trim()) payload.day = zuDay.trim()
              if (zuStart.trim()) payload.startTime = zuStart.trim()
              if (zuEnd.trim()) payload.endTime = zuEnd.trim()
              payload.role = zuRole
              shiftsApi
                .updateShift(id, payload)
                .then((row) => {
                  void refreshShifts()
                  showOk('Shift updated', row)
                })
                .catch(showErr)
            }}
          >
            Update
          </button>
        </div>

        <h3 className="mt-4 font-medium">Delete (deleteShift)</h3>
        <div className="flex flex-wrap items-end gap-2 text-sm">
          <label>
            id{' '}
            <input
              className="ml-1 w-20 rounded border border-neutral-600 bg-neutral-900 px-1"
              value={zdId}
              onChange={(e) => setZdId(e.target.value)}
            />
          </label>
          <button
            type="button"
            className="rounded border border-red-900 px-2 py-1 text-red-300"
            onClick={() => {
              const id = Number(zdId)
              if (!Number.isFinite(id) || id < 1) {
                showErr(new Error('Invalid id'))
                return
              }
              shiftsApi
                .deleteShift(id)
                .then(() => {
                  void refreshShifts()
                  showOk('Shift deleted (204)')
                  setLastPayload(null)
                })
                .catch(showErr)
            }}
          >
            Delete
          </button>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-lg font-medium">Assignments</h2>
        <div className="flex flex-wrap items-end gap-2 text-sm">
          <label>
            shift id{' '}
            <input
              className="ml-1 w-20 rounded border border-neutral-600 bg-neutral-900 px-1"
              value={asShiftId}
              onChange={(e) => setAsShiftId(e.target.value)}
            />
          </label>
          <label>
            staff id{' '}
            <input
              className="ml-1 w-20 rounded border border-neutral-600 bg-neutral-900 px-1"
              value={asStaffId}
              onChange={(e) => setAsStaffId(e.target.value)}
            />
          </label>
          <button
            type="button"
            className="rounded border border-neutral-600 px-2 py-1"
            onClick={() => {
              const shiftId = Number(asShiftId)
              const staffMemberId = Number(asStaffId)
              if (
                !Number.isFinite(shiftId) ||
                shiftId < 1 ||
                !Number.isFinite(staffMemberId) ||
                staffMemberId < 1
              ) {
                showErr(new Error('Invalid shift id or staff id'))
                return
              }
              shiftsApi
                .assignStaff(shiftId, staffMemberId)
                .then((row) => {
                  void refreshShifts()
                  showOk('Assigned', row)
                })
                .catch(showErr)
            }}
          >
            assignStaff
          </button>
          <button
            type="button"
            className="rounded border border-red-900 px-2 py-1 text-red-300"
            onClick={() => {
              const shiftId = Number(asShiftId)
              const staffMemberId = Number(asStaffId)
              if (
                !Number.isFinite(shiftId) ||
                shiftId < 1 ||
                !Number.isFinite(staffMemberId) ||
                staffMemberId < 1
              ) {
                showErr(new Error('Invalid shift id or staff id'))
                return
              }
              shiftsApi
                .unassignStaff(shiftId, staffMemberId)
                .then(() => {
                  void refreshShifts()
                  showOk('Unassigned (204)')
                  setLastPayload(null)
                })
                .catch(showErr)
            }}
          >
            unassignStaff
          </button>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-medium">Last response</h2>
        <pre className="max-h-64 overflow-auto rounded border border-neutral-700 bg-neutral-900 p-2 text-xs">
          {lastPayload === null ? '(none)' : JSON.stringify(lastPayload, null, 2)}
        </pre>
      </section>
    </div>
  )
}
