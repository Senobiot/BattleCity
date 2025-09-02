import {
  Color3,
  MeshBuilder,
  StandardMaterial,
  type Mesh,
  type Scene,
  type Vector3,
} from '@babylonjs/core';

const createBullet = (
  scene: Scene,
  position: Vector3,
  direction: Vector3,
  borders: number = 50
): Mesh => {
  const bullet = MeshBuilder.CreateSphere('bullet', { diameter: 0.5 }, scene);
  bullet.position = position.clone();
  const mat = new StandardMaterial('bulletMat', scene);
  mat.diffuseColor = new Color3(1, 0, 0);
  bullet.material = mat;
  bullet.checkCollisions = true;

  const speed = 0.5;
  const velocity = direction.clone().normalize().scale(speed);

  bullet.registerBeforeRender(() => {
    bullet.position.addInPlace(velocity);

    const { x, z } = bullet.position;
    if (Math.abs(x) > borders || Math.abs(z) > borders) {
      bullet.dispose();
    }
  });

  return bullet;
};

export default createBullet;
