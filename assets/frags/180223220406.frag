// Author: ricsca
// Title: noise

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

#define PI 6.28318530718 / 2.
#define MAGIC 43758.5453123

float plot(vec2 st, float z){
	float delta = 0.01;
    float k = 0.001;
  	return  smoothstep(z - k / 2. - delta, z - k / 2., st.y) -
    	    smoothstep(z + k / 2., z + k / 2. + delta, st.y);
}

float rand (float x) {
    return fract(sin(x) * MAGIC);
}

float noise (float x) {
    return rand(floor(x));
}

float field (vec2 p) {
    float N = 50.;
    float x = p.x;
    float i = floor(x * N);
    float f = fract(x * N);
    return mix(rand(i), rand(i + 1.0), smoothstep(0., 1., f));
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
    float z = field(st);
	float pct = plot(st, z * 0.1 + 0.45);
    gl_FragColor = vec4(vec3(pct), 1.0);
}