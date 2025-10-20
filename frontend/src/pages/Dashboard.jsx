import React from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-semibold">Welcome{user ? `, ${user.name}` : ''}</h1>
      <p className="text-gray-600 mt-2">Use the nav to manage classes, sessions, QR, and assignments.</p>
    </div>
  )
}
