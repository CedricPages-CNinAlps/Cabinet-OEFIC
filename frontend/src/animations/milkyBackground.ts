import { Renderer, Program, Mesh, Triangle } from 'ogl'

/*
 * Voile « laiteux » animé derrière une section : blanc (+ reflets or) sur fond foncé, bleu nuit sur fond clair.
 * Un seul contexte WebGL pour toute la page : l'effet est calculé en basse résolution (le voile est flou)
 * puis recopié dans un canvas 2D par section visible.
 */

const W = 384
const H = 216

const vertex = /* glsl */ `
attribute vec2 uv; attribute vec2 position; varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position, 0., 1.); }`

const fragment = /* glsl */ `
precision highp float;
uniform float uTime; uniform float uSeed; uniform float uAspect;
uniform vec3 uMilk; uniform float uStrength; uniform float uGold;
varying vec2 vUv;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) { float v = 0., a = .5; for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.; a *= .5; } return v; }
void main() {
  vec2 p = vUv * vec2(uAspect, 1.) * 1.8 + uSeed;
  float t = uTime * .04;
  vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
  float f = fbm(p + 2. * q + vec2(t * .6, -t * .4));
  float a = smoothstep(.25, .85, f) * uStrength;
  float g = smoothstep(.62, .9, f) * uGold;
  gl_FragColor = vec4(uMilk * a + vec3(.788, .659, .298) * g, min(a + g, 1.)); // alpha prémultiplié
}`

const DARK = { milk: [1, 1, 1], strength: 0.16, gold: 0.1 }
const LIGHT = { milk: [0.118, 0.102, 0.204], strength: 0.08, gold: 0 } // #1e1a34

interface Entry { section: HTMLElement; ctx: CanvasRenderingContext2D; visible: boolean; seed: number; theme: typeof DARK }

const entries = new Set<Entry>()
let gl: Renderer['gl'] | null = null
let renderer: Renderer | null = null
let program: Program | null = null
let mesh: Mesh | null = null
let raf = 0

function themeOf(el: HTMLElement) {
  const m = getComputedStyle(el).backgroundColor.match(/[\d.]+/g)?.map(Number) ?? []
  const [r = 0, g = 0, b = 0, alpha = 1] = m
  // fond transparent = dégradé en image (hero) : foncé
  if (alpha === 0) return DARK
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5 ? DARK : LIGHT
}

function loop(t: number) {
  raf = requestAnimationFrame(loop)
  if (!renderer || !program || !mesh || !gl) return
  for (const e of entries) {
    if (!e.visible) continue
    const u = program.uniforms
    u.uTime.value = t * 0.001
    u.uSeed.value = e.seed
    u.uAspect.value = e.section.clientWidth / Math.max(e.section.clientHeight, 1)
    u.uMilk.value = e.theme.milk
    u.uStrength.value = e.theme.strength
    u.uGold.value = e.theme.gold
    renderer.render({ scene: mesh })
    e.ctx.clearRect(0, 0, W, H)
    e.ctx.drawImage(gl.canvas, 0, 0)
  }
}

function sync() {
  cancelAnimationFrame(raf)
  if (!document.hidden && [...entries].some(e => e.visible)) raf = requestAnimationFrame(loop)
}

function ensureRenderer(): boolean {
  if (renderer) return true
  try {
    renderer = new Renderer({ width: W, height: H, dpr: 1, alpha: true, premultipliedAlpha: true })
  } catch {
    return false
  }
  if (!renderer.gl) { renderer = null; return false }
  gl = renderer.gl
  program = new Program(gl, {
    vertex, fragment, transparent: true,
    uniforms: {
      uTime: { value: 0 }, uSeed: { value: 0 }, uAspect: { value: 1 },
      uMilk: { value: DARK.milk }, uStrength: { value: 0 }, uGold: { value: 0 },
    },
  })
  mesh = new Mesh(gl, { geometry: new Triangle(gl), program })
  document.addEventListener('visibilitychange', sync)
  return true
}

function releaseRenderer() {
  cancelAnimationFrame(raf)
  document.removeEventListener('visibilitychange', sync)
  gl?.getExtension('WEBGL_lose_context')?.loseContext()
  renderer = program = mesh = gl = null
}

/** Ajoute le voile animé derrière `section`. Renvoie la fonction de nettoyage (no-op sans WebGL : le fond CSS reste). */
export function attachMilk(section: HTMLElement): () => void {
  if (!ensureRenderer()) return () => {}

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  canvas.setAttribute('aria-hidden', 'true')
  Object.assign(canvas.style, {
    position: 'absolute', inset: '0', width: '100%', height: '100%', zIndex: '-1', pointerEvents: 'none',
  })
  // Le canvas passe sous le contenu mais au-dessus du fond de la section
  if (getComputedStyle(section).position === 'static') section.style.position = 'relative'
  section.style.isolation = 'isolate'
  section.prepend(canvas)

  const entry: Entry = {
    section, ctx: canvas.getContext('2d')!, visible: false, seed: entries.size * 7.31, theme: DARK,
  }
  entries.add(entry)

  const io = new IntersectionObserver(([e]) => {
    entry.visible = e.isIntersecting
    // relu à chaque apparition : suit les couleurs choisies dans le backoffice
    if (entry.visible) entry.theme = themeOf(section)
    sync()
  })
  io.observe(section)

  return () => {
    io.disconnect()
    entries.delete(entry)
    canvas.remove()
    if (entries.size) sync()
    else releaseRenderer()
  }
}
