// Author: ricsca
// Title: curved space

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float square (float x, float k) {
    float delta = 0.01;
    return smoothstep(-delta, delta, fract(x) - k);
}

vec2 scale (vec2 p, float s) {
    return p * s;
}

float grid (vec2 p, float k) {
    return square(p.x, k) + 1. * square(p.y, k);
}

float tranformation (vec2 p) {
    return 2. * p.x - p.y;
}

vec2 curve (vec2 p) {
    return vec2(tranformation(p.xy), tranformation(p.yx));
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
    float z = grid(curve(scale(st, 20.)), 0.9);
    gl_FragColor = vec4(vec3(z),1.0);
}
