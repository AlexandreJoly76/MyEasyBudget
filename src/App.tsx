function App() {
  return (
    <main className="mx-auto min-h-svh max-w-md px-5 pt-12">
      <p className="text-sm font-medium text-muted">
        5 nov. – 4 déc. · 17 jours restants
      </p>
      <h1 className="font-title text-3xl font-bold tracking-tight">
        Budget du foyer
      </h1>

      <section className="mt-4 rounded-[28px] bg-hero p-6 text-white">
        <p className="text-[15px] font-semibold text-hero-muted">
          Potentiellement économisable
        </p>

        <p className="mt-4 flex items-baseline gap-2 font-title">
          <span className="text-5xl font-bold tracking-tight">2 268,80</span>
          <span className="text-3xl font-semibold text-hero-muted">€</span>
        </p>

        <div className="my-4 h-px bg-white/20" />

        <p className="flex items-center justify-between gap-3 text-sm text-hero-muted">
          Minimum si chaque enveloppe est respectée
          <span className="font-title text-xl font-bold text-white">1 740 €</span>
        </p>
      </section>
    </main>
  )
}

export default App