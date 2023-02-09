const types = {
  none: 0,
  pedestrian: 1,
  bike: 2,
  car: 3,
  truck: 4,
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
      [240, 120],
      [350, 230],
      [390, 300],
      [460, 405],
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
      [765, 370],
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
const intersections = calculateIntersections();

const dashLength = 32;
const ctx = document.querySelector("canvas").getContext("2d");

/**
 * @param {CanvasRenderingContext2D} ctx
 */
function draw(ctx) {
  // Draw Paths
  coords.forEach((item, index) => {
    const count = item.points.length;
    if (count >= 1) {
      ctx.strokeStyle = colors[item.types[0]] ?? colors[0];
      ctx.lineJoin = "round";
      ctx.lineWidth = item.width;

      for (let c = 0; c < item.types.length; c++) {
        ctx.setLineDash([
          dashLength,
          item.types.length * dashLength - dashLength,
        ]);
        ctx.lineDashOffset = dashLength * c;
        ctx.strokeStyle = colors[item.types[c]] ?? colors[0];

        ctx.beginPath();
        ctx.moveTo(item.points[0][0], item.points[0][1]);
        for (let i = 0; i < count - 1; i++) {
          ctx.lineTo(item.points[i + 1][0], item.points[i + 1][1]);
        }
        ctx.stroke();
      }
    }
  });
  // Draw spawnpoints
  spawnCoords.forEach((item, index) => {
    ctx.beginPath();
    ctx.fillStyle = colors[item.types[0]];
    ctx.arc(item.point[0], item.point[1], item.amount / 2, 0, Math.PI * 2);
    ctx.fill();
  });

  console.log(calculatePath(0, types.none));
}

/**
 * @param {number} pathIndex 
 * @param {boolean} drawTypes 
 */
function drawPath(pathIndex, drawTypes) {
  const item = coords[pathIndex];
  if (!item) return null;
  const count = item.points.length;
  if (count >= 1) {
    ctx.lineJoin = "round";
    ctx.lineWidth = item.width;

    for (let c = 0; c < item.types.length; c++) {
      if (drawTypes == true) {
        ctx.setLineDash([
          dashLength,
          item.types.length * dashLength - dashLength,
        ]);
        ctx.lineDashOffset = dashLength * c;
        ctx.strokeStyle = colors[item.types[c]] ?? colors[0];
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

function calculatePath(spawnpointIndex, type, depth) {
  if (!spawnCoords[spawnpointIndex]) return null;
  const startPoint = spawnCoords[spawnpointIndex];
  let connectedPathIndices = [];
  // Check if spawnpoint connected to a path
  for (let i = 0; i < coords.length; i++) {
    coords[i].points.forEach((coord) => {
      if (coord[0] == startPoint.point[0] && coord[1] == startPoint.point[1]) connectedPathIndices.push(coords[i]);
    });
  }

  drawSpawnPoint(spawnpointIndex);
  // Draw connected paths
  connectedPathIndices.forEach(path => {
    drawPath(coords.indexOf(path));
    findConnectedIntersections(coords.indexOf(path), true);
    // Find connected paths until depth = 0
    findConnectedPaths(coords.indexOf(path), true, 2);
  });
  for (let i = 1; i < depth; i++) {

  }
}

function findConnectedPaths(pathIndex, draw, depth) {
  let connectedPathsIndices = [];
  let intersections = findConnectedIntersections(pathIndex, true);

  for (let i = 0; i < coords.length; i++) {
    coords[i].points.forEach((coord) => {
      intersections.forEach((interSect) => {
        if (coord[0] == interSect[0] && coord[1] == interSect[1]) connectedPathsIndices.push(i);
      });
    })
  }

  console.log(connectedPathsIndices);
  connectedPathsIndices.forEach(path => {
    drawPath(path);
  });

  depth--;
  if (depth > 0) {
    connectedPathsIndices.forEach(path => {
      findConnectedPaths(coords.indexOf(path), draw, depth);
    });
  }
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
  coords,
  types,
  spawnCoords,
  intersections,
  draw,
  calculatePath,
};
