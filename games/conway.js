(function() {

var ALIVE_RATIO = .2;

var game = {
  name: "Conway",
  populations: [{
    name: 'cell',
    color: "blue",
  }],
}

game.reset = function() {
  game.cells = initCells();
  iterateCells(game.cells, function(cell, rowIdx, colIdx) {
    game.cells[rowIdx][colIdx] = {
      on: Math.random() < ALIVE_RATIO ? true : false,
      population: game.populations[0],
    };
  });
}

game.doStep = function() {
  var counts = getNeighborCounts(game.cells);
  game.cells.forEach(function(row, rowIdx) {
    row.forEach(function(cell, colIdx) {
      var neighbors = counts[rowIdx][colIdx];
      if (cell.on) {
        if (neighbors.cell < 2 || neighbors.cell > 3) {
          cell.on = false;
        }
      } else {
        if (neighbors.cell === 3) {
          cell.on = true;
        }
      }
    })
  })
}

games.push(game);

})();
