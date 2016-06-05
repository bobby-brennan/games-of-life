(function() {

var ALIVE_RATIO = .2;

var population = {
  name: 'cell',
  color: "blue",
}

var cells = [];
for (var i = 0; i < CELLS_PER_ROW; ++i) {
  var row = [];
  cells.push(row)
  for (var j = 0; j < CELLS_PER_COL; ++j) {
    row.push({on: Math.random() < ALIVE_RATIO ? true : false, population: population})
  }
}


function doStep() {
  var counts = getNeighborCounts(cells);
  cells.forEach(function(row, rowIdx) {
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

games.push({
  name: "Conway",
  doStep: doStep,
  cells: cells,
  populations: [population],
})

})();
