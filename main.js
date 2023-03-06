import { loadImage } from "./func/sprite.js";
import paths from "./func/paths.js";
import ai from "./func/ai.js";
const types = paths.types;

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const img = await loadImage("/Rijnstraat.png");

ctx.fillStyle = "black"
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.drawImage(img, 0, 0, 800, 529);

paths.calculatePath(0, types.pedestrian, 3, false);
paths.spawnCoords.forEach((coord, i) => {
  paths.drawSpawnPoint(i);
})
//paths.drawShops();
ai.spawn(0, 5000, 0.35);
ai.spawn(1, 5000, 0.35);
ai.spawn(2, 5000, 0.35);
ai.spawn(3, 5000, 0.35);
ai.spawn(4, 5000, 0.35);
ai.spawn(5, 5000, 0.35);