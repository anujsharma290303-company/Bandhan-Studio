import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import { LoginPage } from './pages/shared/LoginPage'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { MemberDashboard } from './pages/member/MemberDashboard'
import { AdminGuard } from './components/guards/AdminGuard'
import { MemberGuard } from './components/guards/MemberGuard'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/admin"
            element={
              <AdminGuard>
                <AdminDashboard />
              </AdminGuard>
            }
          />

          <Route
            path="/member"
            element={
              <MemberGuard>
                <MemberDashboard />
              </MemberGuard>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)