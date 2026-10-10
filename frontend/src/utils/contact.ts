/** Lien tel: à partir d'un numéro affiché librement (« +33 (0)4 76… », « 04 76… ») */
export function telHref(phone: string): string {
  const cleaned = phone.replace(/\(0\)/g, '').replace(/[^\d+]/g, '')
  return `tel:${cleaned}`
}
