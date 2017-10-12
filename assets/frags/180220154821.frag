// Author: ricsca
// Title: random field

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

#define PI 6.28318530718 / 2.
#define MAGIC 43758.5453123

float plot(vec2 st, float pct){
	float delta = 0.1;
    float k = 0.1;
  	return  smoothstep( pct - k / 2. - delta, pct - k / 2., st.y) -
    	    smoothstep( pct + k / 2., pct + k / 2. + delta, st.y);
}

float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * MAGIC);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
    float z = random(st);
    float pct = plot(st, z);
    gl_FragColor = vec4(vec3(pct), 1.0);
}