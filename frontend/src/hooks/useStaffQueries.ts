/**
 * Staff server state via TanStack Query.
 *
 * **Why `invalidateQueries` after mutations:** Cached query data does not update when the
 * server changes unless we refetch. Calling `queryClient.invalidateQueries({ queryKey })`
 * marks matching queries as stale and (by default) triggers a background refetch for any
 * active `useQuery` subscribers, so UIs stay in sync without manual `useState`.
 *
 * TanStack Query treats keys as prefixes: `invalidateQueries({ queryKey: ['staff'] })`
 * invalidates both the list (`['staff']`) and every detail (`['staff', 1]`, `['staff', 2]`, …).
 *
 * **Cross-invalidating shifts:** Each shift in the API embeds full `StaffMember` objects
 * (e.g. assignees). If we only invalidated staff queries after a staff change, shift screens
 * could still show old names or roles until shift queries refetched—so staff mutations also
 * invalidate `shiftKeys.all`.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import * as staffApi from '../api/staff'
import type { CreateStaffPayload, UpdateStaffPayload } from '../types'
import { shiftKeys, staffKeys } from './queryKeys'

/**
 * Fetches all staff members for list UIs.
 *
 * @returns Query for `GET /staff`. Key: `staffKeys.all` (`['staff']`).
 */
export function useStaffList() {
  return useQuery({
    queryKey: staffKeys.all,
    queryFn: staffApi.getStaff,
  })
}

/**
 * Fetches one staff member including linked shift assignments (detail UIs).
 *
 * @param id - Staff id; query is disabled unless this is a positive finite number.
 * @returns Query for `GET /staff/:id`. Key: `staffKeys.detail(id)`.
 */
export function useStaffMember(id: number) {
  return useQuery({
    queryKey: staffKeys.detail(id),
    queryFn: () => staffApi.getStaffMember(id),
    enabled: Number.isFinite(id) && id > 0,
  })
}

/**
 * Creates a staff member (`POST /staff`).
 *
 * On success:
 * - **`staffKeys.all`** — Staff lists and detail queries refetch so the new member appears.
 * - **`shiftKeys.all`** — Same policy as `useUpdateStaff` / `useDeleteStaff`: shift responses
 *   embed full `StaffMember` objects, so we invalidate shifts whenever staff data changes.
 */
export function useCreateStaff() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateStaffPayload) => staffApi.createStaff(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: staffKeys.all })
      void queryClient.invalidateQueries({ queryKey: shiftKeys.all })
    },
  })
}

/**
 * Updates a staff member (`PUT /staff/:id`).
 *
 * On success:
 * - **`staffKeys.all`** — List and all staff detail queries refetch so name/role/email/etc.
 *   are current everywhere.
 * - **`shiftKeys.all`** — Shift payloads nest `StaffMember`; without this, shift pages could
 *   still show the previous name or role until a full reload.
 */
export function useUpdateStaff() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: UpdateStaffPayload
    }) => staffApi.updateStaff(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: staffKeys.all })
      void queryClient.invalidateQueries({ queryKey: shiftKeys.all })
    },
  })
}

/**
 * Deletes a staff member (`DELETE /staff/:id`).
 *
 * On success:
 * - **`staffKeys.all`** — Removes the member from lists and drops stale detail cache for that id.
 * - **`shiftKeys.all`** — Assignments may be removed server-side; shift list/detail must refetch
 *   so assignment counts and nested staff references stay accurate.
 */
export function useDeleteStaff() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => staffApi.deleteStaff(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: staffKeys.all })
      void queryClient.invalidateQueries({ queryKey: shiftKeys.all })
    },
  })
}
