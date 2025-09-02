import { Vector3 } from '@babylonjs/core';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import type { Scene } from '@babylonjs/core/scene';

const createPlayer = (scene: Scene) => {
  const player = MeshBuilder.CreateBox('player', { size: 2 }, scene);
  player.ellipsoid = new Vector3(1, 1, 1);
  player.ellipsoidOffset = new Vector3(0, 1, 0);
  player.checkCollisions = true;

  player.position.y = 1;

  return player;
};

export default createPlayer;
