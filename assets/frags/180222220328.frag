// Author: ricsca
// Title: normal distribution scatter

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

#define PI 6.28318530718 / 2.
#define MAGIC 43758.5453123

float normalCurve (float x, float sigma, float mu) {
    return exp(-pow(x - mu, 2.) / (2. * pow(sigma, 2.)));
}

float bell (vec2 st, float sigma, vec2 mu) {
    return normalCurve(st.x, sigma, mu.x) * normalCurve(st.y, sigma, mu.y);
}

float random (vec2 st) {
    float s = sin(dot(st.xy, vec2(12.9898,78.233)));
    return fract(s * MAGIC);
}

float randomBellDistribution (vec2 p) {
    float randomValue = random(p);
    float probability = bell(p, 0.1, vec2(0.5, 0.5));
    if (randomValue < probability) {
        return 0.0;
    } else {
        return 1.0;
    }
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
    float z = randomBellDistribution(st);
    gl_FragColor = vec4(vec3(z), 1.0);
}