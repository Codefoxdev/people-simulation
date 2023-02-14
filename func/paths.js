const types = {
  none: 0,
  pedestrian: 1,
  bike: 2,
  car: 3,
  truck: 4,

  nonVehicles: 9,
  all: 10
};
const colors = [
  "white",
  "rgb(126, 217, 87)",
  "rgb(92, 225, 230)",
  "rgb(140, 82, 255)",
  "rgb(255, 145, 77)",
];
const coords = [
  {
    name: "Rijnstraat",
    points: [
      [130, 65],
      [161, 80], 
      [191, 95],
      [219, 110], 
      [240, 120],
      [274, 149], 
      [300, 175],
      [325, 201],
      [350, 230],
      [377, 269], 
      [390, 300],
      [413, 330], 
      [432, 360], 
      [460, 405],
      [487, 432], 
      [520, 460],
    ],
    width: 18,
    types: [types.pedestrian, types.bike],
  },
  {
    name: "Rijnstraat vervolg",
    points: [
      [695, 500],
      [680, 480],
      [580, 475],
      [520, 460],
    ],
    width: 10,
    types: [types.car, types.truck, types.pedestrian, types.bike],
    oneway: true,
  },
  {
    name: "Meulmansweg",
    points: [
      [110, 0],
      [130, 65],
      [110, 110],
      [0, 320],
    ],
    width: 8,
    types: [types.pedestrian, types.bike, types.car, types.truck],
    oneway: true,
  },
  {
    name: "Wagenstraat",
    points: [
      [520, 460],
      [505, 505],
      [505, 529],
    ],
    width: 8,
    types: [types.pedestrian, types.bike, types.car, types.truck],
    oneway: true,
  },
  {
    name: "Plantsoen / Wilhelminaweg",
    points: [
      [692, 529],
      [695, 500],
      [710, 480],
      [770, 455],
      [790, 430],
      [790, 400],
      [765, 370],
      [680, 0],
    ],
    width: 8,
    types: [types.pedestrian, types.bike, types.car, types.truck],
    oneway: true,
  },
  {
    name: "Havenstraat",
    points: [
      [355, 529],
      [355, 520],
      [370, 450],
      [370, 420],
      [335, 340],
      [320, 310],
      [240, 200],
      [190, 160],
      [110, 110],
    ],
    width: 8,
    types: [types.pedestrian, types.bike, types.car, types.truck],
    oneway: true,
  },
  {
    name: "Voorstraat",
    points: [
      [110, 0],
      [180, 10],
      [300, 75],
      [400, 175],
      [460, 255],
      [570, 380],
      [650, 410],
      [755, 400],
      [790, 400],
    ],
    width: 8,
    types: [types.pedestrian, types.bike],
  },
  {
    name: "Kerkplein / Kruisstraat",
    points: [
      [180, 430],
      [335, 340],
      [390, 300],
      [460, 255],
      [530, 170],
    ],
    width: 8,
    types: [types.pedestrian, types.bike],
  },
];
const spawnCoords = [
  {
    point: [110, 0],
    amount: 50,
    types: [types.car, types.truck, types.pedestrian, types.bike],
  },
  {
    point: [0, 320],
    amount: 25,
    types: [types.pedestrian, types.bike],
  },
  {
    point: [355, 529],
    amount: 15,
    types: [types.pedestrian, types.bike, types.car, types.truck],
  },
  {
    point: [180, 430],
    amount: 20,
    types: [types.pedestrian, types.bike],
  },
  {
    point: [530, 170],
    amount: 20,
    types: [types.pedestrian, types.bike],
  },
  {
    point: [692, 529],
    amount: 35,
    types: [types.car, types.truck, types.pedestrian, types.bike],
  },
];
const shopCoords = [
  [180,75],
  [204,88],
  [219,96],
  [234,105],
  [245,112],
  [257,119],
  [271,129],
  [291,146],
  [307,162],
  [313,170],
  [329,186], 
  [336,196], 
  [349,213], 
  [365,233],
  [384,259], 
  [392,269], 
  [398,280], 
  [419,301], 
  [425,322], 
  [433,333], 
  [441,344], 
  [453,363], 
  [462,382], 
  [471,393], 
  [480,405], 
  [492,416], 
  [506,427], 
  [155,91], 
  [167,97], 
  [177,102], 
  [186,106], 
  [196,113], 
  [218,125], 
  [235,136], 
  [250,150], 
  [269,169], 
  [284,181], 
  [304,203], 
  [327,228], 
  [342,246], 
  [350,260], 
  [358,271], 
  [374,292], 
  [394,331], 
  [409,355], 
  [418,373], 
  [427,389], 
  [442,410], 
  [452,424], 
  [467,440], 
  [483,452], 
];
const intersections = calculateIntersections();

const dashLength = 32;
const ctx = document.querySelector("canvas").getContext("2d");
let drawnPathIndices = [];

function drawShops() {
  shopCoords.forEach(shop => {
    ctx.beginPath();
    ctx.fillStyle = 'rgb(120, 120, 120)';
    ctx.arc(shop[0], shop[1], 6 / 2, 0, Math.PI * 2);
    ctx.fill();
  });

  calculatePathToShop(spawnCoords[0] ,shopCoords[shopCoords.length - 1]);
}

/**
 * @param {number} pathIndex 
 * @param {boolean} drawTypes 
 */
function drawPath(pathIndex, drawTypes = false, overRideTypes = null) {
  if (drawnPathIndices.includes(pathIndex)) return;
  const item = coords[pathIndex];
  if (!item) return null;
  const count = item.points.length;
  if (count >= 1) {
    ctx.lineJoin = "round";
    ctx.lineWidth = item.width;

    let typesToDraw = item.types;
    if (overRideTypes != null) {
      if (overRideTypes == types.all) typesToDraw = [ types.car, types.truck, types.pedestrian, types.bike ];
      else if (overRideTypes == types.nonVehicles) typesToDraw = [ types.pedestrian, types.bike ];
      else if (overRideTypes == types.car || overRideTypes == types.truck || overRideTypes == types.pedestrian || overRideTypes == types.bike) typesToDraw = overRideTypes;
    }

    for (let c = 0; c < typesToDraw.length; c++) {
      if (drawTypes == true) {
        ctx.setLineDash([
          dashLength,
          typesToDraw.length * dashLength - dashLength,
        ]);
        ctx.lineDashOffset = dashLength * c;
        ctx.strokeStyle = colors[typesToDraw[c]] ?? colors[0];
      } else {
        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";
      }

      ctx.beginPath();
      ctx.moveTo(item.points[0][0], item.points[0][1]);
      for (let i = 0; i < count - 1; i++) {
        ctx.lineTo(item.points[i + 1][0], item.points[i + 1][1]);
      }
      ctx.stroke();
    }
  }
  drawnPathIndices.push(pathIndex);
}

function drawSpawnPoint(spawnpointIndex, drawTypes) {
  const item = spawnCoords[spawnpointIndex];
  ctx.beginPath();
  if (drawTypes == true) ctx.fillStyle = colors[item.types[0]];
  else ctx.fillStyle = 'black';
  ctx.arc(item.point[0], item.point[1], item.amount / 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawIntersection(intersectionIndex) {
  const item = intersections[intersectionIndex];
  ctx.beginPath();
  ctx.fillStyle = 'gray';
  ctx.arc(item[0], item[1], 10 / 2, 0, Math.PI * 2);
  ctx.fill();
}

function calculateIntersections() {
  let intersect = [];

  for (let i = 0; i < coords.length; i++) {
    for (let u = 0; u < coords.length; u++) {
      if (i == u) continue;
      let commonPoints = findCommonPoints(coords[i], coords[u]);
      if (commonPoints.length < 1) continue;
      commonPoints.forEach((point) => {
        intersect.push(point);
      });
    }
  }
  intersect = filter(intersect);
  return intersect;
}

function calculatePath(spawnpointIndex, type, depth, drawTypes = false) {
  if (!spawnCoords[spawnpointIndex]) return null;
  drawSpawnPoint(spawnpointIndex);
  if (!type) return null;
  const startPoint = spawnCoords[spawnpointIndex];
  let connectedPathIndices = [];
  // Check if spawnpoint connected to a path
  for (let i = 0; i < coords.length; i++) {
    coords[i].points.forEach((coord) => {
      if (coord[0] == startPoint.point[0] && coord[1] == startPoint.point[1]) connectedPathIndices.push(coords[i]);
    });
  }

  // Draw connected paths
  connectedPathIndices.forEach(path => {
    drawPath(coords.indexOf(path), drawTypes, moveAbleTypes(coords.indexOf(path), startPoint.point));
    findConnectedIntersections(coords.indexOf(path), true);
    // Find connected paths until depth = 0
    findConnectedPaths(coords.indexOf(path), true, depth - 1, drawTypes);
  });
}

function findConnectedPaths(pathIndex, draw, depth, drawTypes = false) {
  if (depth <= 0) return;
  let connectedPathsIndices = [];
  let intersections = findConnectedIntersections(pathIndex, true);

  for (let i = 0; i < coords.length; i++) {
    coords[i].points.forEach((coord) => {
      if (intersections) {
        intersections.forEach((interSect) => {
          if (coord[0] == interSect[0] && coord[1] == interSect[1]) connectedPathsIndices.push(i);
        });
      }
    })
  }

  connectedPathsIndices.forEach(path => {
    drawPath(path, drawTypes);
  });

  depth--;
  if (depth > 0 && !(drawnPathIndices.length >= coords.length)) {
    connectedPathsIndices.forEach(path => {
      findConnectedPaths(path, draw, depth, drawTypes);
    });
  }

}

function calculateConnectedPaths(pathIndex) {
  let connectedPathsIndices = [];
  let intersections = findConnectedIntersections(pathIndex, true);

  for (let i = 0; i < coords.length; i++) {
    coords[i].points.forEach((coord) => {
      if (intersections) {
        intersections.forEach((interSect) => {
          if (coord[0] == interSect[0] && coord[1] == interSect[1]) connectedPathsIndices.push(i);
        });
      }
    })
  }

  return new Set(connectedPathsIndices);
}

function moveAbleTypes(pathIndex, point) {
  const path = coords[pathIndex];
  if (path.oneway == false) return types.all;
  if (comparePoints(path.points[path.points.length - 1], point)) return types.nonVehicles;
  return types.all;
}

function findPathByPoint(point) {
  let returnType = -1;
  coords.forEach((path, pathIndex) => {
    path.points.forEach((pathPoint, pointIndex) => {
      if (comparePoints(point, pathPoint)) returnType = pathIndex;
    });
  });
  return returnType;
}

function findPathsByPoint(point) {
  let returnType = [];
  coords.forEach((path, pathIndex) => {
    path.points.forEach((pathPoint, pointIndex) => {
      if (comparePoints(point, pathPoint)) returnType.push(pathIndex);
    });
  });
  return returnType;
}

function findConnectedIntersections(pathIndex, draw) {
  const path = coords[pathIndex];
  let foundIntersect = []
  if (!path) return null;

  path.points.forEach(point => {
    intersections.forEach((intersection, intersectionIndex) => {
      const connected = comparePoints(point, intersection);
      if (connected && draw) drawIntersection(intersectionIndex);
      if (connected) foundIntersect.push(point);
    });
  });
  return foundIntersect;
}

function findClosestPointOnPath(point) {
  let shortestDistance = 1000;
  let closestPointIndex = 0;
  let closestPathIndex = 0;
  coords.forEach((path, pathIndex) => {
    path.points.forEach((pathPoint, pointIndex) => {
      let a = point[0] - pathPoint[0];
      let b = point[1] - pathPoint[1];
      let c = Math.hypot(a, b);
      if (c < shortestDistance) {
        shortestDistance = c;
        closestPointIndex = pointIndex;
        closestPathIndex = pathIndex;
      }
    });
  });
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(point[0], point[1]);
  ctx.lineTo(coords[closestPathIndex].points[closestPointIndex][0], coords[closestPathIndex].points[closestPointIndex][1]);
  ctx.stroke();

  return coords[closestPathIndex].points[closestPointIndex];
}

function calculatePathToShop(startPoint, shopPoint) {
  const targetShopPoint = findClosestPointOnPath(shopPoint);
  const targetPathIndex = findPathByPoint(targetShopPoint);
  const connectedPaths = calculateConnectedPaths(targetPathIndex);

  let startPathIndex = -1;
  connectedPaths.forEach(path => {
    const pathPoints = coords[path].points;
    pathPoints.forEach(pathPoint => {
      if (comparePoints(startPoint.point, pathPoint)) startPathIndex = path;
    });
  });

  if (startPathIndex == -1) return false;
  let startPathPoints = coords[startPathIndex].points;
  let targetPathPoints = coords[targetPathIndex].points;

  if (!comparePoints(startPoint.point, startPathPoints[0])) startPathPoints.reverse();

  ctx.strokeStyle = "rgba(255, 0, 0, .05)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(startPoint.point[0], startPoint.point[1]);
  for (let i = 0; i < startPathPoints.length; i++) {
    if (findPathsByPoint(startPathPoints[i]).includes(targetPathIndex)) {
      for (let s = 0; s < targetPathPoints.length; s++) {
        ctx.lineTo(targetPathPoints[s][0], targetPathPoints[s][1]);
        if (comparePoints(targetShopPoint, targetPathPoints[s])) {
          ctx.lineTo(shopPoint[0], shopPoint[1]);
          break;
        }
      }
      break;
    } else {
      ctx.lineTo(startPathPoints[i][0], startPathPoints[i][1]);
    }
  }
  ctx.stroke();
}

let path = [];
function calculatePathToPoint(startPoint, endPoint, depth) {
  if (depth <= 0) return;
  let connectedPathsIndices = [];
  let intersections = findConnectedIntersections(pathIndex, true);

  for (let i = 0; i < coords.length; i++) {
    coords[i].points.forEach((coord) => {
      if (intersections) {
        intersections.forEach((interSect) => {
          if (coord[0] == interSect[0] && coord[1] == interSect[1]) connectedPathsIndices.push(i);
        });
      }
    })
  }

  connectedPathsIndices.forEach(path => {
    drawPath(path, drawTypes);
  });

  depth--;
  if (depth > 0) {
    connectedPathsIndices.forEach(path => {
      calculatePathToPoint(startPoint, endPoint, depth);
    });
  }
}

/**
 * @param {Array} points
 */
function filter(points) {
  let filteredPoints = [];
  for (let i = 0; i < points.length; i++) {
    let added = false;
    for (let p = 0; p < filteredPoints.length; p++) {
      if (
        points[i][0] == filteredPoints[p][0] &&
        points[i][1] == filteredPoints[p][1]
      )
        added = true;
    }
    if (filteredPoints.length < 1) added = false;
    if (!added) filteredPoints.push(points[i]);
  }
  return filteredPoints;
}

function comparePoints(point1, point2) {
  if (point1[0] != point2[0]) return false;
  if (point1[1] != point2[1]) return false;
  return true;
}

function findCommonPoints(path1, path2) {
  const path1Count = path1.points.length;
  const path2Count = path2.points.length;

  let commonPoints = [];
  for (let i1 = 0; i1 < path1Count; i1++) {
    for (let i2 = 0; i2 < path2Count; i2++) {
      if (
        path1.points[i1][0] == path2.points[i2][0] &&
        path1.points[i1][1] == path2.points[i2][1]
      )
        commonPoints.push(path1.points[i1]);
    }
  }
  return commonPoints;
}

export default {
  colors,
  coords,
  types,
  spawnCoords,
  shopCoords,
  intersections,
  drawShops,
  calculatePath,
  calculatePathToShop,
};