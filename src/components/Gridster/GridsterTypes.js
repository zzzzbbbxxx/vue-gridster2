// GridsterInterface

export class GridsterComponentInterface {
  $options;
  grid;
  checkCollision;
  checkCollisionForSwaping;
  positionXToPixels;
  pixelsToPositionX;
  positionYToPixels;
  pixelsToPositionY;
  findItemWithItem;
  findItemsWithItem;
  checkGridCollision;
  checkCollisionTwoItems;
  getItemComponent;
  el;
  renderer;
  gridRenderer;
  cdRef;
  options;
  calculateLayoutDebounce;
  updateGrid;
  movingItem;
  addItem;
  removeItem;
  previewStyle;
  mobile = false;
  curWidth = 0;
  curHeight = 0 ;
  columns = 0;
  rows = 0;
  curColWidth=0;
  curRowHeight = 0;
  windowResize;
  setGridDimensions;
  dragInProgress = false;
  emptyCell;
  compact;
  zone;
  gridRows = [];
  gridColumns= [];
}
