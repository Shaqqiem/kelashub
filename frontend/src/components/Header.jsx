import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { get, post } from '../services/api'

export default function Header() {
  const { user, logout } = useAuth()

  const enablePush = async () => {
    if (!('serviceWorker' in navigator && 'PushManager' in window)) {
      alert('Push not supported'); return
    }
    const reg = await navigator.serviceWorker.ready
    const { key } = await get('/push/vapid-public')
    if (!key) { alert('VAPID not configured'); return }
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(key)
    })
    await post('/push/subscribe', sub.toJSON())
    alert('Push enabled')
  }

  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    const raw = atob(base64)
    const output = new Uint8Array(raw.length)
    for (let i=0;i<raw.length;i++) output[i] = raw.charCodeAt(i)
    return output
  }

  return (
    <header className="bg-white shadow">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold">KelasHub</Link>
        <nav className="flex gap-4">
          <Link to="/classes" className="text-sm text-gray-700 hover:underline">Classes</Link>
          <Link to="/assignments" className="text-sm text-gray-700 hover:underline">Assignments</Link>
          <Link to="/qr" className="text-sm text-gray-700 hover:underline">QR Scanner</Link>
          <button onClick={enablePush} className="text-sm bg-indigo-600 text-white px-3 py-1 rounded">Enable Push</button>
          {user ? (
            <button onClick={logout} className="text-sm text-gray-600">Logout</button>
          ) : (
            <Link to="/login" className="text-sm text-gray-700 hover:underline">Login</Link>
          )}
        </nav>
      </div>
    </header>
  )
}
