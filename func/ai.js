import paths from "./paths.js";

function spawn(spawnPointIndex, amount, passChange) {
  let logInfo = amount / 10;
  for (let i = 0; i < amount; i++) {
    let index = Math.round(Math.random() * (paths.shopCoords.length - 1));
    paths.calculatePathToShop(paths.spawnCoords[spawnPointIndex], paths.shopCoords[index]);
    if (Math.round(i / logInfo) == i / logInfo || i == amount - 1) console.log(`Calculated ${i + 1} of ${amount}`);
  }
}

export default {
  spawn
}