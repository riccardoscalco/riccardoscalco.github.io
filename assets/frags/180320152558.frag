// Author: ricsca
// Title: smootherstep

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

#define PI 6.28318530718 / 2.
#define MAGIC 43758.5453123

float plot(vec2 st, float z){
	float delta = 0.001;
    float k = 0.005;
  	return  smoothstep(z - k / 2. - delta, z - k / 2., st.y) -
    	    smoothstep(z + k / 2., z + k / 2. + delta, st.y);
}

float rand (float x) {
    return fract(sin(x) * MAGIC);
}

float noise (float x) {
    return rand(floor(x));
}

float interpolate (float t) {
    //return t;
    //return t * t * (3. - 2. * t); // smoothstep
    return t * t * t * (10. + t * (6. * t - 15.)); // smootherstep
}

float field (vec2 p) {
    float i = floor(p.x);
    float f = fract(p.x);
    return mix(rand(i), rand(i + 1.0), interpolate(f));
}

vec2 scale (vec2 p, float N) {
    return p * N;
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	float z = field(scale(st, 20.));
	float pct = plot(st, z * 0.1 + 0.45);
	gl_FragColor = vec4(vec3(pct), 1.0);
}