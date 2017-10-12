// Author: ricsca
// Title: waves distance

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float k = 2.592;
float w = 0.392;

float smoothFract(float x) {
    return smoothstep(0., 1., fract(x));
}

float square (float x) {
    return step(0., fract(x)) * step(fract(x), 0.01 * k);
}

float smoothSquare(float x, float w) {
    float front = smoothstep(w, .5, fract(x));
    float back = smoothstep(fract(x), fract(x) + (0.5 - w), (1. - w));
    return front * back;
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
  	st = st * 2. - 1.;
    
    float w1 = smoothSquare(st.x * k, w);
    float w2 = square(st.x * k);

    gl_FragColor = vec4(vec3(w2),1.0);
}