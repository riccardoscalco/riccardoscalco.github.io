// Author: ricsca
// Title: flag

#ifdef GL_ES
precision mediump float;
#endif

#define PI 6.28318530718 / 2.

uniform vec2 u_resolution;
uniform float u_time;

vec4 tiling (vec2 st, float N) {
    return vec4(fract(st * N), floor(st * N) / N); 
}

vec2 armonic (vec2 p, float limit, float phase, float scale) {
    return p + vec2(
        limit * sin(u_time * scale + phase * PI),
        limit * sin(u_time * scale + phase * PI)); 
}

vec2 circle (vec2 p, vec2 color, vec2 mu) {
    float r = 0.2;
    float delta = 0.1;
    float d = distance(p - mu, vec2(0.5, 0.5));
    vec2 g = smoothstep(r, r + delta, d) * vec2(1., 1.);
    vec2 h = smoothstep(d, d + delta, r + delta) * color;
    return g + h;
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
    
    vec4 tile = tiling(st, 30.);
    vec2 mu = armonic(vec2(0.,0.), 0.2, tile.w + tile.z, 5.);
    vec2 f = circle(tile.xy, tile.zw, mu);

    gl_FragColor = vec4(f, 1.0, 1.);
}