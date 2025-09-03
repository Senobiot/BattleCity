import { MeshBuilder, StandardMaterial, Scene, Texture } from '@babylonjs/core';

const createGround = (scene: Scene) => {
  const ground = MeshBuilder.CreateGround(
    'ground',
    {
      width: 100,
      height: 100,
      subdivisions: 2,
    },
    scene
  );

  const groundMat = new StandardMaterial('groundMat', scene);
  ground.material = groundMat;

  const texture = new Texture('./grass.jpg', scene);
  texture.uScale = 20;
  texture.vScale = 20;

  groundMat.diffuseTexture = texture;
  ground.receiveShadows = true;

  return ground;
};

export default createGround;
