precision mediump float;

attribute vec3 position;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float uTime;
uniform float uDirection;
uniform float uMultiplier;

varying vec2 vUv;
varying float vDisplacement;

void main(){
  vec3 pos = position;

  float z = cos(uTime + pos.x * mix(1., 3., uMultiplier));
  pos.z += z * (pos.x - uDirection) * 0.4;
  pos.z *= uMultiplier; 

  vUv = uv;
  vDisplacement = pos.z;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
}