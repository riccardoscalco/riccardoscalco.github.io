// Author: ricsca
// Title: border boil

#ifdef GL_ES
precision mediump float;
#endif

#define PI 6.28318530718 / 2.

uniform vec2 u_resolution;
uniform float u_time;

vec2 armonic (vec2 p, float limit, float phase, float scale) {
    return p + vec2(limit * sin(u_time * scale / 2. + phase / 2. * PI), limit * sin(u_time * scale + phase * PI)); 
}

float normalCurve (float x, float sigma, float mu) {
    return exp(-pow(x - mu, 2.) / (2. * pow(sigma, 2.)));
}

float bell (vec2 st, float sigma, vec2 mu) {
    return normalCurve(st.x, sigma, mu.x) * normalCurve(st.y, sigma, mu.y);
}

float border (float f, float s, float delta) {
    return smoothstep(s, s + delta, f) * smoothstep(f, f + delta, s + 2. * delta);
}

void main(){
	vec2 st = gl_FragCoord.xy/u_resolution;
  	st = st * 2. - 1.;
    
    vec2 center = vec2(0., 0.);
    float p = bell(st, 0.2, armonic(center, 0., 10., 0.));
    float q1 = bell(st, 0.04, armonic(center, 0.1, 5., 0.1));
    float q2 = bell(st, 0.05, armonic(center, 0.1, 5., 1.));
    float q3 = bell(st, 0.04, armonic(center, 0.1, 1., 0.5));
    float q4 = bell(st, 0.05, armonic(center, 0.1, 2., 2.));
    float q5 = bell(st, 0.04, armonic(center, 0.1, 2.3, 0.1));
    float q6 = bell(st, 0.06, armonic(center, 0.1, 0.4, 1.));
    float q7 = bell(st, 0.04, armonic(center, 0.1, 1., 2.));
    float q8 = bell(st, 0.06, armonic(center, 0.1, 2., 1.5));
    
    float c = 0.914;
    float f = p +  q1 + q2 + q3 + q4 + q5 + q6 + q6 + q8;
    float s = border(f, c, 0.2);

    gl_FragColor = vec4(vec3(s), 1.0);
}