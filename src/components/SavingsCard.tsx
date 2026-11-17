import {formatAmount, formatEuros} from '../lib/money'

type SavingCardProps = {
   /** Reste de la période, en centimes */
  remainingCents: number
  /** Reste minimum si chaque enveloppe est dépensée en entier, en centimes */
  minimumCents: number
}

export function SavingCard({remainingCents, minimumCents}:SavingCardProps){
  return (
    <section className='mt-4 rounded-[28px] bg-hero p-6 text-white'>
      <p className='text-[15px] font-semibold text-hero-muted'>
        Potentiellement économisable
      </p>
      <p className='mt-4 flex items-baseline gap-2 font-title'>
        <span className='text-5xl font-bold tracking-tight'>
          {formatAmount(remainingCents)}
        </span>
        <span className='text-3xl font-semibold text-hero-muted'>€</span>
      </p>
      <div className='my-4 h-px bg-white/20'></div>
      <p className='flex items-center justify-between gap-3 text-sm text-hero-muted'>
        Minimum si chaque enveloppe est respectée
        <span className='font-title text-xl font-bold text-white'>{formatEuros(minimumCents)}</span>
        </p>
    </section>
  )
}