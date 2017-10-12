// Author: ricsca
// Title: truchet tile

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

float isOdd (float n) {
 return 2. * (mod(n, 2.) - .5);   
}

float angle (vec2 index, float N) {
    return index.x * isOdd(index.y + index.x) * PI / 2. +
        index.y * PI / 2.;
}

vec4 tiling (vec2 st, float N) {
    return vec4(fract(st * N), floor(st * N)); 
}


void main() {
    float N = 10.;
    vec2 st = gl_FragCoord.xy/u_resolution;
    vec4 tt = tiling(st, N);
    vec2 z = rotate2D(tt.xy, angle(tt.zw, N));
    float f = smoothstep(z.x - 0.01, z.x, z.y);
    gl_FragColor = vec4(vec3(f), 1.0);
}