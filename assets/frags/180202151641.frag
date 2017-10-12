// Author: ricsca
// Title: colored circles

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

vec4 tiling (vec2 st, float N) {
    return vec4(fract(st * N), floor(st * N) / N); 
}

vec2 circle (vec2 p, vec2 color) {
    float r = 0.3;
    float delta = 0.01;
    float d = distance(p, vec2(0.5, 0.5));
    vec2 g = smoothstep(r, r + delta, d) * vec2(1., 1.);
    vec2 h = smoothstep(d, d + delta, r + delta) * color;
    return g + h;
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
    
    vec4 tile = tiling(st, 7.);
    vec2 f = circle(tile.xy, tile.zw);

    gl_FragColor = vec4(f, 1.0, 1.);
}