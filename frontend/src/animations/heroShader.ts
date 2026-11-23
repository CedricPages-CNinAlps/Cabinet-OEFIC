import { Renderer, Program, Mesh, Triangle } from 'ogl'

const vertex = /* glsl */ `
attribute vec2 uv; attribute vec2 position; varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position, 0., 1.); }`

// Soie bleu nuit (#1e1a34 / #2d2850 / #1a2b4a) avec reflets or (#C9A84C)
const fragment = /* glsl */ `
precision highp float;
uniform float uTime; uniform vec2 uRes; varying vec2 vUv;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) { float v = 0., a = .5; for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.; a *= .5; } return v; }
void main() {
  vec2 p = vUv * vec2(uRes.x / uRes.y, 1.) * 1.8;
  float t = uTime * .04;
  vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
  float f = fbm(p + 2. * q + vec2(t * .6, -t * .4));
  vec3 c = mix(vec3(.118, .102, .204), vec3(.176, .157, .314), smoothstep(.2, .8, f));
  c = mix(c, vec3(.102, .169, .290), smoothstep(.4, .9, q.x));
  c += vec3(.788, .659, .298) * smoothstep(.62, .9, f) * .22;
  gl_FragColor = vec4(c, 1.);
}`

/** Monte le fond animé dans `container`. Renvoie la fonction de nettoyage (no-op si WebGL indisponible : le dégradé CSS reste). */
export function mountHeroShader(container: HTMLElement): () => void {
  let renderer: Renderer
  try {
    renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 1.5), alpha: true })
  } catch {
    return () => {}
  }
  const gl = renderer.gl
  if (!gl) return () => {}
  container.appendChild(gl.canvas)

  const program = new Program(gl, { vertex, fragment, uniforms: { uTime: { value: 0 }, uRes: { value: [1, 1] } } })
  const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })

  const resize = () => {
    renderer.setSize(container.clientWidth, container.clientHeight)
    program.uniforms.uRes.value = [container.clientWidth, container.clientHeight]
  }
  const ro = new ResizeObserver(resize)
  ro.observe(container)
  resize()

  // Pause hors écran ou onglet caché
  let visible = true
  let raf = 0
  const loop = (t: number) => {
    raf = requestAnimationFrame(loop)
    program.uniforms.uTime.value = t * 0.001
    renderer.render({ scene: mesh })
  }
  const sync = () => {
    cancelAnimationFrame(raf)
    if (visible && !document.hidden) raf = requestAnimationFrame(loop)
  }
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync() })
  io.observe(container)
  document.addEventListener('visibilitychange', sync)
  sync()

  return () => {
    cancelAnimationFrame(raf)
    io.disconnect()
    ro.disconnect()
    document.removeEventListener('visibilitychange', sync)
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    gl.canvas.remove()
  }
}
