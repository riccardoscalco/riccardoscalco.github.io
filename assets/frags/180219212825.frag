// Author: ricsca
// Title: #1

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

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
    float k = .25 + delta;
    float w = .25 - delta;
    float k1 = .75 + delta;
    float w1 = .75 - delta;
    return g(p, k) * invert(g(p, w)) + invert(h(p, k1)) * h(p, w1);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
    float z = f(st, .1);
    gl_FragColor = vec4(vec2(z), 1.0, 1.0);
}