// Author: ricsca
// Title: pattern

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

float N = 3.;

float circle (vec2 p) {
    float k = 0.132;
    return smoothstep(k, k + 0.01, distance(p, vec2(0.5, 0.5)));
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
  	st = fract(st * N);
    
    float f = circle(st);

    gl_FragColor = vec4(vec3(vec2(f), 1.0), 1.0);
}