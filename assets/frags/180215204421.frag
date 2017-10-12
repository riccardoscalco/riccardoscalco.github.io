// Author: ricsca
// Title: periodic boudaries

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;


vec2 periodicBoudary (vec2 p) {
    return mod(p, vec2(1., 1.));
}

float circle (vec2 p) {
    float r = 0.120;
    float delta = 0.004;
    float d = distance(p, vec2(0.5, 0.5));
    float g = smoothstep(r, r + delta, d);
    return g;
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
    
    vec2 mu = vec2(-0.200,0.440);
    st = periodicBoudary(st - mu);
	float f = circle(st);

    gl_FragColor = vec4(vec3(f), 1.);
}
