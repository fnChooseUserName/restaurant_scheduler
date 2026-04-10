import { useParams } from 'react-router-dom'

export function ShiftDetailPagePlaceholder() {
  const { id } = useParams<{ id: string }>()

  return (
    <div>
      <h1 className="text-xl font-medium">Shift detail</h1>
      <p className="mt-2 text-sm text-gray-600">
        Placeholder for shift id:{' '}
        <code className="rounded bg-gray-200 px-1">{id ?? '—'}</code> — full
        page ships with the shifts vertical slice.
      </p>
    </div>
  )
}
