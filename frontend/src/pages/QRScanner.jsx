import React, { useState } from 'react'
import { QrReader } from 'react-qr-reader'
import { post } from '../services/api'

export default function QRScanner() {
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const onResult = async (text) => {
    if (!text || result) return
    try {
      const r = await post('/attendance/scan', { token: text })
      setResult(JSON.stringify(r))
    } catch (e) {
      setError(e?.response?.data?.error || 'Scan failed')
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold mb-2">QR Scanner</h2>
      <div className="bg-white p-3 rounded shadow">
        <QrReader
          constraints={{ facingMode: 'environment' }}
          onResult={(res, err) => {
            if (!!res) onResult(res.getText())
            if (!!err) {/* no-op noisy */}
          }}
          containerStyle={{ width: '100%' }}
        />
      </div>
      {result && <div className="mt-3 p-2 bg-green-50 border text-sm break-words">{result}</div>}
      {error && <div className="mt-3 p-2 bg-red-50 border text-sm">{error}</div>}
    </div>
  )
}
