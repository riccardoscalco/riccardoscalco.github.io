// Author: ricsca
// Title: parametric linear square

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

float plot(vec2 st, float pct){
  return  smoothstep( pct-0.01, pct, st.y) -
          smoothstep( pct, pct+0.01, st.y);
}


float square (float x, float n, float m) {
    return step(1. - m / n, fract(x - m / n));
}

float up (float x, float n, float m) {
    return fract(x * n) * square(x, n, m);
}

float down (float x, float n, float m) {
    return (1. - fract(x * n)) * square(x, n, m);
}

float linearSquare (float x, float n, float m) {
    return (
        1. * up(x, n, 1.) + 
        1. * down(x - (m / n), n, 1.) +
        square(x - 1. / n, n, m - 1.)
    );
}

float n = 10.;
float m = 3.;
float xscale = 5.;

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
    float w = linearSquare(st.x  * xscale, n, m);
    float pct = plot(st, w * 0.1 + 0.45);
    gl_FragColor = vec4(vec3(pct),1.0);
}