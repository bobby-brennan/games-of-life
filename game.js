var SVG_SIZE = 500;
var CELL_SIZE = 10;
var CELLS_PER_ROW = CELLS_PER_COL = SVG_SIZE / CELL_SIZE;

var games = [];

var lastLength = 0;
function doStep() {
  if (lastLength !== games.length) {
    redrawGames();
  }
  lastLength = games.length;
  if (!games.length) return;
  if (!games.active) setGame(games[0]);
  games.active.doStep();
  drawCells(games.active.cells);
}

function redrawGames() {
  $('#Games').html('');
  games.forEach(function(game, idx) {
    $('#Games').append('<a href="#" onclick="setGame(games[' + idx + '])">' + game.name + '</a><br>');
  });
}

function drawCells(cells) {
  $('svg').html('')
  var newContent = '';
  cells.forEach(function(row, rowIdx) {
    row.forEach(function(cell, colIdx) {
      if (cell.on) {
        xLoc = colIdx * CELL_SIZE;
        yLoc = rowIdx * CELL_SIZE;
        newContent += '<rect x="' + xLoc +
            '" y="' + yLoc +
            '" width="' + CELL_SIZE +
            '" height="' + CELL_SIZE +
            '" fill="' + cell.population.color +
            '"></rect>';
      }
    })
  })
  $('svg').html(newContent);
}

function countNeighbors(cells, row, col) {
  var prevRow = row - 1;
  var nextRow = row + 1;
  var prevCol = col - 1;
  var nextCol = col + 1;
  if (prevRow === -1) prevRow = cells.length - 1;
  if (prevCol === -1) prevCol = cells[0].length - 1;
  if (nextRow === cells.length) nextRow = 0;
  if (nextCol === cells[0].length) nextCol = 0;
  targets = [
    [prevRow, prevCol],
    [prevRow, col],
    [prevRow, nextCol],
    [row, prevCol],
    [row, nextCol],
    [nextRow, prevCol],
    [nextRow, col],
    [nextRow, nextCol],
  ];

  init = {};
  games.active.populations.forEach(function(pop) {
    init[pop.name] = 0;
  })

  return targets.map(function(indicies) {
    return cells[indicies[0]][indicies[1]];
  }).reduce(function(val, cell) {
    if (cell.on) {
      val[cell.population.name]++;
    }
    return val;
  }, init);
}

function getNeighborCounts(cells) {
  return cells.map(function(row, rowIdx) {
    return row.map(function(cell, colIdx) {
      return countNeighbors(cells, rowIdx, colIdx);
    })
  })
}

var drawInterval = null;
$(document).ready(function() {
  $('#Container').append('<svg height="' + SVG_SIZE + '" width="' + SVG_SIZE + '"></svg>');
  play();
})

function play() {
  if (drawInterval) clearInterval(drawInterval);
  $('#PauseButton').show();
  $('#PlayButton').hide();
  drawInterval = setInterval(doStep, $('#Speed').val());
}

function pause() {
  if (drawInterval) clearInterval(drawInterval);
  $('#PlayButton').show();
  $('#PauseButton').hide();
  drawInterval = null;
}

function restart() {
  games.active.reset();
  drawCells(games.active.cells);
}

function setGame(game) {
  games.active = game;
  games.active.reset();
  restart();
}

