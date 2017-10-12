// Author: ricsca
// Title: bicubic & bilinear interpolation

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

#define PI 6.28318530718 / 2.
#define MAGIC 43758.5453123

float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * MAGIC);
}

vec2 scale (vec2 p, float s) {
    return p * s;
}

float field (vec2 p, float s) {
    return random(floor(scale(p, s)));
}

float A (vec2 p) {
    return random(floor(p));
}

float bilinear (vec2 p, float s) {
    p = scale(p, s);
    float x1 = floor(p.x);
    float y1 = floor(p.y);
    float x2 = x1 + 1.;
    float y2 = y1 + 1.;
    float t = fract(p.x);
    float u = fract(p.y);
    return
        (1. - t) * (1. - u) * A(vec2(x1, y1)) +
        t * (1. - u) * A(vec2(x2, y1)) +
        t * u * A(vec2(x2, y2)) +
        (1. - t) * u * A(vec2(x1, y2));  
}

float bicubic (vec2 p, float s) {
    p = scale(p, s);
    float x = p.x;
    float y = p.y;
    float x1 = floor(x);
    float y1 = floor(y);
    float x2 = x1 + 1.;
    float y2 = y1 + 1.;
    float A11 = A(vec2(x1, y1));
    float A12 = A(vec2(x1, y2));
    float A21 = A(vec2(x2, y1));
    float A22 = A(vec2(x2, y2));
    float A11x = (A(vec2(x1 + 1., y1)) - A(vec2(x1 - 1., y1))) / 2.;
    float A12x = (A(vec2(x1 + 1., y2)) - A(vec2(x1 - 1., y2))) / 2.;
    float A21x = (A(vec2(x2 + 1., y1)) - A(vec2(x2 - 1., y1))) / 2.;
    float A22x = (A(vec2(x2 + 1., y2)) - A(vec2(x2 - 1., y2))) / 2.;
    float A11y = (A(vec2(x1, y1 + 1.)) - A(vec2(x1, y1 - 1.))) / 2.;
    float A12y = (A(vec2(x1, y2 + 1.)) - A(vec2(x1, y2 - 1.))) / 2.;
    float A21y = (A(vec2(x2, y1 + 1.)) - A(vec2(x2, y1 - 1.))) / 2.;
    float A22y = (A(vec2(x2, y2 + 1.)) - A(vec2(x2, y2 - 1.))) / 2.;
    float A11xy = (A(vec2(x1 + 1., y1 + 1.)) - A(vec2(x1 + 1., y1 - 1.)) - A(vec2(x1 - 1., y1 + 1.)) + A(vec2(x1 - 1., y1 - 1.))) / 4.;
    float A12xy = (A(vec2(x1 + 1., y2 + 1.)) - A(vec2(x1 + 1., y2 - 1.)) - A(vec2(x1 - 1., y2 + 1.)) + A(vec2(x1 - 1., y2 - 1.))) / 4.;
    float A21xy = (A(vec2(x2 + 1., y1 + 1.)) - A(vec2(x2 + 1., y1 - 1.)) - A(vec2(x2 - 1., y1 + 1.)) + A(vec2(x2 - 1., y1 - 1.))) / 4.;
    float A22xy = (A(vec2(x2 + 1., y2 + 1.)) - A(vec2(x2 + 1., y2 - 1.)) - A(vec2(x2 - 1., y2 + 1.)) + A(vec2(x2 - 1., y2 - 1.))) / 4.;
    mat4 Q = mat4(A11, A21, A11x, A21x, A12, A22, A12x, A22x, A11y, A21y, A11xy, A21xy, A12y, A22y, A12xy, A22xy);
    mat4 S = mat4(1., 0., 0., 0., 0., 0., 1., 0., -3., 3., -2., -1., 2., -2., 1., 1.);
    mat4 T = mat4(1., 0., -3., 2., 0., 0., 3., -2., 0., 1., -2., 1., 0., 0., -1., 1.);
    mat4 a = T * Q * S;
    float t = fract(p.x);
    float u = fract(p.y);
    vec4 xv = vec4(1., t, t * t, t * t * t);
    vec4 yv = vec4(1., u, u * u, u * u * u);
    return dot(xv * a, yv);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
    float z = field(st, 20.);
    float bil = bilinear(st, 4.);
    float bic = bicubic(st, 20.);
    gl_FragColor = vec4(vec3(bic), 1.0);
}