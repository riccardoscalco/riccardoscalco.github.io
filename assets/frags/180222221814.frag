// Author: ricsca
// Title: scatter

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

#define PI 6.28318530718 / 2.
#define MAGIC 43758.5453123


float random (vec2 st) {
    float s = sin(dot(st.xy, vec2(12.9898,78.233)));
    return fract(s * MAGIC);
}

vec2 scale (vec2 p, float s) {
    return p * s;
}

float randomFieldFloor (vec2 st) {
	float N = 10.;
    return random(floor(scale(st, N)));
}

float randomScatter (vec2 p) {
    float randomValue = random(p);
    float probability = randomFieldFloor(p);
    return randomValue < probability ? 0.0 : 1.0;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
    float z = randomScatter(st);
    gl_FragColor = vec4(vec3(z), 1.0);
}