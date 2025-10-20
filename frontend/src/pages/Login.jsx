import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { login, register, loading } = useAuth()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    const ok = mode === 'login'
      ? await login(email, password)
      : await register(email, name, password)
    if (ok) nav('/')
  }

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded-xl shadow">
      <h1 className="text-xl font-semibold mb-4">{mode === 'login' ? 'Login' : 'Register'}</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="border w-full p-2 rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        {mode === 'register' && (
          <input className="border w-full p-2 rounded" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        )}
        <input className="border w-full p-2 rounded" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded">{loading ? '...' : (mode==='login' ? 'Login' : 'Create account')}</button>
      </form>
      <div className="mt-3 text-sm">
        {mode==='login' ? (
          <button onClick={()=>setMode('register')} className="underline">No account? Register</button>
        ) : (
          <button onClick={()=>setMode('login')} className="underline">Have an account? Login</button>
        )}
      </div>
    </div>
  )
}
