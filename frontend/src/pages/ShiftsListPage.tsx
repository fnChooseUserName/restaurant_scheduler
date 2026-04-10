import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Modal } from '../components/Modal'
import { Select } from '../components/Select'
import { useCreateShift, useShiftsList } from '../hooks'
import {
  ROLE_OPTIONS,
  shiftCreateSchema,
  type ShiftCreateFormValues,
} from '../schemas/shiftForm'
import { getErrorMessage } from '../utils/errorMessage'

export function ShiftsListPage() {
  const { data: shifts, isLoading, isError, error: listError } = useShiftsList()
  const createShift = useCreateShift()

  const [modalOpen, setModalOpen] = useState(false)

  const form = useForm<ShiftCreateFormValues>({
    resolver: zodResolver(shiftCreateSchema),
    defaultValues: {
      day: new Date().toISOString().slice(0, 10),
      startTime: '09:00',
      endTime: '17:00',
      role: 'SERVER',
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = form

  const openModal = () => {
    createShift.reset()
    reset({
      day: new Date().toISOString().slice(0, 10),
      startTime: '09:00',
      endTime: '17:00',
      role: 'SERVER',
    })
    setModalOpen(true)
  }

  const onSubmit = (values: ShiftCreateFormValues) => {
    createShift.mutate(
      {
        day: values.day,
        startTime: values.startTime,
        endTime: values.endTime,
        role: values.role,
      },
      {
        onSuccess: () => {
          setModalOpen(false)
          reset()
        },
      },
    )
  }

  const listErrMsg = isError ? getErrorMessage(listError) : null
  const createErrMsg = createShift.error
    ? getErrorMessage(createShift.error)
    : null

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-medium">Shifts</h1>
        <Button type="button" onClick={openModal}>
          Create shift
        </Button>
      </div>

      {listErrMsg ? (
        <p className="mt-4 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">
          {listErrMsg}
        </p>
      ) : null}

      {isLoading ? (
        <p className="mt-6 text-sm text-gray-600">Loading shifts…</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded border border-gray-300 bg-white">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-3 py-2 font-medium">Day</th>
                <th className="px-3 py-2 font-medium">Start</th>
                <th className="px-3 py-2 font-medium">End</th>
                <th className="px-3 py-2 font-medium">Role</th>
                <th className="px-3 py-2 font-medium">Assigned</th>
                <th className="px-3 py-2 font-medium"> </th>
              </tr>
            </thead>
            <tbody>
              {shifts?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-gray-600">
                    No shifts yet. Create one to get started.
                  </td>
                </tr>
              ) : (
                shifts?.map((row) => (
                  <tr key={row.id} className="border-b border-gray-100">
                    <td className="px-3 py-2">{row.day}</td>
                    <td className="px-3 py-2">{row.startTime}</td>
                    <td className="px-3 py-2">{row.endTime}</td>
                    <td className="px-3 py-2">{row.role}</td>
                    <td className="px-3 py-2">{row.assignments.length}</td>
                    <td className="px-3 py-2">
                      <Link
                        to={`/shifts/${row.id}`}
                        className="text-blue-700 underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => {
          createShift.reset()
          reset({
            day: new Date().toISOString().slice(0, 10),
            startTime: '09:00',
            endTime: '17:00',
            role: 'SERVER',
          })
          setModalOpen(false)
        }}
        title="Create shift"
      >
        <form
          className="flex flex-col gap-3"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {createErrMsg ? (
            <p className="text-sm text-red-600" role="alert">
              {createErrMsg}
            </p>
          ) : null}

          <Input
            label="Day"
            type="date"
            {...register('day')}
            error={errors.day?.message}
          />
          <Input
            label="Start time"
            type="time"
            step={60}
            {...register('startTime')}
            error={errors.startTime?.message}
          />
          <Input
            label="End time"
            type="time"
            step={60}
            {...register('endTime')}
            error={errors.endTime?.message}
          />
          <Select
            label="Required role"
            {...register('role')}
            error={errors.role?.message}
          >
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>

          <div className="mt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setModalOpen(false)}
              disabled={createShift.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" loading={createShift.isPending}>
              Save
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
