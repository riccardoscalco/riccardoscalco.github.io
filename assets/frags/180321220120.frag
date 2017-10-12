// Author: ricsca
// Title: curved space

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

float square (float x, float k) {
    float delta = 0.01;
    return smoothstep(-delta, delta, fract(x) - k);
}

vec2 scale (vec2 p, float s) {
    return p * s;
}


float grid (vec2 p, float k) {
    return square(p.x, k) + square(p.y, k);
}

float tranformation (vec2 p) {
    return p.x + -0.05 * sin(p.y * 10.);
}

vec2 curve (vec2 p) {
    return vec2(tranformation(p.xy), tranformation(p.yx));
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
    float z = grid(scale(curve(st), 20.), 0.6);
    gl_FragColor = vec4(vec3(z),1.0);
}
