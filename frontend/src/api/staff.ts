import type {
  CreateStaffPayload,
  StaffMember,
  StaffMemberDetail,
  UpdateStaffPayload,
} from '../types'

import { apiClient } from './client'
import type { ApiSuccess } from './types'

/** Lists all staff members (`GET /staff`). */
export async function getStaff(): Promise<StaffMember[]> {
  const { data } = await apiClient.get<ApiSuccess<StaffMember[]>>('/staff')
  return data.data
}

/** Loads one staff member with linked shift assignments (`GET /staff/:id`). */
export async function getStaffMember(id: number): Promise<StaffMemberDetail> {
  const { data } = await apiClient.get<ApiSuccess<StaffMemberDetail>>(
    `/staff/${id}`,
  )
  return data.data
}

/** Creates a staff member (`POST /staff`). */
export async function createStaff(
  payload: CreateStaffPayload,
): Promise<StaffMember> {
  const { data } = await apiClient.post<ApiSuccess<StaffMember>>(
    '/staff',
    payload,
  )
  return data.data
}

/** Updates fields on a staff member (`PUT /staff/:id`). */
export async function updateStaff(
  id: number,
  payload: UpdateStaffPayload,
): Promise<StaffMember> {
  const { data } = await apiClient.put<ApiSuccess<StaffMember>>(
    `/staff/${id}`,
    payload,
  )
  return data.data
}

/** Deletes a staff member (`DELETE /staff/:id`). */
export async function deleteStaff(id: number): Promise<void> {
  await apiClient.delete(`/staff/${id}`)
}
