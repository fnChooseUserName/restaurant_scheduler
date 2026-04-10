import type {
  CreateShiftPayload,
  Shift,
  UpdateShiftPayload,
} from '../types'

import { apiClient } from './client'
import type { ApiSuccess } from './types'

/** Lists all shifts, each including its assignments (`GET /shifts`). */
export async function getShifts(): Promise<Shift[]> {
  const { data } = await apiClient.get<ApiSuccess<Shift[]>>('/shifts')
  return data.data
}

/** Loads one shift with assignments (`GET /shifts/:id`). */
export async function getShift(id: number): Promise<Shift> {
  const { data } = await apiClient.get<ApiSuccess<Shift>>(`/shifts/${id}`)
  return data.data
}

/** Creates a shift (`POST /shifts`). */
export async function createShift(
  payload: CreateShiftPayload,
): Promise<Shift> {
  const { data } = await apiClient.post<ApiSuccess<Shift>>('/shifts', payload)
  return data.data
}

/** Updates fields on a shift (`PUT /shifts/:id`). */
export async function updateShift(
  id: number,
  payload: UpdateShiftPayload,
): Promise<Shift> {
  const { data } = await apiClient.put<ApiSuccess<Shift>>(
    `/shifts/${id}`,
    payload,
  )
  return data.data
}

/** Deletes a shift (`DELETE /shifts/:id`). */
export async function deleteShift(id: number): Promise<void> {
  await apiClient.delete(`/shifts/${id}`)
}

/** Assigns a staff member to a shift; returns the updated shift (`POST /shifts/:id/assign`). */
export async function assignStaff(
  shiftId: number,
  staffMemberId: number,
): Promise<Shift> {
  const { data } = await apiClient.post<ApiSuccess<Shift>>(
    `/shifts/${shiftId}/assign`,
    { staffMemberId },
  )
  return data.data
}

/** Removes a staff member from a shift (`DELETE /shifts/:id/assign/:staffMemberId`). */
export async function unassignStaff(
  shiftId: number,
  staffMemberId: number,
): Promise<void> {
  await apiClient.delete(`/shifts/${shiftId}/assign/${staffMemberId}`)
}
