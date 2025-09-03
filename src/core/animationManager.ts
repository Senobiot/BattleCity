import { AbstractMesh, AnimationGroup } from '@babylonjs/core';

const registry = new Map<AbstractMesh, AnimationGroup>();

export function registerAnimations(
  mesh: AbstractMesh,
  animation: AnimationGroup
) {
  registry.set(mesh, animation);
}

export function playAnimation(mesh: AbstractMesh, loop = true) {
  const animation = registry.get(mesh);
  if (!animation) return;
  animation?.play(loop);
}

export function stopAnimations(mesh: AbstractMesh) {
  console.log(registry?.get(mesh));
  registry?.get(mesh)?.stop();
}
