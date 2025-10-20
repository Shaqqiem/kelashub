import React from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthProvider, { useAuth } from './contexts/AuthContext'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Classes from './pages/Classes'
import SessionDetail from './pages/SessionDetail'
import QRScanner from './pages/QRScanner'
import Assignments from './pages/Assignments'
import NotFound from './pages/NotFound'

function Protected({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Header />
        <main className="py-6">
          <Routes>
            <Route path="/" element={<Protected><Dashboard/></Protected>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/classes" element={<Protected><Classes/></Protected>} />
            <Route path="/session/:id" element={<Protected><SessionDetail/></Protected>} />
            <Route path="/qr" element={<Protected><QRScanner/></Protected>} />
            <Route path="/assignments" element={<Protected><Assignments/></Protected>} />
            <Route path="*" element={<NotFound/>} />
          </Routes>
        </main>
      </HashRouter>
    </AuthProvider>
  )
}
