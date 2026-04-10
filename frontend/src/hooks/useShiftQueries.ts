/**
 * Shift server state via TanStack Query.
 *
 * **Why `invalidateQueries` after mutations:** See `useStaffQueries.ts` — the same idea
 * applies: server state changes must be reflected in the cache via invalidation + refetch.
 *
 * **Shift-only mutations** (`create` / `update` / `delete`): Invalidating `shiftKeys.all`
 * is enough for shift list and every `['shifts', id]` detail query (prefix matching).
 *
 * **Assign / unassign:** These change both a shift (assignments array) and, from the staff
 * side, `GET /staff/:id` (which includes linked shifts). So we invalidate **`shiftKeys.all`**
 * and **`staffKeys.all`** so both resource trees refetch.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import * as shiftsApi from '../api/shifts'
import type { CreateShiftPayload, UpdateShiftPayload } from '../types'
import { shiftKeys, staffKeys } from './queryKeys'

/**
 * Fetches all shifts (with assignments) for list UIs.
 *
 * @returns Query for `GET /shifts`. Key: `shiftKeys.all` (`['shifts']`).
 */
export function useShiftsList() {
  return useQuery({
    queryKey: shiftKeys.all,
    queryFn: shiftsApi.getShifts,
  })
}

/**
 * Fetches one shift with assignments (detail UIs).
 *
 * @param id - Shift id; query is disabled unless this is a positive finite number.
 * @returns Query for `GET /shifts/:id`. Key: `shiftKeys.detail(id)`.
 */
export function useShift(id: number) {
  return useQuery({
    queryKey: shiftKeys.detail(id),
    queryFn: () => shiftsApi.getShift(id),
    enabled: Number.isFinite(id) && id > 0,
  })
}

/**
 * Creates a shift (`POST /shifts`).
 *
 * On success, **`shiftKeys.all`** is invalidated so the new shift appears in lists and any
 * open shift detail can refetch. Staff-only queries are unchanged (no staff rows are
 * created by this endpoint).
 */
export function useCreateShift() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateShiftPayload) =>
      shiftsApi.createShift(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: shiftKeys.all })
    },
  })
}

/**
 * Updates a shift (`PUT /shifts/:id`).
 *
 * On success, **`shiftKeys.all`** invalidates list + all shift detail caches so times,
 * day, role, and assignment metadata stay current.
 */
export function useUpdateShift() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: UpdateShiftPayload
    }) => shiftsApi.updateShift(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: shiftKeys.all })
    },
  })
}

/**
 * Deletes a shift (`DELETE /shifts/:id`).
 *
 * On success, **`shiftKeys.all`** invalidates list + all shift detail queries. If staff
 * detail screens show linked shifts, you may also want to invalidate `staffKeys.all` here
 * so those lists drop the deleted shift without a full reload.
 */
export function useDeleteShift() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => shiftsApi.deleteShift(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: shiftKeys.all })
    },
  })
}

/**
 * Assigns a staff member to a shift (`POST /shifts/:id/assign`).
 *
 * On success:
 * - **`shiftKeys.all`** — The shift’s `assignments` array changes; list and detail must refetch.
 * - **`staffKeys.all`** — Staff detail includes linked shifts; that list must refetch so the
 *   new assignment appears under the staff member.
 */
export function useAssignStaff() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      shiftId,
      staffMemberId,
    }: {
      shiftId: number
      staffMemberId: number
    }) => shiftsApi.assignStaff(shiftId, staffMemberId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: shiftKeys.all })
      void queryClient.invalidateQueries({ queryKey: staffKeys.all })
    },
  })
}

/**
 * Removes a staff member from a shift (`DELETE /shifts/:id/assign/:staffMemberId`).
 *
 * On success:
 * - **`shiftKeys.all`** — Same as assign: shift assignment list updates.
 * - **`staffKeys.all`** — Staff detail’s linked-shifts section must drop this shift.
 */
export function useUnassignStaff() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      shiftId,
      staffMemberId,
    }: {
      shiftId: number
      staffMemberId: number
    }) => shiftsApi.unassignStaff(shiftId, staffMemberId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: shiftKeys.all })
      void queryClient.invalidateQueries({ queryKey: staffKeys.all })
    },
  })
}
