// Author: ricsca
// Title: eclipse

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

#define PI 6.28318530718 / 2.

float h (float f) {
    return max(smoothstep(f, 0.252, 0.368) - step(f, 0.350), 0.);
}

float polygonField (vec2 st, int N, vec2 p) {
    st = st + p;
    float alpha = atan(st.x, st.y) + PI;
    float a = (atan(st.x, st.y) + PI) / (2. * PI);
    float b = floor(a * float(N) + 0.5) / float(N);
    float c = cos(b * (2. * PI) - alpha);
    return c * length(st);
}


void main(){
	vec2 st = gl_FragCoord.xy/u_resolution;
  	st = st * 2. - 1.;
    
    float p = h(polygonField(st, 7, vec2(-0.250,0.050)));
    float q = h(polygonField(st, 7, vec2(0.000,-0.080)));

    gl_FragColor = vec4(vec3(pow(p,q)), 1.0);
}