import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import type { Scene } from '@babylonjs/core/scene';

const createPlayer = (scene: Scene) => {
  const player = MeshBuilder.CreateBox('player', { size: 2 }, scene);
  player.position.y = 1;

  return player;
};

export default createPlayer;
