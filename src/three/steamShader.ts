/**
 * Soft volumetric steam — two octaves of domain-warped fbm rising over time.
 * Rendered on a single full-canvas quad, so the cost is one fragment shader
 * pass at ≤1.5 DPR. No particles, no textures.
 */
export const steamVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

export const steamFragment = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uIntensity;
  uniform float uAspect;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + 11.7; a *= 0.5; }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.07;
    vec2 p = vec2((uv.x - 0.5) * uAspect * 2.4, uv.y * 2.0 - t * 2.4);
    // Steam leans and curls as it rises.
    p.x += sin(uv.y * 3.0 + t * 4.0) * 0.18 * uv.y;
    float warp = fbm(p * 1.3 + vec2(0.0, t));
    float n = fbm(p + warp * 1.1);

    float column = smoothstep(0.0, 0.32, uv.x) * smoothstep(1.0, 0.68, uv.x);
    float rise = smoothstep(0.02, 0.3, uv.y) * smoothstep(1.0, 0.5, uv.y);
    float a = smoothstep(0.48, 0.9, n) * column * rise * uIntensity;

    gl_FragColor = vec4(vec3(1.0, 0.975, 0.94) * a, a * 0.6);
  }
`
