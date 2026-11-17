import { describe, expect, it } from 'vitest'
import { formatAmount, formatEuros } from './money'

// Intl.NumberFormat sépare les milliers avec une « espace fine insécable »
// (le caractère Unicode U+202F), et non avec une espace normale.
const NNBSP = '\u202F'

describe('formatAmount', () => {
  it('affiche les centimes quand il y en a', () => {
    expect(formatAmount(226880)).toBe(`2${NNBSP}268,80`)
  })

  it("n'affiche pas de décimales pour un montant rond", () => {
    expect(formatAmount(174000)).toBe(`1${NNBSP}740`)
  })

  it('affiche les petits montants correctement', () => {
    expect(formatAmount(2450)).toBe('24,50')
  })
})

describe('formatEuros', () => {
  it('ajoute le symbole €', () => {
    expect(formatEuros(174000)).toBe(`1${NNBSP}740 €`)
  })
})
