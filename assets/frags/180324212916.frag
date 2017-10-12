// Author: ricsca
// Title: pincushion distortion model

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
    return p * s - s / 2.;
}

float grid (vec2 p, float k) {
    return square(p.x, k) + 1. * square(p.y, k);
}

vec2 curve (vec2 p) {
    float k = 0.001;
    float r = length(p);
    
    float x = p.x / (1. + k * r * r);
    float y = p.y / (1. + k * r * r);
    return vec2(x, y);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
    float z = grid(curve(scale(st, 30.)), 0.9);
    gl_FragColor = vec4(vec3(z),1.0);
}
