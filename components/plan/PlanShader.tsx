'use client';

import { useEffect, useRef } from 'react';

const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.55;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = uv;
  p.x *= u_res.x / u_res.y;

  float t = u_time * 0.05;

  // Drifting nebula field
  float n1 = fbm(p * 1.6 + vec2(t * 1.4, -t * 0.7));
  float n2 = fbm(p * 2.6 - vec2(t * 0.9, t * 1.1) + n1 * 1.5);

  vec3 base = vec3(0.023, 0.023, 0.043);
  vec3 violet = vec3(0.545, 0.435, 0.961);
  vec3 cyan = vec3(0.133, 0.651, 0.933);
  vec3 magenta = vec3(0.851, 0.341, 0.624);

  // Aurora ribbons arcing across the upper half
  float band = smoothstep(0.15, 0.75, n2) * smoothstep(1.05, 0.35, uv.y);
  float band2 = smoothstep(0.35, 0.85, fbm(p * 2.0 + vec2(-t, t * 0.6))) * smoothstep(1.1, 0.5, uv.y);

  vec3 col = base;
  col = mix(col, violet, band * 0.55);
  col = mix(col, cyan, band2 * 0.28);
  col += magenta * pow(n1, 3.0) * 0.35 * smoothstep(0.9, 0.2, uv.y);

  // Soft glow pooling near the top-center, behind the headline
  vec2 c = vec2(0.5 * u_res.x / u_res.y, 0.82);
  float d = distance(p, c);
  col += violet * 0.22 * exp(-d * d * 6.0);
  col += cyan * 0.08 * exp(-d * d * 14.0);

  // Vignette to melt edges into the app background
  float vig = smoothstep(1.25, 0.35, distance(uv, vec2(0.5, 0.45)));
  col *= mix(0.55, 1.0, vig);

  // Fine grain so gradients never band
  float g = hash(gl_FragCoord.xy + fract(u_time) * 7.13) - 0.5;
  col += g * 0.028;

  gl_FragColor = vec4(col, 1.0);
}
`;

/**
 * Ambient aurora shader behind the Plan page.
 * Constant slow motion (decorative, non-interactive), frozen to a
 * single frame when the user prefers reduced motion.
 */
export function PlanShader({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', {
      antialias: false,
      alpha: false,
      powerPreference: 'low-power',
    });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const shader = gl.createShader(type);
      if (!shader) throw new Error('shader');
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader) ?? 'compile');
      }
      return shader;
    };

    let program: WebGLProgram | null = null;
    try {
      program = gl.createProgram();
      if (!program) return;
      gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    } catch {
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(program, 'a_pos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, 'u_res');
    const uTime = gl.getUniformLocation(program, 'u_time');

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    let raf = 0;
    let start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const render = (time: number) => {
      resize();
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    if (reduceMotion) {
      render(8);
      const onResize = () => render(8);
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }

    const loop = (now: number) => {
      if (document.hidden) {
        raf = requestAnimationFrame(loop);
        return;
      }
      render((now - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      start = 0;
      // Note: intentionally NOT calling WEBGL_lose_context here — the
      // canvas element persists across effect re-runs (e.g. StrictMode
      // remounts) and losing the context would break the next mount,
      // which reuses the same context object.
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className ?? 'absolute inset-0 h-full w-full'}
    />
  );
}
