import { useEffect, useRef } from 'react'
import { Mesh, NormalBlending, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, WebGLRenderer } from 'three'
import type { MotionValue } from 'framer-motion'
import { steamFragment, steamVertex } from './steamShader'

type Intensity = number | MotionValue<number>
const read = (v: Intensity) => (typeof v === 'number' ? v : v.get())

/**
 * One full-canvas quad running the steam shader.
 * Plain three.js with named imports (tree-shaken) — React Three Fiber would pull
 * in the whole THREE namespace for what is a single draw call.
 * Renders only while `active` (on screen) and caps DPR at 1.5.
 */
export default function SteamCanvas({ intensity = 1, active = true }: { intensity?: Intensity; active?: boolean }) {
  const host = useRef<HTMLDivElement>(null)
  const intensityRef = useRef(intensity)
  const activeRef = useRef(active)
  useEffect(() => {
    intensityRef.current = intensity
    activeRef.current = active
  }, [intensity, active])

  useEffect(() => {
    const el = host.current
    if (!el) return
    let renderer: WebGLRenderer
    try {
      renderer = new WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power', premultipliedAlpha: true })
    } catch {
      return // No WebGL — the section still works without steam.
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    renderer.setClearColor(0x000000, 0)
    Object.assign(renderer.domElement.style, { position: 'absolute', inset: '0', width: '100%', height: '100%' })
    renderer.domElement.setAttribute('aria-hidden', 'true')
    el.appendChild(renderer.domElement)

    const scene = new Scene()
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const material = new ShaderMaterial({
      vertexShader: steamVertex,
      fragmentShader: steamFragment,
      uniforms: { uTime: { value: Math.random() * 100 }, uIntensity: { value: 0 }, uAspect: { value: 1 } },
      transparent: true,
      depthWrite: false,
      depthTest: false,
      premultipliedAlpha: true,
      blending: NormalBlending,
    })
    const geometry = new PlaneGeometry(2, 2)
    const mesh = new Mesh(geometry, material)
    mesh.frustumCulled = false
    scene.add(mesh)

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = el
      renderer.setSize(w, h, false)
      material.uniforms.uAspect.value = w / Math.max(1, h)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(el)
    resize()

    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      if (!activeRef.current) return
      const u = material.uniforms
      u.uTime.value += dt
      // Ease toward the target so scroll-driven intensity never pops.
      u.uIntensity.value += (read(intensityRef.current) - u.uIntensity.value) * 0.08
      renderer.render(scene, camera)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={host} className="absolute inset-0" aria-hidden />
}
