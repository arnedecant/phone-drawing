//#define GLSLIFY 1

uniform float time;
uniform float density;
uniform bool isWebcam;
uniform bool isPlaying;

varying vec4 vMvPosition;
varying vec3 vColor;
varying vec3 vPosition;

void main() {

    vec2 uv = gl_PointCoord.xy * 2.0 - 1.0;
    vec3 color = vec3(0.005);

    if (vPosition.z > 0.1 || isWebcam == true) {

        float orb = density / length(uv * 2.0);

        orb = smoothstep(0.0, 1.0, orb);
        color = vec3(orb) * vColor;

    }

    gl_FragColor = vec4(color, 1.0);
    
}











// -------------------------------------------------------------------
// :: WORK IN PROGRESS
// -------------------------------------------------------------------

// uniform float time;
// uniform sampler2D texFire;
// uniform bool playing;

// varying vec2 vUv;
// varying vec4 vMvPosition;
// varying vec3 vColor;
// varying vec3 vPosition;

// void main() {

//     vec2 uv;
//     vec2 noise = vec2(0.0);

//     // Generate noisy y value
//     uv = vec2(vUv.x * 0.7 - 0.01, fract(vUv.y - time * 0.35));
//     noise.y = (texture2D(texFire, uv).a - 0.5) * 2.0;
//     uv = vec2(vUv.x * 0.45 + 0.033, fract(vUv.y * 1.9 - time * 0.45));
//     noise.y += (texture2D(texFire, uv).a - 0.5) * 2.0;
//     uv = vec2(vUv.x * 0.8 - 0.02, fract(vUv.y * 2.5 - time * 0.5));
//     noise.y += (texture2D(texFire, uv).a - 0.5) * 2.0;

//     noise = clamp(noise, -1.0, 1.0);

//     float perturb = (1.0 - vUv.y) * 0.35 + 0.02;
//     noise = (noise * perturb) + vUv - 0.02;

//     vec4 color = texture2D(texFire, noise / 5.0);
//     // color = vec4(color.bgr, 1.0);
//     color = vec4((color.g / color.r) * 0.1, color.g * 0.75, color.r, 1.0);
//     noise = clamp(noise, 0.05, 1.0);
//     color.a = texture2D(texFire, noise).b * 0.0;
//     color.a = color.a * texture2D(texFire, vUv).b;

//     gl_FragColor = color;

// }