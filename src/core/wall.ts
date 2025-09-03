// import {
//   MeshBuilder,
//   StandardMaterial,
//   Texture,
//   Vector4,
//   Scene,
// } from '@babylonjs/core';

// const createWall = (scene: Scene) => {
//   const fragment = 5;
//   const fragmentWidth = 10;

//   const uvFront = new Vector4(0, 0, fragmentWidth, 1);
//   const uvSide = new Vector4(0, 0, 1, 1);
//   const faceUV = [uvFront, uvFront, uvSide, uvSide, uvFront, uvFront]; // перед, зад, слева, справа, сверху, снизу,

//   const wall = MeshBuilder.CreateBox(
//     'wall',
//     {
//       width: fragment * fragmentWidth,
//       height: fragment,
//       depth: fragment,
//       faceUV: faceUV,
//       wrap: true,
//     },
//     scene
//   );

//   wall.position.set(0, fragment / 2, -fragment * 5);

//   const wallMat = new StandardMaterial('wallMat', scene);
//   const texture = new Texture('./sprites/brick.jpg', scene);

//   // texture.uScale = 1; // сколько раз повторить по ширине
//   // texture.vScale = 2;
//   texture.wrapU = Texture.WRAP_ADDRESSMODE;
//   texture.wrapV = Texture.WRAP_ADDRESSMODE;

//   wallMat.diffuseTexture = texture;
//   wall.material = wallMat;
//   wall.receiveShadows = true;
//   wall.checkCollisions = true;

//   return wall;
// };

// export default createWall;

// import {
//   MeshBuilder,
//   SolidParticleSystem,
//   StandardMaterial,
//   Texture,
//   Vector3,
//   Scene,
// } from '@babylonjs/core';

// export const createExplodableWall = (scene: Scene) => {
//   const wallSize = { width: 1, height: 5, depth: 10 };

//   // Исходный меш
//   const wall = MeshBuilder.CreateBox('wall', wallSize, scene);
//   wall.position.set(0, 2.5, -25);

//   const mat = new StandardMaterial('wallMat', scene);
//   mat.diffuseTexture = new Texture('./sprites/brick.jpg', scene);
//   mat.diffuseTexture.uScale = 5;
//   mat.diffuseTexture.vScale = 1;
//   mat.diffuseTexture.wrapU = Texture.WRAP_ADDRESSMODE;
//   mat.diffuseTexture.wrapV = Texture.WRAP_ADDRESSMODE;
//   wall.material = mat;

//   // Создание фрагментов
//   const fragment = MeshBuilder.CreateBox('fragment', { size: 0.2 }, scene);
//   const sps = new SolidParticleSystem('sps', scene);
//   sps.addShape(fragment, 200); // 200 фрагментов
//   fragment.dispose();

//   const spsMesh = sps.buildMesh();
//   spsMesh.material = mat;
//   spsMesh.setEnabled(false); // скрыт до взрыва

//   // Взрыв
//   const explode = () => {
//     wall.dispose();
//     spsMesh.setEnabled(true);

//     for (let i = 0; i < sps.particles.length; i++) {
//       const p = sps.particles[i];
//       p.position.copyFrom(wall.position);
//       p.velocity = new Vector3(
//         (Math.random() - 0.5) * 5,
//         Math.random() * 5,
//         (Math.random() - 0.5) * 5
//       );
//     }

//     sps.setParticles();

//     scene.onBeforeRenderObservable.add(() => {
//       for (let p of sps.particles) {
//         p.position.addInPlace(p.velocity.scale(0.02));
//         p.velocity.scaleInPlace(0.98); // затухание
//       }
//       sps.setParticles();
//     });
//   };

//   // Пример: взрыв через 2 секунды
//   setTimeout(explode, 2000);

//   return wall;
// };
// export default createExplodableWall;

import {
  MeshBuilder,
  StandardMaterial,
  Texture,
  Vector3,
  Scene,
  PhysicsImpostor,
  CannonJSPlugin,
} from '@babylonjs/core';

import * as CANNON from 'cannon';

export const createExplodableWall = (scene: Scene) => {
  scene.enablePhysics(
    new Vector3(0, -9.81, 0),
    new CannonJSPlugin(true, 10, CANNON)
  );

  const wall = MeshBuilder.CreateBox(
    'wall',
    { width: 1, height: 5, depth: 10 },
    scene
  );
  wall.position.set(0, 2.5, -25);

  const mat = new StandardMaterial('wallMat', scene);
  const texture = new Texture('./sprites/brick.jpg', scene);
  texture.uScale = 5;
  texture.vScale = 1;
  texture.wrapU = Texture.WRAP_ADDRESSMODE;
  texture.wrapV = Texture.WRAP_ADDRESSMODE;
  mat.diffuseTexture = texture;
  wall.material = mat;

  const explode = () => {
    wall.dispose();

    for (let i = 0; i < 50; i++) {
      const frag = MeshBuilder.CreateBox(`frag_${i}`, { size: 0.5 }, scene);
      frag.position = wall.position.clone();

      frag.material = mat;

      frag.physicsImpostor = new PhysicsImpostor(
        frag,
        PhysicsImpostor.BoxImpostor,
        { mass: 2, restitution: 0.3 },
        scene
      );

      const impulse = new Vector3(
        (Math.random() - 0.5) * 20, // X — больше разброс
        (Math.random() - 0.5) * 20, // Y — вверх и вниз
        (Math.random() - 0.5) * 20 // Z — больше хаоса
      );

      frag.physicsImpostor.applyImpulse(impulse, frag.getAbsolutePosition());
    }
  };

  setTimeout(explode, 2000);

  return wall;
};

export default createExplodableWall;
