import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { AppLayout } from './pages/AppLayout'
import { DevCrudTestPage } from './pages/DevCrudTestPage'
import { ShiftDetailPagePlaceholder } from './pages/ShiftDetailPagePlaceholder'
import { ShiftsListPagePlaceholder } from './pages/ShiftsListPagePlaceholder'
import { StaffListPage } from './pages/StaffListPage'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<StaffListPage />} />
            <Route
              path="/shifts"
              element={<ShiftsListPagePlaceholder />}
            />
            <Route
              path="/shifts/:id"
              element={<ShiftDetailPagePlaceholder />}
            />
          </Route>
          <Route path="/dev" element={<DevCrudTestPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
