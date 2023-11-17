attribute vec3 aPosition;

attribute vec2 aTexCoord;

varying vec2 vTexCoord;

void main() {
  vTexCoord = aTexCoord;

  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.y = -positionVec4.y;
  gl_Position = positionVec4;
}