// src/app/auth/page.tsx
'use client'

import { supabase } from '@/lib/supabaseClient'
import { useState } from 'react'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in')
  const [message, setMessage] = useState<string | null>(null)

  const handleAuth = async () => {
    const { error } = mode === 'sign-in'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })

    if (error) setMessage(error.message)
    else setMessage('Erfolgreich – du bist angemeldet!')
  }

  return (
    <div className="p-4 max-w-sm mx-auto space-y-4">
      <h1 className="text-xl font-bold">TRAI – {mode === 'sign-in' ? 'Sign In' : 'Sign Up'}</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border rounded p-2 bg-background"
      />
      <input
        type="password"
        placeholder="Passwort"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border rounded p-2 bg-background"
      />

      <button
        onClick={handleAuth}
        className="w-full p-2 bg-primary text-white rounded"
      >
        {mode === 'sign-in' ? 'Einloggen' : 'Konto erstellen'}
      </button>

      <button
        onClick={() => setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')}
        className="text-sm underline"
      >
        {mode === 'sign-in' ? 'Noch kein Konto? Registrieren' : 'Zurück zum Login'}
      </button>

      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  )
}
