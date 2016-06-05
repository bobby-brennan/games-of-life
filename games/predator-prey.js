(function() {
var ALIVE_RATIO = .5;
var PREDATOR_RATIO = .5;

var game = {
  name: 'Predator/Prey',
}

game.populations = [{
  name: "predator",
  color: "red",
}, {
  name: "prey",
  color: "green",
}];

function choosePopulation() {
  var rand = Math.random();
  if (rand < PREDATOR_RATIO) return game.populations[0];
  else return game.populations[1];
}

game.reset = function() {
  game.cells = initCells();
  iterateCells(game.cells, function(cell, rowIdx, colIdx) {
    population = choosePopulation();
    game.cells[rowIdx][colIdx] = {
      on: Math.random() < ALIVE_RATIO,
      population: population,
    }
  })
}

function killCells() {
  counts = getNeighborCounts(game.cells);
  iterateCells(game.cells, function(cell, rowIdx, colIdx) {
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
  });
}

function makeCells() {
  counts = getNeighborCounts(game.cells);
  iterateCells(game.cells, function(cell, rowIdx, colIdx) {
    var neighbors = counts[rowIdx][colIdx];
    if (!cell.on) {
      if (neighbors.predator === 2 || neighbors.predator === 3) {
        cell.on = true;
        cell.population = game.populations[0];
      } else if (neighbors.prey >= 2) {
        cell.on = true;
        cell.population = game.populations[1];
      }
    }
  })
}

game.doStep = function() {
  killCells();
  makeCells();
}

games.push(game);

})();
