import React, { useEffect, useState } from 'react'
import { get, post } from '../services/api'

export default function Classes() {
  const [items, setItems] = useState([])
  const [title, setTitle] = useState('')
  const [code, setCode] = useState('')

  const load = async () => {
    const data = await get('/classes', { take: 50 })
    setItems(data)
  }
  useEffect(() => { load() }, [])

  const create = async (e) => {
    e.preventDefault()
    await post('/classes', { title, code })
    setTitle(''); setCode('')
    load()
  }

  const enroll = async (id) => {
    await post(`/classes/${id}/enroll`, {})
    alert('Enrolled!')
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Create Class (Lecturer/Admin)</h2>
        <form onSubmit={create} className="flex gap-2">
          <input className="border p-2 rounded flex-1" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
          <input className="border p-2 rounded" placeholder="Code" value={code} onChange={e=>setCode(e.target.value)} />
          <button className="bg-indigo-600 text-white px-3 rounded">Create</button>
        </form>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">All Classes</h2>
        <ul className="divide-y">
          {items.map(c => (
            <li key={c.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{c.title} <span className="text-xs text-gray-500">({c.code})</span></div>
                <div className="text-xs text-gray-500">Owner: {c.owner?.name || c.ownerId}</div>
              </div>
              <div className="flex gap-2">
                <a href={`#/session/${c.id}`} className="text-sm underline">Sessions</a>
                <button onClick={()=>enroll(c.id)} className="text-sm bg-gray-100 px-2 py-1 rounded">Enroll</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
