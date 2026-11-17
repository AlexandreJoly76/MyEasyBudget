/**
 * Formate un montant en centimes pour l'affichage, sans le symbole €.
 * Les centimes ne s'affichent que s'il y en a :
 *   226880 → "2 268,80"
 *   174000 → "1 740"
 */

export function formatAmount(cents: number): string {
  const decimals = cents % 100 === 0 ? 0 : 2
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(cents / 100)
}

/** Même chose, avec le symbole € : 174000 → "1 740 €" */
export function formatEuros(cents: number): string {
  return `${formatAmount(cents)} €`
}
