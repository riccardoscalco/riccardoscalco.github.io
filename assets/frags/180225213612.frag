// Author: ricsca
// Title: parametric

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

vec2 curve (float t) {
    float r = t * 0.5;
    float a = t * 100.;
    float x = r * sin(a) + cos(a)+ 0.5;
    float y = r * cos(a) + 0.5;
    return vec2(x, y);
}

float field (vec2 p) {
    float delta = 0.002;
    for (int i = 0; i < 1000; i++) {
        vec2 q = curve(float(i) / float(1000));
        float dx = abs(q.x - p.x);
        float dy = abs(q.y - p.y);
        if ( dx < delta && dy < delta ) {
            return 1.;
        }
    }
    return 0.;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
    float z = field(st);
    gl_FragColor = vec4(vec3(z), 1.0);
}