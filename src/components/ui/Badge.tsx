import { clsx } from 'clsx'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'blue' | 'green' | 'yellow'
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        {
          'bg-zinc-800 text-zinc-400': variant === 'default',
          'bg-blue-900/50 text-blue-300': variant === 'blue',
          'bg-green-900/50 text-green-300': variant === 'green',
          'bg-yellow-900/50 text-yellow-300': variant === 'yellow',
        },
      )}
    >
      {children}
    </span>
  )
}
