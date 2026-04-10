import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
          <h1 className="text-2xl font-semibold tracking-tight">
            Restaurant Scheduler
          </h1>
          <p className="mt-2 text-slate-400">
            Tailwind, React Query, and React Router are wired.
          </p>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
