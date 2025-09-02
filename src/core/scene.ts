import { Engine, HemisphericLight, Scene, Vector3 } from '@babylonjs/core';
import createCamera from './camera';
import createPlayer from './player';

const createScene = (engine: Engine, canvas: HTMLCanvasElement): Scene => {
  const scene = new Scene(engine);
  const player = createPlayer(scene);
  const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);

  createCamera(scene, player);

  return scene;
};

export default createScene;
