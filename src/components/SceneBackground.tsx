import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { registerGsap, prefersReducedMotion } from '../lib/motion';
import {
  backgroundVertexShader,
  backgroundFragmentShader,
  particlesVertexShader,
  particlesFragmentShader,
} from '../lib/shaders';

interface SceneBackgroundProps {
  texture: string;
  textureWidth: number;
  textureHeight: number;
}

const PARTICLE_COUNT = 240;

function readTheme() {
  const styles = getComputedStyle(document.documentElement);
  return {
    accent: new THREE.Color(styles.getPropertyValue('--accent').trim() || '#00d26a'),
    background: new THREE.Color(styles.getPropertyValue('--bg').trim() || '#0a0a0a'),
    dark: document.documentElement.classList.contains('dark') ? 1 : 0,
  };
}

/**
 * Escena WebGL de fondo, fija detrás del documento: la fotografía deformada
 * por shader más una capa de partículas. Scroll, velocidad de scroll y puntero
 * entran como uniforms, así el fondo reacciona a lo mismo que la página.
 *
 * La calidad se degrada sola. Si el equipo no sostiene el cuadro, primero
 * bajan las partículas, después la resolución interna y al final la escena se
 * apaga y queda el fondo plano. Nunca al revés: no vale trabar la página por
 * un efecto decorativo.
 */
export default function SceneBackground({
  texture,
  textureWidth,
  textureHeight,
}: SceneBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    registerGsap();
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (prefersReducedMotion()) return;

    // En pantallas chicas el shader cuesta más de lo que aporta.
    if (window.innerWidth < 900 || !window.matchMedia('(pointer: fine)').matches) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        alpha: false,
        powerPreference: 'high-performance',
      });
    } catch {
      return; // Sin WebGL usable: queda el fondo plano del contenedor.
    }

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const particleScene = new THREE.Scene();
    const particleCamera = new THREE.PerspectiveCamera(52, 1, 0.1, 30);
    particleCamera.position.z = 6;

    const theme = readTheme();
    const pointer = new THREE.Vector2(0.5, 0.5);
    const smoothPointer = new THREE.Vector2(0.5, 0.5);

    let onTextureReady: (() => void) | null = null;
    const map = new THREE.TextureLoader().load(texture, () => onTextureReady?.());
    map.colorSpace = THREE.SRGBColorSpace;
    map.minFilter = THREE.LinearFilter;
    map.generateMipmaps = false;

    const shared = {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uVelocity: { value: 0 },
      uPointer: { value: smoothPointer },
    };

    const planeMaterial = new THREE.ShaderMaterial({
      vertexShader: backgroundVertexShader,
      fragmentShader: backgroundFragmentShader,
      uniforms: {
        ...shared,
        uTexture: { value: map },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uTextureSize: { value: new THREE.Vector2(textureWidth, textureHeight) },
        uIntensity: { value: 1 },
        uAccent: { value: theme.accent },
        uBackground: { value: theme.background },
        uDark: { value: theme.dark },
      },
    });

    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), planeMaterial));

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const scales = new Float32Array(PARTICLE_COUNT);
    const speeds = new Float32Array(PARTICLE_COUNT);
    const offsets = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = -Math.random() * 8 - 1;
      scales[i] = Math.random() * 2.2 + 0.6;
      speeds[i] = Math.random() * 0.9 + 0.35;
      offsets[i] = Math.random() * Math.PI * 2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
    geometry.setAttribute('aOffset', new THREE.BufferAttribute(offsets, 1));

    const particleMaterial = new THREE.ShaderMaterial({
      vertexShader: particlesVertexShader,
      fragmentShader: particlesFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { ...shared, uColor: { value: theme.accent }, uPixelRatio: { value: 1 } },
    });

    particleScene.add(new THREE.Points(geometry, particleMaterial));

    /* Calidad adaptativa. */
    let quality = 2; // 2 = completa, 1 = sin partículas, 0 = apagada
    let scale = 0.9;

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * scale;

      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height, false);
      planeMaterial.uniforms.uResolution.value.set(width, height);
      particleMaterial.uniforms.uPixelRatio.value = dpr;
      particleCamera.aspect = width / height;
      particleCamera.updateProjectionMatrix();
    };

    resize();
    window.addEventListener('resize', resize);

    const onPointerMove = (event: PointerEvent) => {
      pointer.set(event.clientX / window.innerWidth, 1 - event.clientY / window.innerHeight);
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const onContextLost = (event: Event) => {
      event.preventDefault();
      quality = 0;
    };
    canvas.addEventListener('webglcontextlost', onContextLost);

    const themeObserver = new MutationObserver(() => {
      const next = readTheme();
      const { r: ar, g: ag, b: ab } = next.accent;
      const { r: br, g: bg, b: bb } = next.background;
      gsap.to(planeMaterial.uniforms.uAccent.value, { r: ar, g: ag, b: ab, duration: 0.6 });
      gsap.to(planeMaterial.uniforms.uBackground.value, { r: br, g: bg, b: bb, duration: 0.6 });
      gsap.to(planeMaterial.uniforms.uDark, { value: next.dark, duration: 0.6 });
      particleMaterial.uniforms.uColor.value.copy(next.accent);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    const scrollTrigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        shared.uProgress.value = self.progress;
        const velocity = gsap.utils.clamp(-1.6, 1.6, self.getVelocity() / 2200);
        gsap.to(shared.uVelocity, { value: velocity, duration: 0.5, overwrite: true });
      },
    });

    /*
     * Bucle propio con rAF, no el ticker de GSAP: si la escena se pone cara no
     * arrastra consigo a las animaciones de la interfaz.
     */
    let raf = 0;
    let last = performance.now();
    let elapsed = 0;
    let slowFrames = 0;
    let checked = 0;
    const FRAME_BUDGET = 1000 / 40; // no hace falta más de 40 fps de fondo

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (document.hidden || quality === 0) return;

      const delta = now - last;
      if (delta < FRAME_BUDGET) return;
      last = now;
      elapsed += delta / 1000;

      // Degradación: dos segundos de cuadros caros bajan un escalón.
      checked += 1;
      if (delta > 60) slowFrames += 1;
      if (checked >= 80) {
        if (slowFrames > 32) {
          quality -= 1;
          if (quality === 1) {
            scale = 0.65;
            resize();
          }
        }
        checked = 0;
        slowFrames = 0;
      }

      shared.uTime.value = elapsed;
      smoothPointer.lerp(pointer, 0.06);

      renderer.autoClear = true;
      renderer.render(scene, camera);
      if (quality >= 2) {
        renderer.autoClear = false;
        renderer.render(particleScene, particleCamera);
      }
    };

    /*
     * Un primer cuadro incondicional. El bucle se apaga con document.hidden
     * para no gastar GPU en pestañas de fondo, pero ese flag no es fiable en
     * todos los contextos embebidos: sin este dibujo inicial la escena podría
     * quedar en negro para siempre.
     */
    const drawOnce = () => {
      renderer.autoClear = true;
      renderer.render(scene, camera);
      renderer.autoClear = false;
      renderer.render(particleScene, particleCamera);
    };

    drawOnce();
    // La textura suele llegar después del primer cuadro: se repinta al cargar.
    onTextureReady = drawOnce;
    if (map.image) drawOnce();

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      scrollTrigger.kill();
      themeObserver.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      geometry.dispose();
      planeMaterial.dispose();
      particleMaterial.dispose();
      map.dispose();
      renderer.dispose();
    };
  }, [texture, textureWidth, textureHeight]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 bg-[var(--bg)]">
      {/* Respaldo cuando la escena no corre: el mismo clima, sin WebGL. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(120% 90% at 70% 10%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 60%), url(${texture})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--bg)_62%,transparent)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg)]" />
      <canvas ref={canvasRef} className="relative h-full w-full" />
    </div>
  );
}
