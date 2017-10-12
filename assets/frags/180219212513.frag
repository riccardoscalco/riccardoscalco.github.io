// Author: ricsca
// Title: random truchet tile

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

#define PI 6.28318530718 / 2.

vec2 rotate2D (vec2 _st, float _angle) {
    _st -= 0.5;
    _st =  mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle)) * _st;
    _st += 0.5;
    return _st;
}

float noise (float x) {
    return fract(sin(x) * 10000.);
}

float randomInt (float s, float n) {
    return floor(mod(noise(s) * 1000., n));
}

float isOdd (float n) {
 return 2. * (mod(n, 2.) - .5);   
}

float angle (vec2 index, float N) {
    float seed = index.x * index.y + index.x + index.y;
    return randomInt(seed, 4.) * PI / 2.;
}

vec4 tiling (vec2 st, float N) {
    return vec4(fract(st * N), floor(st * N)); 
}

float g (vec2 p, float k) {
    return step(p.x, k) * step(p.y, k);
}

float h (vec2 p, float k) {
    return step(k, p.x) * step(k, p.y);
}

float invert (float f) {
    return -f + 1.;
}

float f (vec2 p, float delta) {
    float k = 0.25 + delta;
    float w = 0.25 - delta;
    float k1 = 0.75 + delta;
    float w1 = 0.75 - delta;
    return g(p, k) * invert(g(p, w)) + invert(h(p, k1)) * h(p, w1);
}

void main() {
    float N = 20.;
    vec2 st = gl_FragCoord.xy/u_resolution;
    vec4 tt = tiling(st, N);
    vec2 z = rotate2D(tt.xy, angle(tt.zw, N));
    float w = f(z, 0.025);
    gl_FragColor = vec4(vec3(w), 1.0);
}

