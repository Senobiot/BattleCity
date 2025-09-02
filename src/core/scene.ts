import {
  ActionManager,
  ArcRotateCameraPointersInput,
  Engine,
  HemisphericLight,
  KeyboardEventTypes,
  Scene,
  Vector3,
} from '@babylonjs/core';
import createCamera from './camera';
import createPlayer from './player';
import createGround from './ground';
import createWall from './wall';
import createBullet from './bullet';

const createScene = (engine: Engine, canvas: HTMLCanvasElement): Scene => {
  const scene = new Scene(engine);
  const player = createPlayer(scene);
  const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);

  const camera = createCamera(scene, canvas, player);
  const pointersInput = camera.inputs.attached
    .pointers as ArcRotateCameraPointersInput;

  pointersInput.buttons = [2];
  pointersInput.panningSensibility = 0;

  createGround(scene);
  createWall(scene);

  const inputMap: Record<string, boolean> = {};

  scene.actionManager = new ActionManager(scene);

  scene.onKeyboardObservable.add((kbInfo) => {
    const key = kbInfo.event.key.toLowerCase();
    if (kbInfo.type === KeyboardEventTypes.KEYDOWN) {
      inputMap[key] = true;
    } else if (kbInfo.type === KeyboardEventTypes.KEYUP) {
      inputMap[key] = false;
    }

    if (kbInfo.type === KeyboardEventTypes.KEYDOWN && key === ' ') {
      const direction = camera.getForwardRay().direction.clone();
      direction.y = 0;
      direction.normalize();

      const spawnPos = player.position
        .add(direction.scale(1.5))
        .add(new Vector3(0, 1, 0));
      createBullet(scene, spawnPos, direction);
    }
  });

  scene.onBeforeRenderObservable.add(() => {
    const speed = 0.1;

    const forward = camera.getForwardRay().direction.clone();
    forward.y = 0;
    forward.normalize();

    if (inputMap['w']) {
      player.rotation.y = Math.atan2(forward.x, forward.z);
      const move = forward.scale(speed);
      player.moveWithCollisions(move);
    }

    if (inputMap['d']) {
      const left = Vector3.Cross(Vector3.Up(), forward).normalize();
      player.moveWithCollisions(left.scale(speed));
    }

    if (inputMap['s']) {
      const back = forward.negate();
      player.moveWithCollisions(back.scale(speed));
    }

    if (inputMap['a']) {
      const right = Vector3.Cross(forward, Vector3.Up()).normalize();
      player.moveWithCollisions(right.scale(speed));
    }
  });

  scene.collisionsEnabled = true;

  return scene;
};

export default createScene;
