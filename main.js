import { loadImage } from "./func/sprite.js";
import paths from "./func/paths.js";
const types = paths.types;

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const img = await loadImage("/Rijnstraat.png");

ctx.fillStyle = "black"
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.drawImage(img, 0, 0, 800, 529);

//paths.draw(ctx);
paths.calculatePath(1, types.pedestrian, 3);