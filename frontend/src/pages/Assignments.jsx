import React, { useState } from 'react'
import { post } from '../services/api'

export default function Assignments() {
  const [file, setFile] = useState(null)
  const [classId, setClassId] = useState('')

  const upload = async (e) => {
    e.preventDefault()
    if (!file || !classId) return alert('Choose file & classId')
    const fd = new FormData()
    fd.append('file', file)
    fd.append('classId', classId)
    const r = await fetch((import.meta.env.VITE_API_BASE || '/api') + '/files/upload', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('kh_token') },
      body: fd
    })
    const j = await r.json()
    if (!r.ok) return alert(j.error || 'Upload failed')
    alert('Uploaded: ' + j.submission.filename)
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Submit Assignment</h2>
      <form onSubmit={upload} className="space-y-3">
        <input className="border p-2 w-full rounded" placeholder="Class ID" value={classId} onChange={e=>setClassId(e.target.value)} />
        <input type="file" onChange={e=>setFile(e.target.files?.[0])} />
        <button className="bg-indigo-600 text-white px-3 py-2 rounded">Upload</button>
      </form>
    </div>
  )
}
