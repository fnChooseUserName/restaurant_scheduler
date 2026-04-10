import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { AppLayout } from './pages/AppLayout'
import { ShiftDetailPage } from './pages/ShiftDetailPage'
import { ShiftsListPage } from './pages/ShiftsListPage'
import { StaffListPage } from './pages/StaffListPage'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<StaffListPage />} />
            <Route path="/shifts" element={<ShiftsListPage />} />
            <Route path="/shifts/:id" element={<ShiftDetailPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
