import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import { AdminGuard } from './components/guards/AdminGuard'
import { MemberGuard } from './components/guards/MemberGuard'
import { AdminLayout } from './components/layout/AdminLayout'
import { LoginPage } from './pages/shared/LoginPage'

import { AdminDashboard } from './pages/admin/AdminDashboard'
import { ClientsList } from './pages/admin/ClientsList'
import { MemberDashboard } from './pages/member/MemberDashboard'
import { QuotationsList }   from './pages/admin/QuotationsList'
import { QuotationBuilder } from './pages/admin/QuotationBuilder'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            {/* Admin routes — all share AdminLayout */}
            <Route
              path="/admin"
              element={
                <AdminGuard>
                  <AdminLayout />
                </AdminGuard>
              }
            >
              <Route index              element={<AdminDashboard />} />
              <Route path="clients"     element={<ClientsList />} />
              <Route path="quotations"     element={<QuotationsList />} />
              <Route path="quotations/new" element={<QuotationBuilder />} />
            </Route>

            {/* Member routes */}
            <Route
              path="/member"
              element={<MemberGuard><MemberDashboard /></MemberGuard>}
            />

            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
)