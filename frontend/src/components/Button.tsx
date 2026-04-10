import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'danger' | 'secondary'

const variantClass: Record<ButtonVariant, string> = {
  primary: 'border border-gray-400 bg-gray-100 hover:bg-gray-200',
  danger: 'border border-red-400 bg-red-50 text-red-900 hover:bg-red-100',
  secondary: 'border border-gray-300 bg-white hover:bg-gray-50',
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  loading?: boolean
  children?: ReactNode
}

export function Button({
  variant = 'primary',
  loading = false,
  disabled,
  className = '',
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  const isDisabled = Boolean(disabled || loading)
  const base =
    'inline-flex items-center justify-center rounded border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-60'
  return (
    <button
      type={type}
      className={`${base} ${variantClass[variant]} ${className}`.trim()}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...rest}
    >
      {children}
    </button>
  )
}
