import { useState, type SubmitEvent } from 'react'
import { supabase } from '../lib/supabase'

type Mode = 'signIn' | 'signUp'

function tabClass(active: boolean) {
  return `h-11 flex-1 rounded-xl text-[15px] font-semibold ${
    active ? 'bg-surface text-ink shadow-sm' : 'text-muted'
  }`
}

export function LoginScreen() {
  const [mode, setMode] = useState<Mode>('signIn')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setInfo(null)

    const { data, error } =
      mode === 'signIn'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password })

    setLoading(false)

    if (error) {
      setError(
        error.code === 'invalid_credentials'
          ? 'Email ou mot de passe incorrect.'
          : error.message,
      )
      return
    }

    if (mode === 'signUp' && !data.session) {
      setInfo('Compte créé ! Clique sur le lien reçu par mail pour le confirmer.')
    }
  }

  const submitLabel = loading
    ? 'Patiente…'
    : mode === 'signIn'
      ? 'Se connecter'
      : 'Créer mon compte'

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col px-6 pt-22 pb-7">
      <div className="flex size-16 items-center justify-center rounded-[20px] bg-hero">
        <svg
          width="34"
          height="34"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 21v-9" />
          <path d="M12 12c0-4 3-6 7-6 0 4-3 6-7 6z" />
          <path d="M12 15c0-3-2.5-5-6-5 0 3 2.5 5 6 5z" />
        </svg>
      </div>

      <h1 className="mt-5 mb-1.5 font-title text-[32px] leading-tight font-bold tracking-tight">
        MyEasyBudget
      </h1>
      <p className="text-muted">Le budget de la maison, partagé en temps réel.</p>

      <div className="mt-7 flex gap-1 rounded-2xl bg-line p-1">
        <button
          type="button"
          aria-pressed={mode === 'signIn'}
          onClick={() => setMode('signIn')}
          className={tabClass(mode === 'signIn')}
        >
          Se connecter
        </button>
        <button
          type="button"
          aria-pressed={mode === 'signUp'}
          onClick={() => setMode('signUp')}
          className={tabClass(mode === 'signUp')}
        >
          Créer un compte
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3.5">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold">Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="prenom@exemple.fr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-13 rounded-[14px] border border-line bg-surface px-4 text-base"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold">Mot de passe</span>
          <input
            type="password"
            required
            minLength={8}
            autoComplete={mode === 'signIn' ? 'current-password' : 'new-password'}
            placeholder="8 caractères minimum"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-13 rounded-[14px] border border-line bg-surface px-4 text-base"
          />
        </label>

        {error && (
          <p role="alert" className="text-sm font-medium text-danger">
            {error}
          </p>
        )}
        {info && (
          <p role="status" className="text-sm font-medium text-brand">
            {info}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 h-15 rounded-[20px] bg-brand text-lg font-bold text-on-brand disabled:opacity-60"
        >
          {submitLabel}
        </button>
      </form>

      <p className="mt-auto flex items-center gap-2 pt-6 text-[13px] text-muted">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="shrink-0"
        >
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
        Tes données ne sont visibles que par les membres de ton foyer.
      </p>
    </main>
  )
}
