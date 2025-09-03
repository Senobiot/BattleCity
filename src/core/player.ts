import { AbstractMesh, ImportMeshAsync, Vector3 } from '@babylonjs/core';
import { registerAnimations } from './animationManager';
import type { Scene } from '@babylonjs/core/scene';

const createPlayer = async (scene: Scene): Promise<AbstractMesh> => {
  const result = await ImportMeshAsync('./models/tanks/egg/scene.gltf', scene);
  const player = result.meshes[0];
  const turret = result.meshes[10];
  if (turret) {
    turret.rotation.y += 30; // поворот по горизонтали
  }
  console.log(result);
  console.log(result.animationGroups[0]);
  player.name = 'player';
  player.ellipsoid = new Vector3(1, 1, 1);
  player.ellipsoidOffset = new Vector3(0, 1, 0);
  player.checkCollisions = true;
  registerAnimations(player, result.animationGroups[0]);
  player.position.y = 0;

  return player;
};

export default createPlayer;
