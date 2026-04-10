import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'

import { DevCrudTestPage } from './pages/DevCrudTestPage'

const queryClient = new QueryClient()

function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <h1 className="text-2xl font-semibold tracking-tight">
        Restaurant Scheduler
      </h1>
      <p className="mt-2 text-slate-400">
        Tailwind, React Query, and React Router are wired.
      </p>
      <p className="mt-4">
        <Link to="/dev" className="text-sky-400 underline">
          Open API playground (manual CRUD smoke test)
        </Link>
      </p>
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dev" element={<DevCrudTestPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
