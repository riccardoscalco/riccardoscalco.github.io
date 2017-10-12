// Author: ricsca
// Title: periodic boudaries

#ifdef GL_ES
precision mediump float;
#endif

#define PI 6.28318530718 / 2.

uniform vec2 u_resolution;
uniform float u_time;

vec4 tiling (vec2 p, float N) {
    //return vec4(fract(p * N), floor(p * N) / N); 
    return vec4(fract(p * N), 1./N * floor(mod(p * N, vec2(N, N))));
}

vec2 wave (vec2 p, vec2 t) {
    return p - t;
}

vec2 periodicBoudary (vec2 p) {
    return mod(p, vec2(1., 1.));
}

vec2 circle (vec2 p, vec2 color) {
    float r = 0.120;
    float delta = 0.004;
    float d = distance(p, vec2(0.5, 0.5));
    vec2 g = smoothstep(r, r + delta, d) * vec2(1., 1.);
    vec2 h = smoothstep(d, d + delta, r + delta) * color;
    return g + h;
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
    
    vec4 tile = tiling(wave(st, vec2(u_time / 5., 0.)), 3.);
    vec2 mu = vec2(-0.500,-0.500);
    vec2 p = periodicBoudary(tile.xy - mu);
	vec2 f = circle(p, tile.zw);

    gl_FragColor = vec4(f, 1.0, 1.);
}