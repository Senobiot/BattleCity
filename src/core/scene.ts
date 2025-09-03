import {
  ActionManager,
  ArcRotateCameraPointersInput,
  Engine,
  HemisphericLight,
  KeyboardEventTypes,
  PointerEventTypes,
  Scene,
  Vector3,
} from '@babylonjs/core';
import createCamera from './camera';
import createPlayer from './player';
import createGround from './ground';
import createWall from './wall';
import createBullet from './bullet';
import { playAnimation, stopAnimations } from './animationManager';

const createScene = async (
  engine: Engine,
  canvas: HTMLCanvasElement
): Promise<Scene> => {
  const scene = new Scene(engine);
  const player = await createPlayer(scene);
  stopAnimations(player);

  new HemisphericLight('light', new Vector3(0, 1, 0), scene);

  const camera = createCamera(scene, canvas, player);
  const pointersInput = camera.inputs.attached
    .pointers as ArcRotateCameraPointersInput;

  pointersInput.buttons = [2];
  pointersInput.panningSensibility = 0;

  const ground = createGround(scene);
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

  let targetPosition: Vector3 | null = null;

  scene.onPointerObservable.add((pointerInfo) => {
    if (
      pointerInfo.type === PointerEventTypes.POINTERDOWN &&
      pointerInfo.event.button === 0
    ) {
      const pickResult = scene.pick(
        scene.pointerX,
        scene.pointerY,
        (mesh) => mesh === ground
      );
      if (pickResult?.hit && pickResult.pickedMesh) {
        console.log('Clicked:', pickResult.pickedMesh.name);
      }
      if (pickResult?.hit && pickResult.pickedPoint) {
        targetPosition = pickResult.pickedPoint.clone();
        targetPosition.y = player.position.y;
      }
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

    if (targetPosition) {
      const direction = targetPosition.subtract(player.position);
      direction.y = 0;

      const distance = direction.length();
      if (distance > 0.05) {
        direction.normalize();
        player.rotation.y = Math.atan2(direction.x, direction.z);
        player.moveWithCollisions(direction.scale(speed));
        playAnimation(player);
      } else {
        targetPosition = null;
        stopAnimations(player);
      }
    }
  });

  scene.collisionsEnabled = true;

  return scene;
};

export default createScene;
