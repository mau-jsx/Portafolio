/**
 * GLSL de la escena de fondo.
 *
 * La idea: un plano a pantalla completa con la fotografía del hero deformada
 * por ruido. El scroll empuja la deformación y separa los canales RGB; el
 * puntero abre un halo de nitidez. Sobre eso corre una capa de partículas.
 */

export const backgroundVertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const backgroundFragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uTexture;
  uniform vec2  uResolution;
  uniform vec2  uTextureSize;
  uniform vec2  uPointer;
  uniform float uTime;
  uniform float uProgress;   // 0 arriba de la página, 1 abajo
  uniform float uVelocity;   // inercia del scroll, con signo
  uniform float uIntensity;  // 0 apaga el efecto (reduced motion / fallback)
  uniform vec3  uAccent;
  uniform vec3  uBackground;
  uniform float uDark;       // 1 en tema oscuro, 0 en claro

  varying vec2 vUv;

  // Ruido simplex 2D (Ashima Arts, dominio público).
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m; m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // Recorta la textura como object-fit: cover.
  vec2 coverUv(vec2 uv, vec2 resolution, vec2 texSize) {
    vec2 ratio = vec2(
      min((resolution.x / resolution.y) / (texSize.x / texSize.y), 1.0),
      min((resolution.y / resolution.x) / (texSize.y / texSize.x), 1.0)
    );
    return vec2(
      uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      uv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );
  }

  void main() {
    vec2 uv = coverUv(vUv, uResolution, uTextureSize);

    // Parallax: el fondo se mueve menos que la página.
    uv.y += uProgress * 0.16;

    float aspect = uResolution.x / uResolution.y;
    vec2 pointer = vec2(uPointer.x * aspect, uPointer.y);
    vec2 pos = vec2(vUv.x * aspect, vUv.y);
    float pointerDist = distance(pos, pointer);
    float halo = smoothstep(0.55, 0.0, pointerDist);

    // Deformación: ruido lento + el empujón del scroll + el halo del puntero.
    float n = snoise(vec2(uv.x * 2.4, uv.y * 3.2 - uTime * 0.045));
    float wobble = n * (0.012 + abs(uVelocity) * 0.03) + halo * 0.014;
    vec2 warped = uv + vec2(wobble * 0.6, wobble);

    // Separación de canales proporcional a la inercia del scroll.
    float shift = (uVelocity * 0.010 + halo * 0.0035) * uIntensity;
    float r = texture2D(uTexture, warped + vec2(shift, 0.0)).r;
    float g = texture2D(uTexture, warped).g;
    float b = texture2D(uTexture, warped - vec2(shift, 0.0)).b;
    vec3 color = vec3(r, g, b);

    // Tinte de acento donde el puntero pasa y donde el ruido sube.
    float glow = halo * 0.5 + smoothstep(0.35, 1.0, n) * 0.18;
    color = mix(color, uAccent, glow * 0.42 * uIntensity);

    // Grano fino: evita el banding de los degradados.
    float grain = fract(sin(dot(vUv * uResolution + uTime, vec2(12.9898, 78.233))) * 43758.5453);
    color += (grain - 0.5) * 0.035;

    // Viñeta y fundido hacia el fondo del sitio a medida que bajás.
    float vignette = smoothstep(1.15, 0.25, length(vUv - 0.5));
    color = mix(uBackground, color, vignette);

    float presence = mix(0.42, 0.62, uDark) * (1.0 - uProgress * 0.55);
    color = mix(uBackground, color, presence);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export const particlesVertexShader = /* glsl */ `
  attribute float aScale;
  attribute float aSpeed;
  attribute float aOffset;

  uniform float uTime;
  uniform float uProgress;
  uniform float uVelocity;
  uniform vec2  uPointer;
  uniform float uPixelRatio;

  varying float vAlpha;

  void main() {
    vec3 pos = position;

    // Deriva vertical continua, envuelta dentro del volumen.
    pos.y = mod(pos.y - uTime * aSpeed * 0.35 + uVelocity * 3.0, 12.0) - 6.0;
    pos.x += sin(uTime * 0.25 * aSpeed + aOffset) * 0.35;
    pos.z += cos(uTime * 0.18 * aSpeed + aOffset) * 0.35;

    // Se apartan del puntero: la escena responde a la mano.
    vec2 toPointer = pos.xy - uPointer * vec2(4.5, 3.0);
    float push = smoothstep(2.2, 0.0, length(toPointer));
    pos.xy += normalize(toPointer + 0.0001) * push * 0.5;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = aScale * uPixelRatio * (14.0 / -mvPosition.z);

    // Se desvanecen al alejarse y cuando la página ya bajó.
    vAlpha = smoothstep(-9.0, -2.0, mvPosition.z) * (1.0 - uProgress * 0.7);
  }
`;

export const particlesFragmentShader = /* glsl */ `
  precision mediump float;

  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    // Punto circular con borde suave, sin textura.
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.1, d) * vAlpha;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(uColor, alpha * 0.55);
  }
`;
