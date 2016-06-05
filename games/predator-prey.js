(function() {
var ALIVE_RATIO = .5;
var PREDATOR_RATIO = .5;

var populations = [{
  name: "predator",
  color: "red",
}, {
  name: "prey",
  color: "green",
}];

function choosePopulation() {
  var rand = Math.random();
  if (rand < PREDATOR_RATIO) return populations[0];
  else return populations[1];
}

var cells = [];
for (var i = 0; i < CELLS_PER_ROW; ++i) {
  var row = [];
  cells.push(row)
  for (var j = 0; j < CELLS_PER_COL; ++j) {
    population = choosePopulation();
    row.push({on: Math.random() < ALIVE_RATIO ? true : false, population: population})
    var cellID = i + ':' + j;
    var xLoc = i * CELL_SIZE;
    var yLoc = j * CELL_SIZE;
  }
}

function killCells() {
  counts = getNeighborCounts(cells);
  cells.forEach(function(row, rowIdx) {
    row.forEach(function(cell, colIdx) {
      var neighbors = counts[rowIdx][colIdx];
      if (cell.on) {
        if (cell.population.name === 'prey') {
          if (neighbors.predator > 0) {
            cell.on = false;
          }
        } else if (cell.population.name === 'predator') {
          if (neighbors.predator === 0 || neighbors.predator > 3 || neighbors.prey < 1) {
            cell.on = false;
          }
        }
      }
    })
  })
}

function makeCells() {
  counts = getNeighborCounts(cells);
  cells.forEach(function(row, rowIdx) {
    row.forEach(function(cell, colIdx) {
      var neighbors = counts[rowIdx][colIdx];
      if (!cell.on) {
        if (neighbors.predator === 2 || neighbors.predator === 3) {
          cell.on = true;
          cell.population = populations[0];
        } else if (neighbors.prey >= 2) {
          cell.on = true;
          cell.population = populations[1];
        }
      }
    })
  })
}

games.push({
  name: 'Predator/Prey',
  cells: cells,
  populations: populations,
  doStep: function() {
    killCells();
    makeCells();
  }
});

})();
