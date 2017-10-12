// Author: ricsca
// Title: waves 2

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;


float smoothFract(float x) {
    return smoothstep(0., 1.000, fract(x));
}

float square(float x) {
    //return 2. * smoothFract(x / 2.) - smoothFract(x);
    return 4.000 * smoothstep(.0, 1., fract(x)) * smoothstep(1., .0, fract(x));
}

float wave (vec2 st, vec2 p) {
    float r = pow(pow(st.x - p.x, 2.) + pow(st.y - p.y, 2.), 0.5);
    float f = square(r * 0.5 - u_time);
    
    return f;
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
  	st = st * 2. - 1.;
    
    float w1 = wave(st, vec2(-0.520,0.380));
    float w2 = wave(st, vec2(0.520,-0.380));

    gl_FragColor = vec4(vec3(w2 * w1),1.0);
}