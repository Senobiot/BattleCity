import createEngine from './core/engine';
import createScene from './core/scene';
import './style.css';

const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
console.log(canvas);
const engine = createEngine(canvas);
const scene = createScene(engine, canvas);

engine.runRenderLoop(() => scene.render());

window.addEventListener('resize', () => engine.resize());
