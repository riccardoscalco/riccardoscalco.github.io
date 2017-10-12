// Author: ricsca
// Title: voronoi lines
// Inpired from https://thebookofshaders.com/edit.php#12/2d-voronoi.frag

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

#define MAGIC 43758.5453123

vec2 random2(vec2 st){
    vec2 s = vec2(
        dot(st, vec2(0.210,0.330)),
    	dot(st, vec2(269.5,183.3))
    );
    return fract(sin(s) * MAGIC);
}

float circle (vec2 p, vec2 c) {
    return distance(p, c);
}

vec4 tiling (vec2 st, float N) {
    return vec4(fract(st * N), floor(st * N)); 
}

float field (vec2 q, float N) {
    vec4 tt = tiling(q, N);

    vec2 n = tt.zw;
    vec2 f = tt.xy;
    float md = N;
    vec2 mr, mg;

    for (int j= -1; j <= 1; j++) {
        for (int i= -1; i <= 1; i++) {
            vec2 g = vec2(float(i),float(j));
            vec2 o = random2(n + g);
            vec2 r = g + o - f;
            float d = dot(r,r);
            if( d < md ) {
                md = d;
                mr = r;
                mg = g;
            }
        }
    }

    float mmd = N;
    // We need to search in a 2-neighborhood because
    // a edge of a voronoi areola may result from reference points
    // in cells that are not 1-step near.
    // Therefore, in order to detect that edge,
    // we need to search in the 2-neighborhood.
    // The issue my not be always visible, try to change
    // the random seed and loop in the 1-neighborhood to see it.
    for (int j= -2; j <= 2; j++) {
        for (int i= -2; i <= 2; i++) {
            vec2 g = vec2(float(i),float(j));
            vec2 o = random2(n + g);
            vec2 r = g + o - f;
            float d = dot(.5 * (mr + r), normalize(r - mr));
            mmd = min(d, mmd);
        }
    }

    //return smoothstep(0.02, 0.03, mmd);
    //return smoothstep(-0.6, 0.6, .8 + sin(md * 30.));
    return (pow(mmd,md) * pow(mmd, md));
    //return mmd * 1.5;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
    //st.x *= u_resolution.x/u_resolution.y;
	float color = (field(st, 15.) + field(st, 15.) + field(st, 20.)) * 0.33;;
    gl_FragColor = vec4(vec3(color), 1.0);
}