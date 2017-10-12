// Author: ricsca
// Title: chessboard

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

vec2 curve (vec2 p) {
    float w = 0.284;
    float r = length(p);
    float a = atan(p.x, p.y);
    
    float x = r + w * a;
    float y = r - w * a;
    return vec2(x, y);
}

vec4 tiling (vec2 st, float N) {
    return vec4(fract(st * N), floor(st * N) / N); 
}

vec3 rect (vec2 st, float x, float y, float w, float h, vec3 color) {
    float b = step(1.0 - y - h, st.y);
    float l = step(x, st.x);
    float t = step(y, 1.0 - st.y);
    float r = step(1.0 - x - w, 1.0 - st.x);
    return b * l * t * r * color;
}

bool isOdd (float x) {
    return fract(x / 2.) > 0.1;
}

vec3 field (vec2 p, float N) {
    float d = 0.;
    vec4 tile = tiling(p, N);
    vec3 color = isOdd((tile.z * N + tile.w * N)) ? vec3(1., 1., 1.) : vec3(0., 0., 0.);
    return rect(tile.xy, d, d, 1. - 2. * d, 1. - 2. * d, color);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 z = field(curve(st - vec2(0.5,0.5)), 10.);
    gl_FragColor = vec4(z, 1.);
}