// Author: ricsca
// Title: voronoi

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

#define MAGIC 43758.5453123

vec2 random2(vec2 st){
    vec2 s = vec2(
        dot(st, vec2(0.020,0.360)),
    	dot(st, vec2(269.5,183.3))
    );
    return -1. + 2. * fract(sin(s) * MAGIC);
}

float circle (vec2 p, vec2 c) {
    return distance(p, c);
}

vec4 tiling (vec2 st, float N) {
    return vec4(fract(st * N), floor(st * N)); 
}

float field (vec2 p, float N) {
    vec4 tt = tiling(p, N);
    vec2 c = ((random2(tt.zw) + 1.) * .5) * 0.8 + 0.1;
    float m_dist = N;

    for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
            vec2 neighbor = vec2(float(x),float(y));
            vec2 point = (random2(tt.zw + neighbor) + 1.) * 0.5;
            vec2 diff = (neighbor + point) - tt.xy;
            float dist = length(diff);
            m_dist = min(m_dist, dist);
        }
    }
    
    return m_dist;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
	float color = (field(st, 15.) + field(st, 3.)) * 0.5;
    gl_FragColor = vec4(vec3(color), 1.0);
}