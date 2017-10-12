// Author: ricsca
// Title: noise again

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

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
    ) * .5 + .5;
}

float octaveNoise (vec2 p) {
    const int octaves = 8;
    float lacunarity = 2.00;
    float gain = 0.5;

    // Initial values
    float amplitude = 1.;
    float frequency = 1.;
    
    float y = 0.;

    for (int i = 0; i < octaves; i++) {
        y += amplitude * noise(p * frequency);
        frequency *= lacunarity;
        amplitude *= gain;
    }
    return y;
}

float square (float x, float k) {
    float delta = 0.001;
    return smoothstep(-delta, delta, fract(x) - k);
}

vec2 scale (vec2 p, float s) {
    return p * s - s / 2.;
}

vec2 curve (vec2 p, float amplitude) {
    return amplitude * octaveNoise(p) + p;
}

vec2 curvef (vec2 p, float a) {
    vec2 y = p;
    for (int i = 1; i < 4; i++) {
        y = curve(y, a);
    }
    return y;
}

float f (float p, float x) {
    return 1. / p * sin(x * p);
}

float grid (vec2 p) {
    float y = p.x;
    for (int i = 1; i < 6; i++) {
        y = f(float(i), y);
    }
    return y * 5.;
}

vec2 shrink (vec2 p, float k) {
	return vec2(p.x, p.y * k);
}

void main() {
    float gridLines = 1.;
    float zoom = 1.;
    float noiseAplitude = 1.;

    vec2 st = gl_FragCoord.xy/u_resolution;
		st = shrink(st, 0.5);
    float y = grid(scale(curvef(st * zoom, noiseAplitude), gridLines));
    gl_FragColor = vec4(vec3(y),1.0);
}