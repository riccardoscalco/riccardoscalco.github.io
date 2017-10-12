// Author: ricsca
// Title: curved space chessboard

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

#define MAGIC 43758.5453123

float random (vec2 st) {
    float s = dot(st, vec2(0.400,0.230));
    return -1. + 2. * fract(sin(s) * MAGIC);
}

vec2 random2 (vec2 st){
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
    ) * .5 + .5;
}

mat2 rotate2d(float a){
    return mat2(
        cos(a), -sin(a),
        sin(a), cos(a)
    );
}

vec2 curve (vec2 p) {
    return noise(p) * p;
}

vec4 tiling (vec2 st, float N) {
    return vec4(fract(st * N), floor(st * N) / N); 
}

vec3 rect (vec2 st, float x, float y, float w, float h, vec3 color) {
    float b = step(1.0 - y - h, st.y);
    float l = step(x, st.x);
    float t = step(y, 1.0 - st.y);
    float r = step(1.0 - x - w, 1.0 - st.x);
    return b * l * t * r * color;
}

bool isOdd (float x) {
    return fract(x / 2.) > 0.1;
}

vec3 field (vec2 p, float N) {
    float d = 0.;
    vec4 tile = tiling(p, N);
    vec3 color = isOdd((tile.z * N + tile.w * N)) ? vec3(1., 1., 1.) : vec3(0., 0., 0.);
    return rect(tile.xy, d, d, 1. - 2. * d, 1. - 2. * d, color);
}

vec2 scale (vec2 p, float s) {
    return p * s;
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 z = field(curve(scale(st - vec2(0.00,0.000), 2.)), 20.);
    gl_FragColor = vec4(z, 1.);
}
