// Author: ricsca
// Title: rotation matrix

#ifdef GL_ES
precision mediump float;
#endif

#define PI 6.28318530718 / 2.

uniform vec2 u_resolution;
uniform float u_time;

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

float h (float f) {
    return max(smoothstep(f, 0.284, 0.368) - step(f, 0.406), 0.);
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
    
    float p = h(polygonField(rotate2d(u_time) * st, 6, vec2(0.00,0.00)));

    gl_FragColor = vec4(vec3(p), 1.0);
}