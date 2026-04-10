import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { Button } from '../components/Button'
import { Select } from '../components/Select'
import {
  useAssignStaff,
  useShift,
  useStaffList,
  useUnassignStaff,
} from '../hooks'
import { getErrorMessage } from '../utils/errorMessage'

export function ShiftDetailPage() {
  const { id: idParam } = useParams<{ id: string }>()
  const shiftId = Number(idParam)
  const idValid = Number.isFinite(shiftId) && shiftId > 0

  const {
    data: shift,
    isLoading,
    isError,
    error: shiftError,
  } = useShift(idValid ? shiftId : 0)

  const { data: allStaff, isLoading: staffLoading } = useStaffList()
  const assignStaff = useAssignStaff()
  const unassignStaff = useUnassignStaff()

  const [selectedStaffId, setSelectedStaffId] = useState('')
  const [confirmingUnassignStaffId, setConfirmingUnassignStaffId] = useState<
    number | null
  >(null)

  const assignedIds = useMemo(() => {
    if (!shift) return new Set<number>()
    return new Set(shift.assignments.map((a) => a.staffMember.id))
  }, [shift])

  const availableStaff = useMemo(() => {
    if (!allStaff) return []
    return allStaff.filter((s) => !assignedIds.has(s.id))
  }, [allStaff, assignedIds])

  const assignErrMsg = assignStaff.error
    ? getErrorMessage(assignStaff.error)
    : null
  const unassignErrMsg = unassignStaff.error
    ? getErrorMessage(unassignStaff.error)
    : null

  const handleAssign = () => {
    const staffMemberId = Number(selectedStaffId)
    if (!Number.isFinite(staffMemberId) || staffMemberId < 1) return
    assignStaff.mutate(
      { shiftId, staffMemberId },
      {
        onSuccess: () => setSelectedStaffId(''),
      },
    )
  }

  const handleUnassign = (staffMemberId: number) => {
    unassignStaff.mutate(
      { shiftId, staffMemberId },
      {
        onSuccess: () => setConfirmingUnassignStaffId(null),
      },
    )
  }

  if (!idValid) {
    return (
      <div>
        <p className="text-red-700">Invalid shift id.</p>
        <Link to="/shifts" className="mt-2 inline-block text-blue-700 underline">
          Back to shifts
        </Link>
      </div>
    )
  }

  const errMsg = isError ? getErrorMessage(shiftError) : null

  return (
    <div>
      <p className="mb-4">
        <Link to="/shifts" className="text-blue-700 underline">
          ← Shifts
        </Link>
      </p>

      {errMsg ? (
        <p className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">
          {errMsg}
        </p>
      ) : null}

      {assignErrMsg ? (
        <p className="mt-2 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">
          {assignErrMsg}
        </p>
      ) : null}

      {unassignErrMsg ? (
        <p className="mt-2 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">
          {unassignErrMsg}
        </p>
      ) : null}

      {isLoading ? (
        <p className="mt-4 text-sm text-gray-600">Loading shift…</p>
      ) : shift ? (
        <>
          <header className="border-b border-gray-200 pb-4">
            <h1 className="text-xl font-medium">Shift</h1>
            <p className="mt-2 text-sm text-gray-700">
              <span className="font-medium">Day:</span> {shift.day}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Time:</span> {shift.startTime} –{' '}
              {shift.endTime}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Role:</span> {shift.role}
            </p>
          </header>

          <section className="mt-6">
            <h2 className="text-base font-medium">Assigned staff</h2>

            {shift.assignments.length === 0 ? (
              <p className="mt-2 rounded border border-dashed border-gray-300 bg-gray-50 px-3 py-4 text-sm text-gray-600">
                No staff assigned to this shift yet.
              </p>
            ) : (
              <div className="mt-3 overflow-x-auto rounded border border-gray-300 bg-white">
                <table className="min-w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-3 py-2 font-medium">Name</th>
                      <th className="px-3 py-2 font-medium">Role</th>
                      <th className="w-48 px-3 py-2 font-medium"> </th>
                    </tr>
                  </thead>
                  <tbody>
                    {shift.assignments.map((a) => (
                      <tr key={a.id} className="border-b border-gray-100">
                        <td className="px-3 py-2">{a.staffMember.name}</td>
                        <td className="px-3 py-2">{a.staffMember.role}</td>
                        <td className="px-3 py-2">
                          {confirmingUnassignStaffId === a.staffMember.id ? (
                            <span className="flex flex-wrap items-center gap-2">
                              <span className="text-xs text-gray-600">
                                Unassign?
                              </span>
                              <Button
                                type="button"
                                variant="danger"
                                loading={unassignStaff.isPending}
                                onClick={() =>
                                  handleUnassign(a.staffMember.id)
                                }
                              >
                                Confirm
                              </Button>
                              <Button
                                type="button"
                                variant="secondary"
                                disabled={unassignStaff.isPending}
                                onClick={() =>
                                  setConfirmingUnassignStaffId(null)
                                }
                              >
                                Cancel
                              </Button>
                            </span>
                          ) : (
                            <Button
                              type="button"
                              variant="danger"
                              onClick={() =>
                                setConfirmingUnassignStaffId(a.staffMember.id)
                              }
                            >
                              Unassign
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="mt-8">
            <h2 className="text-base font-medium">Assign staff</h2>
            {staffLoading ? (
              <p className="mt-2 text-sm text-gray-600">Loading staff list…</p>
            ) : availableStaff.length === 0 ? (
              <p className="mt-2 text-sm text-gray-600">
                {allStaff?.length === 0
                  ? 'Add staff members first (Staff tab).'
                  : 'Everyone is already assigned to this shift.'}
              </p>
            ) : (
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="min-w-[12rem] flex-1">
                  <Select
                    label="Staff member"
                    value={selectedStaffId}
                    onChange={(e) => setSelectedStaffId(e.target.value)}
                  >
                    <option value="">Select…</option>
                    {availableStaff.map((s) => (
                      <option key={s.id} value={String(s.id)}>
                        {s.name} ({s.role})
                      </option>
                    ))}
                  </Select>
                </div>
                <Button
                  type="button"
                  loading={assignStaff.isPending}
                  disabled={!selectedStaffId}
                  onClick={handleAssign}
                >
                  Assign
                </Button>
              </div>
            )}
          </section>
        </>
      ) : null}
    </div>
  )
}
