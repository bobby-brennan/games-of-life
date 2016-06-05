var SVG_SIZE = 500;
var CELL_SIZE = 5;
var CELLS_PER_ROW = CELLS_PER_COL = SVG_SIZE / CELL_SIZE;

var games = [];

function doStep() {
  if (!games.length) return;
  if (!games.active) games.active = games[0];
  games.active.doStep();
}

var drawInterval = null;
$(document).ready(function() {
  $('#Container').append('<svg height="' + SVG_SIZE + '" width="' + SVG_SIZE + '"></svg>')
  drawInterval = setInterval(doStep, 250);
})
function setSpeed() {
  clearInterval(drawInterval);
  drawInterval = setInterval(doStep, $('#Speed').val());
}

