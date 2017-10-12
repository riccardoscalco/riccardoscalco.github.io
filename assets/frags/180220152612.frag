// Author: ricsca
// Title: random interger

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

#define PI 6.28318530718 / 2.

float plot(vec2 st, float pct){
	float delta = 0.001;
    float k = 0.01;
  	return  smoothstep( pct - k / 2. - delta, pct - k / 2., st.y) -
    	    smoothstep( pct + k / 2., pct + k / 2. + delta, st.y);
}

float noise (float x) {
    return fract(sin(x) * 100000.);
}

float randomInt (float s, float n) {
    return floor(mod(noise(s) * 1000., n));
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
    float N = 10.;
    float z = randomInt(st.x, N);
    float pct = plot(st, z / N + 1. / (2. * N));
    gl_FragColor = vec4(vec3(pct), 1.0);
}