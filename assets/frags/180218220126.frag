// Author: ricsca
// Title: random square

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

float plot(vec2 st, float pct){
	float delta = 0.01;
    float k = 0.5;
  	return  smoothstep( pct - delta, pct, st.y) -
    	    smoothstep( pct + k, pct + k + delta, st.y);
}

float noise (float x) {
    return fract(sin(x) * 10000.);
}

float randomInt (float s, float min, float max) {
    return min + floor(mod(noise(s) * 1000., max + 1. - min));
}

float square (float x) {
    return step(fract(x), 0.5);
}

vec4 tiling (vec2 st, float N) {
    return vec4(fract(st * N), floor(st * N)); 
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
    float M = 2.;
    vec4 tt = tiling(st, M);
    
    vec2 p = tt.xy * 2. - vec2(1., 1.);
    float N = 10.;
    p = p * N;
    float f = randomInt(floor(p.x * N), 0., 1.);
    float pct = plot(p.xy, f * 1. - 0.75);
    gl_FragColor = vec4(vec3(pct), 1.0);
}