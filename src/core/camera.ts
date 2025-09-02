import { Mesh, Scene, ArcRotateCamera } from '@babylonjs/core';

const createCamera = (
  scene: Scene,
  canvas: HTMLCanvasElement,
  target: Mesh
): ArcRotateCamera => {
  const camera = new ArcRotateCamera(
    'arcCamera',
    Math.PI / 2,
    Math.PI / 4,
    10,
    target.position,
    scene
  );

  camera.attachControl(canvas, true);
  camera.wheelPrecision = 50;
  camera.lowerRadiusLimit = 5;
  camera.upperRadiusLimit = 30;

  scene.onBeforeRenderObservable.add(() => {
    camera.target.copyFrom(target.position);
  });

  return camera;
};

export default createCamera;
