import { MeshBuilder, StandardMaterial, Scene, Texture } from '@babylonjs/core';

const createWall = (scene: Scene) => {
  const wall = MeshBuilder.CreateBox(
    'wall',
    {
      width: 1,
      height: 5,
      depth: 10,
    },
    scene
  );

  wall.position.set(0, 2.5, -25);

  const wallMat = new StandardMaterial('wallMat', scene);

  const texture = new Texture('./brick.jpg', scene);
  // texture.uScale = 20;
  // texture.vScale = 20;

  wallMat.diffuseTexture = texture;
  wall.receiveShadows = true;
  wall.material = wallMat;
  wall.checkCollisions = true;

  return wall;
};

export default createWall;
