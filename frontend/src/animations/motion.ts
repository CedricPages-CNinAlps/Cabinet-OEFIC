import type { Directive } from 'vue'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import Atropos, { type AtroposInstance } from 'atropos'
import 'atropos/css'

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Défilement fluide (page publique uniquement). Renvoie la fonction de nettoyage. */
export function startSmoothScroll(): () => void {
  if (reducedMotion()) return () => {}
  // offset : hauteur de la barre de navigation fixe
  const lenis = new Lenis({ autoRaf: true, anchors: { offset: -80 } })
  return () => lenis.destroy()
}

type RevealEl = HTMLElement & { _reveal?: { anim: Animation; io: IntersectionObserver } }

/**
 * v-reveal="délai en secondes" : fondu + montée quand l'élément entre à l'écran.
 * Web Animations API sur `translate` (pas `transform`) pour ne pas gêner les effets de survol existants.
 */
export const vReveal: Directive<RevealEl, number | undefined> = {
  mounted(el, { value }) {
    if (reducedMotion() || !('IntersectionObserver' in window)) return
    const anim = el.animate(
      [{ opacity: 0, translate: '0 32px' }, { opacity: 1, translate: '0 0' }],
      { duration: 800, delay: (value ?? 0) * 1000, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both' }
    )
    anim.pause() // reste sur la première image (masqué) jusqu'à l'apparition
    const io = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) { anim.play(); io.disconnect() }
    }, { rootMargin: '0px 0px -10% 0px' })
    io.observe(el)
    el._reveal = { anim, io }
  },
  unmounted(el) {
    el._reveal?.io.disconnect()
    el._reveal?.anim.cancel()
  },
}

type MilkEl = HTMLElement & { _milk?: { off: () => void; gone: boolean } }

/** v-milk : voile laiteux animé derrière la section (WebGL chargé à la demande). */
export const vMilk: Directive<MilkEl, boolean | undefined> = {
  mounted(el, { value }) {
    if (reducedMotion() || value === false) return
    const state = { off: () => {}, gone: false }
    el._milk = state
    import('./milkyBackground').then(m => { if (!state.gone) state.off = m.attachMilk(el) })
  },
  unmounted(el) {
    if (!el._milk) return
    el._milk.gone = true
    el._milk.off()
  },
}

type TiltEl =HTMLElement & { _tilt?: AtroposInstance }

/** v-tilt : inclinaison 3D au survol (Atropos). L'élément doit contenir la structure .atropos-scale > .atropos-rotate > .atropos-inner. */
export const vTilt: Directive<TiltEl> = {
  mounted(el) {
    if (reducedMotion()) return
    el._tilt = Atropos({
      el, activeOffset: 30, shadow: false, highlight: true,
      rotateXMax: 8, rotateYMax: 8, rotateTouch: false,
    })
  },
  unmounted(el) {
    el._tilt?.destroy()
  },
}
