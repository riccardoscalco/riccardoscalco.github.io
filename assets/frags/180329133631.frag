// Author: ricsca
// Title: curved space

#ifdef GL_ES
precision mediump float;
#endif

#define PI 6.28318530718 / 2.

uniform vec2 u_resolution;

float square (float x, float k) {
    float delta = 0.01;
    return smoothstep(-delta, delta, fract(x) - k);
}

vec2 scale (vec2 p, float s) {
    return p * s - s / 2.;
}

float grid (vec2 p, float k) {
    return square(p.x, k) + square(p.y, k);
}

vec2 curve (vec2 p) {
    float r = length(p);
    float a = atan(p.y, p.x);
    return vec2(r, a * 4.456);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
    float z = grid(curve(scale(st, 20.)), 0.9);
    gl_FragColor = vec4(vec3(z),1.0);
}
