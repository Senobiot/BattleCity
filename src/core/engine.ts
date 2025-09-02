import { Engine } from '@babylonjs/core';

const createEngine = (canvas: HTMLCanvasElement): Engine =>
  new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });

export default createEngine;
