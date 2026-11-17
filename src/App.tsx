import { SavingsCard } from './components/SavingsCard'

function App() {
  return (
    <main className="mx-auto min-h-svh max-w-md px-5 pt-12">
      <p className="text-sm font-medium text-muted">
        5 nov. – 4 déc. · 17 jours restants
      </p>
      <h1 className="font-title text-3xl font-bold tracking-tight">Budget du foyer</h1>
      <SavingsCard remainingCents={226880} minimumCents={174000} />
    </main>
  )
}

export default App
