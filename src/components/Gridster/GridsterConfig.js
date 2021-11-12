export const DirTypes = {
  LTR: 'ltr',
  RTL: 'rtl'
}

export const GridType = {
  Fit: 'fit',
  ScrollVertical: 'scrollVertical',
  ScrollHorizontal: 'scrollHorizontal',
  Fixed: 'fixed',
  VerticalFixed: 'verticalFixed',
  HorizontalFixed: 'horizontalFixed'
}

export const CompactType = {
  None: 'none',
  CompactUp: 'compactUp',
  CompactLeft: 'compactLeft',
  CompactUpAndLeft: 'compactUp&Left',
  CompactLeftAndUp: 'compactLeft&Up',
  CompactRight: 'compactRight',
  CompactUpAndRight: 'compactUp&Right',
  CompactRightAndUp: 'compactRight&Up',
  CompactDown: 'compactDown',
  CompactDownAndLeft: 'compactDown&Left',
  CompactLeftAndDown: 'compactLeft&Down',
  CompactDownAndRight: 'compactDown&Right',
  CompactRightAndDown: 'compactRight&Down'
}

export const DisplayGrid = {
  Always: 'always',
  OnDragAndResize: 'onDrag&Resize',
  None: 'none'
}

/**
 *
 * @param gridType
 * @param scale
 * @param fixedColWidth
 * @param fixedRowHeight
 * @param keepFixedHeightInMobile
 * @param keepFixedWidthInMobile
 * @param setGridSize
 * @param compactType
 * @param mobileBreakpoint
 * @param allowMultiLayer
 * @param defaultLayerIndex
 * @param maxLayerIndex
 * @param baseLayerIndex
 * @param minCols
 * @param maxCols
 * @param minRows
 * @param maxRows
 * @param defaultItemCols
 * @param defaultItemRows
 * @param maxItemCols
 * @param maxItemRows
 * @param minItemCols
 * @param minItemRows
 * @param minItemArea
 * @param maxItemArea
 * @param rowHeightRatio
 * @param margin
 * @param outerMargin
 * @param outerMarginTop
 * @param outerMarginRight
 * @param outerMarginBottom
 * @param outerMarginLeft
 * @param useTransformPositioning
 * @param scrollSensitivity
 * @param scrollSpeed
 * @param initCallback
 * @param destroyCallback
 * @param gridSizeChangedCallback
 * @param itemChangeCallback
 * @param itemResizeCallback
 * @param itemInitCallback
 * @param itemRemovedCallback
 * @param itemValidateCallback
 * @param draggable
 * @param resizable
 * @param swap
 * @param swapWhileDragging
 * @param pushItems
 * @param disablePushOnDrag
 * @param disablePushOnResize
 * @param disableAutoPositionOnConflict
 * @param pushDirections
 * @param pushResizeItems
 * @param displayGrid
 * @param disableWindowResize
 * @param disableWarnings
 * @param scrollToNewItems
 * @param disableScrollHorizontal
 * @param disableScrollVertical
 * @param enableEmptyCellClick
 * @param enableEmptyCellContextMenu
 * @param enableEmptyCellDrop
 * @param enableEmptyCellDrag
 * @param enableOccupiedCellDrop
 * @param emptyCellClickCallback
 * @param emptyCellContextMenuCallback
 * @param emptyCellDropCallback
 * @param emptyCellDragCallback
 * @param emptyCellDragMaxCols
 * @param emptyCellDragMaxRows
 * @param ignoreMarginInRow
 * @param dirType
 * @param resize
 * @param optionsChanged
 * @param getNextPossiblePosition
 * @param getFirstPossiblePosition
 * @param getLastPossiblePosition
 * @param getItemComponent
 * @returns {{displayGrid, outerMargin, minCols, itemInitCallback, maxLayerIndex, scrollSpeed, maxItemArea, minItemRows, emptyCellDragMaxCols, enableEmptyCellDrag, maxRows, useTransformPositioning, api: {optionsChanged, getFirstPossiblePosition, getNextPossiblePosition, resize, getItemComponent, getLastPossiblePosition}, disablePushOnResize, minRows, margin, rowHeightRatio, swap, outerMarginLeft, defaultItemRows, outerMarginTop, enableEmptyCellContextMenu, enableOccupiedCellDrop, scrollToNewItems, initCallback, keepFixedHeightInMobile, outerMarginBottom, mobileBreakpoint, defaultLayerIndex, disableWarnings, swapWhileDragging, disableScrollVertical, keepFixedWidthInMobile, itemResizeCallback, fixedColWidth, maxCols, pushItems, emptyCellClickCallback, maxItemRows, disableWindowResize, defaultItemCols, outerMarginRight, emptyCellDragCallback, scale, allowMultiLayer, itemChangeCallback, scrollSensitivity, disableAutoPositionOnConflict, draggable, gridType, itemRemovedCallback, minItemArea, compactType, pushDirections, maxItemCols, disableScrollHorizontal, emptyCellContextMenuCallback, resizable, baseLayerIndex, gridSizeChangedCallback, enableEmptyCellDrop, dirType, setGridSize, emptyCellDropCallback, fixedRowHeight, destroyCallback, minItemCols, disablePushOnDrag, pushResizeItems, emptyCellDragMaxRows, enableEmptyCellClick, ignoreMarginInRow, itemValidateCallback}}
 * @constructor
 */
export const GridsterConfig = (
  { gridType,
    scale,
    fixedColWidth,
    fixedRowHeight,
    keepFixedHeightInMobile,
    keepFixedWidthInMobile,
    setGridSize,
    compactType,
    mobileBreakpoint,
    allowMultiLayer,
    defaultLayerIndex,
    maxLayerIndex,
    baseLayerIndex,
    minCols,
    maxCols,
    minRows,
    maxRows,
    defaultItemCols,
    defaultItemRows,
    maxItemCols,
    maxItemRows,
    minItemCols,
    minItemRows,
    minItemArea,
    maxItemArea,
    rowHeightRatio,
    margin,
    outerMargin,
    outerMarginTop,
    outerMarginRight,
    outerMarginBottom,
    outerMarginLeft,
    useTransformPositioning,
    scrollSensitivity,
    scrollSpeed,
    initCallback,
    destroyCallback,
    gridSizeChangedCallback,
    itemChangeCallback,
    itemResizeCallback,
    itemInitCallback,
    itemRemovedCallback,
    itemValidateCallback,
    draggable,
    resizable,
    swap,
    swapWhileDragging,
    pushItems,
    disablePushOnDrag,
    disablePushOnResize,
    disableAutoPositionOnConflict,
    pushDirections,
    pushResizeItems,
    displayGrid,
    disableWindowResize,
    disableWarnings,
    scrollToNewItems,
    disableScrollHorizontal,
    disableScrollVertical,
    enableEmptyCellClick,
    enableEmptyCellContextMenu,
    enableEmptyCellDrop,
    enableEmptyCellDrag,
    enableOccupiedCellDrop,
    emptyCellClickCallback,
    emptyCellContextMenuCallback,
    emptyCellDropCallback,
    emptyCellDragCallback,
    emptyCellDragMaxCols,
    emptyCellDragMaxRows,
    ignoreMarginInRow,
    dirType,

    resize,
    optionsChanged,
    getNextPossiblePosition,
    getFirstPossiblePosition,
    getLastPossiblePosition,
    getItemComponent } = {}) => {
  return {
    gridType,
    scale,
    fixedColWidth,
    fixedRowHeight,
    keepFixedHeightInMobile,
    keepFixedWidthInMobile,
    setGridSize,
    compactType,
    mobileBreakpoint,
    allowMultiLayer,
    defaultLayerIndex,
    maxLayerIndex,
    baseLayerIndex,
    minCols,
    maxCols,
    minRows,
    maxRows,
    defaultItemCols,
    defaultItemRows,
    maxItemCols,
    maxItemRows,
    minItemCols,
    minItemRows,
    minItemArea,
    maxItemArea,
    rowHeightRatio,
    margin,
    outerMargin,
    outerMarginTop,
    outerMarginRight,
    outerMarginBottom,
    outerMarginLeft,
    useTransformPositioning,
    scrollSensitivity,
    scrollSpeed,
    initCallback,
    destroyCallback,
    gridSizeChangedCallback,
    itemChangeCallback,
    itemResizeCallback,
    itemInitCallback,
    itemRemovedCallback,
    itemValidateCallback,
    draggable,
    resizable,
    swap,
    swapWhileDragging,
    pushItems,
    disablePushOnDrag,
    disablePushOnResize,
    disableAutoPositionOnConflict,
    pushDirections,
    pushResizeItems,
    displayGrid,
    disableWindowResize,
    disableWarnings,
    scrollToNewItems,
    disableScrollHorizontal,
    disableScrollVertical,
    enableEmptyCellClick,
    enableEmptyCellContextMenu,
    enableEmptyCellDrop,
    enableEmptyCellDrag,
    enableOccupiedCellDrop,
    emptyCellClickCallback,
    emptyCellContextMenuCallback,
    emptyCellDropCallback,
    emptyCellDragCallback,
    emptyCellDragMaxCols,
    emptyCellDragMaxRows,
    ignoreMarginInRow,
    dirType,
    api: {
      resize,
      optionsChanged,
      getNextPossiblePosition,
      getFirstPossiblePosition,
      getLastPossiblePosition,
      getItemComponent,
    }
  }
}
