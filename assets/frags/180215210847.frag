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

float circle (vec2 p, float r) {
    float delta = 0.05;
    float d = distance(p, vec2(0.5, 0.5));
    float g = smoothstep(r - delta / 2., r + delta / 2., d);
    return g;
}

float ring (vec2 p, float R, float r) {
    return circle(p, R) + 1. - circle(p, r);
}

float field (vec2 p) {
    float delta = 0.2;
    float r1 = ring(p - vec2(-0.5, 0.5), 0.5 + delta, 0.5 - delta);
    float r2 = ring(p - vec2(0.5, -0.5), 0.5 + delta, 0.5 - delta);
	return pow(r1, r2);
        
}


void main() {
    float N = 20.;
    vec2 st = gl_FragCoord.xy/u_resolution;
    vec4 tt = tiling(st, N);
    vec2 z = rotate2D(tt.xy, angle(tt.zw, N));
    float f = field(z);
    gl_FragColor = vec4(vec3(f), 1.0);
}