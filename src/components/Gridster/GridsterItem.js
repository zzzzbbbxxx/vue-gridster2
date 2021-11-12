import { GridsterDraggable } from './GridsterDraggable.js'
import { GridsterResizable } from './GridsterResizeable.js'

export class GridsterItemComponentInterface {
  item;
  $item;
  top = 0;
  left = 0;
  width = 0;
  height = 0;
  drag = new GridsterDraggable();
  resize = new GridsterResizable();
  notPlaced = false;
  updateOptions = () => {};
  itemChanged = () => {};
  setSize = () => {};
  checkItemChanges;
  canBeDragged = false;
  canBeResized = false ;
  bringToFront;
  sendToBack;
  el;
  gridster;
  renderer;
}

export const GridsterItem = () => {
  return {
    x: 0,
    y: 0,
    rows: 0,
    cols: 0,
    layerIndex: 0,
    initCallback: () => {},
    dragEnabled: false,
    resizeEnabled: false,
    compactEnabled: false,
    maxItemRows: 0,
    minItemRows: 0,
    maxItemCols: 0,
    minItemCols: 0,
    minItemArea: 0,
    maxItemArea: 0,
  }
}
