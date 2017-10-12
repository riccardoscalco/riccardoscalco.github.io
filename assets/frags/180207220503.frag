// Author: ricsca
// Title: mixed linear floor

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

float linearFloor (float t, float s) {
    return 2. / s * ((fract(s*t) - 0.500) * step(0.5, fract(s*t)) + 0.5 * floor(s*t));
}

float s = 50.;

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
    float z = linearFloor(st.x, s) + linearFloor(st.y, s);
    gl_FragColor = vec4(vec3(z), 1.0);
}	