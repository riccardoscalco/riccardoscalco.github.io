// Author: ricsca
// Title: pattern #1

#ifdef GL_ES
precision mediump float;
#endif

#define PI 6.28318530718 / 2.

uniform vec2 u_resolution;
uniform float u_time;

vec4 tiling (vec2 p, float N) {
    return vec4(fract(p * N), 1./N * floor(mod(p * N, vec2(N, N))));
}

vec2 wave (vec2 p, vec2 t) {
    return p - t;
}

float intermittantTime (float t) {
    return  (fract(t) - 0.5) * step(0.5, fract(t)) + 0.5 * floor(t / 1.);
}

vec2 periodicBoudary (vec2 p) {
    return mod(p, vec2(1., 1.));
}

vec2 circle (vec2 p, vec2 color) {
    float r = 0.2;
    float delta = 0.02;
    float d = distance(p, vec2(0.5, 0.5));
    vec2 g = smoothstep(r, r + delta, d) * vec2(1., 1.);
    vec2 h = smoothstep(d, d + delta, r + delta) * color;
    return g + h;
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
    float N = 10.;
    vec4 tile = tiling(st, N);
    vec2 mu = vec2(0.0, 0.0);
    float signw = floor(mod(tile.w * N, 2.)) * 2. - 1.;
    float signz = floor(mod(tile.z * N, 2.)) * 2. - 1.;
    //vec2 p = periodicBoudary(wave(tile.xy - mu, vec2(signw * u_time / 1., 0.)));
    float t = 9.256;
    vec2 p = periodicBoudary(wave(tile.xy - mu, vec2(signw * intermittantTime(t + 0.500) / 1., signz * intermittantTime(t) / 1.)));
	vec2 f = circle(p, vec2(0.,0.));

    gl_FragColor = vec4(f, 1.0, 1.);
}