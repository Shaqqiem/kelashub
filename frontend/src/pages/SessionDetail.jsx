import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { get } from '../services/api'

export default function SessionDetail() {
  const { id } = useParams() // here id is classId based on link; list sessions for class
  const [items, setItems] = useState([])

  useEffect(() => {
    get('/sessions', { classId: id, take: 100 }).then(setItems)
  }, [id])

  const genQR = async (sid) => {
    const r = await get(`/sessions/${sid}/qr`)
    const w = window.open('','qr','width=360,height=420')
    w.document.write(`<img src="${r.dataUrl}" /><p>TTL: ${r.ttl}s</p>`)
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      <h2 className="text-xl font-semibold">Sessions</h2>
      <ul className="divide-y">
        {items.map(s => (
          <li key={s.id} className="py-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{s.title}</div>
              <div className="text-xs text-gray-500">{new Date(s.startsAt).toLocaleString()} — {new Date(s.endsAt).toLocaleString()}</div>
            </div>
            <button onClick={()=>genQR(s.id)} className="text-sm bg-indigo-600 text-white px-3 py-1 rounded">QR</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
