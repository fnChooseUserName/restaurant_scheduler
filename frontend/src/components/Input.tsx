import { forwardRef, useId, type InputHTMLAttributes } from 'react'

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  label: string
  error?: string
  id?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, id: idProp, className = '', ...rest },
  ref,
) {
  const uid = useId()
  const inputId = idProp ?? `input-${uid}`
  const errorId = `${inputId}-error`

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-sm">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        className={[
          'rounded border border-gray-300 px-2 py-1 text-sm',
          error ? 'border-red-500' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...rest}
      />
      {error ? (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
})
