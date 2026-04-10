import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Modal } from '../components/Modal'
import { Select } from '../components/Select'
import { useCreateStaff, useDeleteStaff, useStaffList } from '../hooks'
import { ROLE_OPTIONS, staffCreateSchema, type StaffCreateFormValues } from '../schemas/staffForm'
import { getErrorMessage } from '../utils/errorMessage'

export function StaffListPage() {
  const { data: staff, isLoading, isError, error: listError } = useStaffList()
  const createStaff = useCreateStaff()
  const deleteStaff = useDeleteStaff()

  const [modalOpen, setModalOpen] = useState(false)
  const [confirmingId, setConfirmingId] = useState<number | null>(null)

  const form = useForm<StaffCreateFormValues>({
    resolver: zodResolver(staffCreateSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
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
    createStaff.reset()
    reset({
      name: '',
      email: '',
      phone: '',
      role: 'SERVER',
    })
    setModalOpen(true)
  }

  const onSubmit = (values: StaffCreateFormValues) => {
    createStaff.mutate(
      {
        name: values.name.trim(),
        email: values.email.trim(),
        role: values.role,
        phone: values.phone?.trim() || undefined,
      },
      {
        onSuccess: () => {
          setModalOpen(false)
          reset()
        },
      },
    )
  }

  const handleDelete = (id: number) => {
    deleteStaff.mutate(id, {
      onSuccess: () => setConfirmingId(null),
    })
  }

  const listErrMsg = isError ? getErrorMessage(listError) : null
  const createErrMsg = createStaff.error
    ? getErrorMessage(createStaff.error)
    : null
  const deleteErrMsg = deleteStaff.error
    ? getErrorMessage(deleteStaff.error)
    : null

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-medium">Staff</h1>
        <Button type="button" onClick={openModal}>
          Add staff member
        </Button>
      </div>

      {listErrMsg ? (
        <p className="mt-4 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">
          {listErrMsg}
        </p>
      ) : null}

      {deleteErrMsg ? (
        <p className="mt-4 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">
          {deleteErrMsg}
        </p>
      ) : null}

      {isLoading ? (
        <p className="mt-6 text-sm text-gray-600">Loading staff…</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded border border-gray-300 bg-white">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-3 py-2 font-medium">Name</th>
                <th className="px-3 py-2 font-medium">Role</th>
                <th className="px-3 py-2 font-medium">Email</th>
                <th className="px-3 py-2 font-medium">Phone</th>
                <th className="px-3 py-2 font-medium w-40">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center text-gray-600">
                    No staff yet. Add a staff member to get started.
                  </td>
                </tr>
              ) : (
                staff?.map((row) => (
                  <tr key={row.id} className="border-b border-gray-100">
                    <td className="px-3 py-2">{row.name}</td>
                    <td className="px-3 py-2">{row.role}</td>
                    <td className="px-3 py-2">{row.email}</td>
                    <td className="px-3 py-2">{row.phone ?? '—'}</td>
                    <td className="px-3 py-2">
                      {confirmingId === row.id ? (
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="text-xs text-gray-600">Delete?</span>
                          <Button
                            type="button"
                            variant="danger"
                            loading={deleteStaff.isPending}
                            onClick={() => handleDelete(row.id)}
                          >
                            Confirm
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            disabled={deleteStaff.isPending}
                            onClick={() => setConfirmingId(null)}
                          >
                            Cancel
                          </Button>
                        </span>
                      ) : (
                        <Button
                          type="button"
                          variant="danger"
                          onClick={() => setConfirmingId(row.id)}
                        >
                          Delete
                        </Button>
                      )}
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
          createStaff.reset()
          setModalOpen(false)
        }}
        title="Add staff member"
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
            label="Name"
            autoComplete="name"
            {...register('name')}
            error={errors.name?.message}
          />
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            {...register('email')}
            error={errors.email?.message}
          />
          <Input
            label="Phone (optional)"
            type="tel"
            autoComplete="tel"
            {...register('phone')}
            error={errors.phone?.message}
          />
          <Select label="Role" {...register('role')} error={errors.role?.message}>
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
              disabled={createStaff.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" loading={createStaff.isPending}>
              Save
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
