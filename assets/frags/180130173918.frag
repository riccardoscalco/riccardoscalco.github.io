// Author: ricsca
// Title: waves

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float square(float x) {
    return 2. * fract(x / 2.) - fract(x);
}

float wave (vec2 st, vec2 p) {
    float r = pow(pow(st.x - p.x, 2.) + pow(st.y - p.y, 2.), 0.5);
    float f = square(r * 10. - u_time);
    float g = square(r * 20. - u_time - 0.980);
    
    return f * g;
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
  	st = st * 2. - 1.;
    
    float w1 = wave(st, vec2(-0.520,0.380));
    float w2 = wave(st, vec2(0.520,-0.380));

    gl_FragColor = vec4(vec3(w1 * w2),1.0);
}