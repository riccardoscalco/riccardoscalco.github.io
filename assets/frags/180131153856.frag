// Author: ricsca
// Title: interference

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;


float k = 0.608;
float w = 0.424;

float smoothFract(float x) {
    return smoothstep(0., 1., fract(x));
}

float smoothSquare(float x, float w) {
    float front = smoothstep(w, .5, fract(x));
    float back = smoothstep(fract(x), fract(x) + (0.5 - w), (1. - w));
    return front * back;
}

float wave (vec2 st, vec2 p, float k, float w) {
    float r = pow(pow(st.x - p.x, 2.) + pow(st.y - p.y, 2.), 0.5);
    float f = smoothSquare((r * 4.000 - u_time) * k, w);
    return f;
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
  	st = st * 2. - 1.;
    
    float w1 = wave(st, vec2(-0.220,0.280), k, w);
    float w2 = wave(st, vec2(0.220,-0.280), k, w);
    
    float ww = (w1 + w2) * 0.348;

    gl_FragColor = vec4(vec3(ww),1.0);
}