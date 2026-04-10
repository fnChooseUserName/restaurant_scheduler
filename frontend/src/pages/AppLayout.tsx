import { Link, Outlet, useLocation } from 'react-router-dom'

const linkClass =
  'rounded border border-transparent px-3 py-1.5 text-sm hover:border-gray-300'
const activeClass = 'border-gray-400 bg-gray-100 font-medium'

export function AppLayout() {
  const { pathname } = useLocation()
  const staffActive = pathname === '/'
  const shiftsActive = pathname.startsWith('/shifts')

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-3">
          <span className="font-medium">Restaurant Scheduler</span>
          <nav className="flex gap-2" aria-label="Main">
            <Link
              to="/"
              className={`${linkClass} ${staffActive ? activeClass : ''}`}
            >
              Staff
            </Link>
            <Link
              to="/shifts"
              className={`${linkClass} ${shiftsActive ? activeClass : ''}`}
            >
              Shifts
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
