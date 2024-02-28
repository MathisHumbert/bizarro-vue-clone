precision mediump float;

uniform sampler2D uTexture;
uniform float uAlpha;
uniform float uMultiplier;

varying vec2 vUv;
varying float vDisplacement;

vec3 saturation(vec3 rgb, float adjustment) {
  const vec3 W = vec3(0.2125, 0.7154, 0.0721);
  vec3 intensity = vec3(dot(rgb, W));
  return mix(intensity, rgb, adjustment);
}

void main(){
  vec3 texture = texture2D(uTexture, vUv).rgb;
  float value = 1.;

  if(vDisplacement > 0.){
    texture += vDisplacement * mix(0.2, 0.7, uMultiplier);
    value = 1. + vDisplacement * 2.;
  }

  texture = saturation(texture, value);

  gl_FragColor.rgb = texture;
  gl_FragColor.a = uAlpha;
}