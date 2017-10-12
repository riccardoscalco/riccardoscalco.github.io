// Author: ricsca
// Title: normal plane

#ifdef GL_ES
precision mediump float;
#endif

#define PI 6.28318530718 / 2.

uniform vec2 u_resolution;
uniform float u_time;

float normalCurve (float x, float sigma, float mu) {
    return exp(-pow(x - mu, 2.) / (2. * pow(sigma, 2.)));
}

float bell (vec2 st) {
    
    return normalCurve(st.x, 0.3, 0.) * normalCurve(st.y, 0.3, 0.);
}

void main(){
	vec2 st = gl_FragCoord.xy/u_resolution;
  	st = st * 2. - 1.;
    
    float p = bell(st);

    gl_FragColor = vec4(vec3(p), 1.0);
}