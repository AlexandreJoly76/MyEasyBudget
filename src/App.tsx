import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import { LoginScreen } from './components/LoginScreen'
import { SavingsCard } from './components/SavingsCard'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setLoading(false)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  if (loading) return null
  if (!session) return <LoginScreen />

  return (
    <main className="mx-auto min-h-svh max-w-md px-5 pt-12">
      <p className="text-sm font-medium text-muted">
        5 nov. – 4 déc. · 17 jours restants
      </p>
      <h1 className="font-title text-3xl font-bold tracking-tight">Budget du foyer</h1>
      <SavingsCard remainingCents={226880} minimumCents={174000} />

      <p className="mt-6 text-sm text-muted">Connecté : {session.user.email}</p>
      <button
        type="button"
        onClick={() => supabase.auth.signOut()}
        className="mt-2 text-sm font-bold text-brand"
      >
        Se déconnecter
      </button>
    </main>
  )
}

export default App
