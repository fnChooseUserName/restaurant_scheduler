import { forwardRef, useId, type SelectHTMLAttributes } from 'react'

export type SelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'id'
> & {
  label: string
  error?: string
  id?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    { label, error, id: idProp, className = '', children, ...rest },
    ref,
  ) {
    const uid = useId()
    const selectId = idProp ?? `select-${uid}`
    const errorId = `${selectId}-error`

    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={selectId} className="text-sm">
          {label}
        </label>
        <select
          ref={ref}
          id={selectId}
          className={[
            'rounded border border-gray-300 bg-white px-2 py-1 text-sm',
            error ? 'border-red-500' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          {...rest}
        >
          {children}
        </select>
        {error ? (
          <p id={errorId} className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    )
  },
)
