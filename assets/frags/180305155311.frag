// Author: ricsca
// Title: bilinear interpolation

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

float field (vec2 p, float s) {
    return random(floor(scale(p, s)));
}

float A (vec2 p) {
    return random(floor(p));
}

float bilinear (vec2 p, float s) {
    p = scale(p, s);
    float x1 = floor(p.x);
    float y1 = floor(p.y);
    float x2 = x1 + 1.;
    float y2 = y1 + 1.;
    float t = fract(p.x);
    float u = fract(p.y);
    return
        (1. - t) * (1. - u) * A(vec2(x1, y1)) +
        t * (1. - u) * A(vec2(x2, y1)) +
        t * u * A(vec2(x2, y2)) +
        (1. - t) * u * A(vec2(x1, y2));  
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
    float z = bilinear(st, 10.);
    float z1 = field(st, 10.);
    gl_FragColor = vec4(vec3(z), 1.0);
}