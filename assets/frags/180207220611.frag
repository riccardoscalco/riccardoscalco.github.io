// Author: ricsca
// Title: linear floor

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

float plot(vec2 st, float pct){
  return  smoothstep( pct-0.01, pct, st.y) -
          smoothstep( pct, pct+0.01, st.y);
}

float linearFloor (float t, float s) {
    return 2. / s * ((fract(s*t) - 0.500) * step(0.5, fract(s*t)) + 0.5 * floor(s*t));
}

float xscale = 10.;

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
    float z = linearFloor(st.x, xscale);
    float pct = plot(st, z);
    gl_FragColor = vec4(vec3(pct), 1.0);
}	