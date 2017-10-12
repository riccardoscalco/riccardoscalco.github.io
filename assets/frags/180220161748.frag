// Author: ricsca
// Title: random field floor

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

#define PI 6.28318530718 / 2.
#define MAGIC 43758.5453123

float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * MAGIC);
}

vec2 scale (vec2 p, float s) {
    return p * s;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
    float N = 10.;

    float z = random(floor(scale(st, N)));
    gl_FragColor = vec4(vec3(z), 1.0);
}