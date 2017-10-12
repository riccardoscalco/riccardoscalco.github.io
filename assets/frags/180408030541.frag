// Author: ricsca
// Title: light and noise

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

#define MAGIC 43758.5453123

float random (vec2 st) {
    float s = dot(st, vec2(0.400,0.230));
    return -1. + 2. * fract(sin(s) * MAGIC);
}

vec2 random2(vec2 st){
    vec2 s = vec2(
        dot(st, vec2(127.1,311.7)),
    	dot(st, vec2(269.5,183.3))
    );
    return -1. + 2. * fract(sin(s) * MAGIC);
}

float interpolate (float t) {
    //return t;
    //return t * t * (3. - 2. * t); // smoothstep
    return t * t * t * (10. + t * (6. * t - 15.)); // smootherstep
}

vec4 valueNoise (vec2 p) {
    vec2 i = floor(p);
	
    float f11 = random(i + vec2(0., 0.));
    float f12 = random(i + vec2(0., 1.));
    float f21 = random(i + vec2(1., 0.));
    float f22 = random(i + vec2(1., 1.));
    
    return vec4(f11, f12, f21, f22);
}

vec4 gradientNoise (vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    float f11 = dot(random2(i + vec2(0., 0.) ), f - vec2(0., 0.));
    float f12 = dot(random2(i + vec2(0., 1.) ), f - vec2(0., 1.));
    float f21 = dot(random2(i + vec2(1., 0.) ), f - vec2(1., 0.));
    float f22 = dot(random2(i + vec2(1., 1.) ), f - vec2(1., 1.));
    
    return vec4(f11, f12, f21, f22);
}

float noise (vec2 p) {
    vec4 v = gradientNoise(p);
    //vec4 v = valueNoise(p);
    
    vec2 f = fract(p);
    float t = interpolate(f.x);
    float u = interpolate(f.y);
    
    return mix(
        mix(v.x, v.z, t),
        mix(v.y, v.w, t), 
        u
    ) * .5 + 0.5;
}

float octaveNoise (vec2 p) {
    return
        noise(p) +
        noise(p * 2.) / 2. +
        noise(p * 4.) / 4. +
    	noise(p * 8.) / 8. +
        noise(p * 16.) / 16. +
        noise(p * 32.) / 32. +
        noise(p * 64.) / 64.;
}

vec2 scale (vec2 p, float s) {
    return p * s - s / 2.;
}

mat2 rotate2d(float a){
    return mat2(
        cos(a), -sin(a),
        sin(a), cos(a)
    );
}

vec2 center (vec2 p) {
    return p * 2. - 1.;
}

float rand (float x) {
    return fract(sin(x) * MAGIC);
}

float field (vec2 p) {
    float a = atan(p.x, p.y);
    float r = length(p);
    float k = 0.49;
    float l = 0.5;
    //float R = r - 0.9 * abs(r - k) * rand(a);
    float R = r + 10.232 * abs(r - k) * log(octaveNoise(vec2(a, a)));
    float s = step(k, R) * step(R, l);
    return s;
}

void main() {    
    vec2 st = gl_FragCoord.xy/u_resolution;
    float z = field(center(st));
    gl_FragColor = vec4(vec3(z), 1.0);
}