var settings = {
  SVG_SIZE: 500,
  CELL_SIZE: 10,
}

var games = [];

function doStep() {
  games.active.doStep();
  drawCells(games.active.cells);
}

function redrawGame() {
  $('#Container').html('<svg height="' + settings.SVG_SIZE + '" width="' + settings.SVG_SIZE + '"></svg>');
}

function redrawGames() {
  $('#Games').html('');
  games.forEach(function(game, idx) {
    $('#Games').append('<a href="#" onclick="setGame(games[' + idx + '])">' + game.name + '</a><br>');
  });
}

function redrawSettings() {
  $('#Settings').html('');
  for (var setting in settings) {
    var html = '<div class="form-group"><label>' + setting + '</label>';
    html += '<input type="number" name="' + setting +
        '" onchange="updateSettings()" value="' + settings[setting] + '">';
    html += '</div>'
    $('#Settings').append(html);
  }
}

function updateSettings() {
  for (var setting in settings) {
    settings[setting] = $('input[name="' + setting + '"]').val();
  }
  restart();
}

function initCells() {
  var CELLS_PER_ROW = CELLS_PER_COL = settings.SVG_SIZE / settings.CELL_SIZE;
  var cells = [];
  for (var i = 0; i < CELLS_PER_ROW; ++i) {
    var row = [];
    cells.push(row)
    for (var j = 0; j < CELLS_PER_COL; ++j) {
      row.push(null);
    }
  }
  return cells;
}

function iterateCells(cells, cb) {
  cells.forEach(function(row, rowIdx) {
    row.forEach(function(cell, colIdx) {
      cb(cell, rowIdx, colIdx);
    });
  });
}

function drawCells(cells) {
  $('svg').html('')
  var newContent = '';
  cells.forEach(function(row, rowIdx) {
    row.forEach(function(cell, colIdx) {
      if (cell.on) {
        xLoc = colIdx * settings.CELL_SIZE;
        yLoc = rowIdx * settings.CELL_SIZE;
        newContent += '<rect x="' + xLoc +
            '" y="' + yLoc +
            '" width="' + settings.CELL_SIZE +
            '" height="' + settings.CELL_SIZE +
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
  redrawSettings();
  redrawGames();
  restart();
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
  redrawGame();
  if (!games.active) setGame(games[0]);
  games.active.reset();
  drawCells(games.active.cells);
}

function setGame(game) {
  games.active = game;
  games.active.reset();
  restart();
}

