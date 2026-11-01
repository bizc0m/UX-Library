// modules/effects.js — Shaders et effets communs

export function plasmaShader() {
  return {
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: new window.THREE.Vector2(1, 1) },
      uAudio: { value: 0 }
    },
    vertexShader: `void main(){ gl_Position=vec4(position,1.0); }`,
    fragmentShader: `
      precision mediump float;
      uniform float uTime;
      uniform vec2 uResolution;
      uniform float uAudio;

      float rand(vec2 st){
        return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
      }

      void main(){
        vec2 uv=(gl_FragCoord.xy-0.5*uResolution.xy)/min(uResolution.x,uResolution.y);
        float t=uTime*0.5;
        float ab=1.0+uAudio*3.0;
        float v1=sin(uv.x*3.0*ab+t);
        float v2=sin(uv.y*4.0*ab+t*1.2);
        float v3=sin((uv.x+uv.y)*2.0*ab+t*0.7);
        float plasma=v1+v2+v3;
        plasma=sin(plasma*1.5+t)*0.5+0.5;
        vec3 col=vec3(
          0.5+0.5*sin(plasma*6.28+0.0),
          0.5+0.5*sin(plasma*6.28+2.0),
          0.5+0.5*sin(plasma*6.28+4.0)
        );
        col-=sin(gl_FragCoord.y*0.7)*0.04;
        col+=rand(uv+uTime)*0.05;
        gl_FragColor=vec4(col,1.0);
      }
    `
  };
}

export function tunnelShader() {
  return {
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: new window.THREE.Vector2(1, 1) },
      uAudio: { value: 0 }
    },
    vertexShader: `void main(){ gl_Position=vec4(position,1.0); }`,
    fragmentShader: `
      precision mediump float;
      uniform float uTime;
      uniform vec2 uResolution;
      uniform float uAudio;
      void main(){
        vec2 uv=(gl_FragCoord.xy-0.5*uResolution.xy)/min(uResolution.x,uResolution.y);
        float a=atan(uv.y,uv.x);
        float r=length(uv);
        float t=uTime*1.5+uAudio*5.0;
        float v=sin(10.0*r-t+a*3.0);
        vec3 col=vec3(
          0.5+0.5*sin(v+a+t),
          0.5+0.5*sin(v+a+t+2.0),
          0.5+0.5*sin(v+a+t+4.0)
        );
        col*=1.0-r;
        gl_FragColor=vec4(col,1.0);
      }
    `
  };
}

export function asciiShader() {
  return {
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: new window.THREE.Vector2(1, 1) },
      uAudio: { value: 0 }
    },
    vertexShader: `void main(){ gl_Position=vec4(position,1.0); }`,
    fragmentShader: `
      precision mediump float;
      uniform float uTime;
      uniform vec2 uResolution;
      uniform float uAudio;
      float rand(vec2 st){
        return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
      }
      void main(){
        vec2 uv=gl_FragCoord.xy/uResolution.xy;
        float t=uTime*0.3;
        float n=rand(floor(uv*40.0)+floor(t));
        float ab=uAudio*2.0+n;
        vec3 col=vec3(
          abs(sin(ab*6.28)),
          abs(cos(ab*6.28+1.0)),
          abs(sin(ab*6.28+2.0))
        );
        float grid=step(0.95,fract(uv.x*40.0))*0.1+step(0.95,fract(uv.y*40.0))*0.1;
        col-=grid;
        gl_FragColor=vec4(col,1.0);
      }
    `
  };
}

export function createFullscreenMesh(THREE, shaderDesc) {
  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.ShaderMaterial(shaderDesc);
  return new THREE.Mesh(geometry, material);
}
