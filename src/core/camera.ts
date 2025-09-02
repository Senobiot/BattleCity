import { Vector3, FollowCamera, Mesh, Scene } from '@babylonjs/core';

const createCamera = (scene: Scene, target: Mesh): FollowCamera => {
  const camera = new FollowCamera('camera', new Vector3(0, 5, -10), scene);

  camera.lockedTarget = target;
  camera.radius = 10;
  camera.heightOffset = 4;
  camera.rotationOffset = 0;
  camera.cameraAcceleration = 0.05;
  camera.maxCameraSpeed = 20;

  scene.activeCamera = camera;
  camera.attachControl(true);

  return camera;
};

export default createCamera;
