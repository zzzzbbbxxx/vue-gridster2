import { GridsterUtils } from './GridsterUtils.js'

export class GridsterEmptyCell {
  initialItem;
  emptyCellClick;
  emptyCellClickTouch;
  emptyCellContextMenu;
  emptyCellDrop;
  emptyCellDrag;
  emptyCellDragTouch;
  emptyCellMMove;
  emptyCellMMoveTouch;
  emptyCellUp;
  emptyCellUpTouch;
  emptyCellMove;
  emptyCellExit;
  gridster;

  constructor(gridster) {
    this.gridster = gridster
  }

  destroy() {
    // @ts-ignore
    delete this.initialItem
    // @ts-ignore
    delete this.gridster.movingItem
    if (this.gridster.previewStyle) {
      this.gridster.previewStyle()
    }
    // @ts-ignore
    delete this.gridster
    if (this.emptyCellExit) {
      this.emptyCellExit()
      this.emptyCellExit = null
    }
  }

  updateOptions() {
    if (this.gridster._options.enableEmptyCellClick && !this.emptyCellClick && this.gridster.options.emptyCellClickCallback) {
      this.emptyCellClick = this.gridster.renderer.listen(this.gridster.$el, 'click', this.emptyCellClickCb.bind(this))
      this.emptyCellClickTouch = this.gridster.renderer.listen(this.gridster.$el, 'touchend', this.emptyCellClickCb.bind(this))
    } else if (!this.gridster._options.enableEmptyCellClick && this.emptyCellClick && this.emptyCellClickTouch) {
      this.emptyCellClick()
      this.emptyCellClickTouch()
      this.emptyCellClick = null
      this.emptyCellClickTouch = null
    }
    if (this.gridster._options.enableEmptyCellContextMenu && !this.emptyCellContextMenu &&
      this.gridster.options.emptyCellContextMenuCallback) {
      this.emptyCellContextMenu = this.gridster.renderer.listen(this.gridster.$el, 'contextmenu', this.emptyCellContextMenuCb.bind(this))
    } else if (!this.gridster._options.enableEmptyCellContextMenu && this.emptyCellContextMenu) {
      this.emptyCellContextMenu()
      this.emptyCellContextMenu = null
    }
    if (this.gridster._options.enableEmptyCellDrop && !this.emptyCellDrop && this.gridster.options.emptyCellDropCallback) {
      this.emptyCellDrop = this.gridster.renderer.listen(this.gridster.$el, 'drop', this.emptyCellDragDrop.bind(this))
      // this.gridster.zone.runOutsideAngular(() => {
      this.emptyCellMove = this.gridster.renderer.listen(this.gridster.$el, 'dragover', this.emptyCellDragOver.bind(this))
      // })
      this.emptyCellExit = this.gridster.renderer.listen('document', 'dragend', () => {
        this.gridster.movingItem = null
        this.gridster.previewStyle()
      })
    } else if (!this.gridster._options.enableEmptyCellDrop && this.emptyCellDrop && this.emptyCellMove && this.emptyCellExit) {
      this.emptyCellDrop()
      this.emptyCellMove()
      this.emptyCellExit()
      this.emptyCellMove = null
      this.emptyCellDrop = null
      this.emptyCellExit = null
    }
    if (this.gridster._options.enableEmptyCellDrag && !this.emptyCellDrag && this.gridster.options.emptyCellDragCallback) {
      this.emptyCellDrag = this.gridster.renderer.listen(this.gridster.$el, 'mousedown', this.emptyCellMouseDown.bind(this))
      this.emptyCellDragTouch = this.gridster.renderer.listen(this.gridster.$el, 'touchstart', this.emptyCellMouseDown.bind(this))
    } else if (!this.gridster._options.enableEmptyCellDrag && this.emptyCellDrag && this.emptyCellDragTouch) {
      this.emptyCellDrag()
      this.emptyCellDragTouch()
      this.emptyCellDrag = null
      this.emptyCellDragTouch = null
    }
  }

  /**
   *
   * @param {MouseEvent}e
   */
  emptyCellClickCb(e) {
    if (!this.gridster || this.gridster.movingItem || GridsterUtils.checkContentClassForEmptyCellClickEvent(this.gridster, e)) {
      return
    }
    const item = this.getValidItemFromEvent(e)
    if (!item) {
      return
    }
    if (this.gridster.options.emptyCellClickCallback) {
      this.gridster.options.emptyCellClickCallback(e, item)
    }
  }

  /**
   *
   * @param {MouseEvent}e
   */
  emptyCellContextMenuCb(e) {
    if (this.gridster.movingItem || GridsterUtils.checkContentClassForEmptyCellClickEvent(this.gridster, e)) {
      return
    }
    e.preventDefault()
    e.stopPropagation()
    const item = this.getValidItemFromEvent(e)
    if (!item) {
      return
    }
    if (this.gridster.options.emptyCellContextMenuCallback) {
      this.gridster.options.emptyCellContextMenuCallback(e, item)
    }
  }

  /**
   *
   * @param {DragEvent}e
   */
  emptyCellDragDrop(e) {
    const item = this.getValidItemFromEvent(e)
    if (!item) {
      return
    }
    if (this.gridster.options.emptyCellDropCallback) {
      this.gridster.options.emptyCellDropCallback(e, item)
    }
  }

  /**
   *
   * @param {DragEvent}e
   */
  emptyCellDragOver(e) {
    e.preventDefault()
    e.stopPropagation()
    const item = this.getValidItemFromEvent(e)
    if (item) {
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'move'
      }
      this.gridster.movingItem = item
    } else {
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'none'
      }
      this.gridster.movingItem = null
    }
    this.gridster.previewStyle()
  }

  /**
   *
   * @param {MouseEvent}e
   */
  emptyCellMouseDown(e) {
    if (GridsterUtils.checkContentClassForEmptyCellClickEvent(this.gridster, e)) {
      return
    }
    e.preventDefault()
    e.stopPropagation()
    const item = this.getValidItemFromEvent(e)
    const leftMouseButtonCode = 1
    if (!item || e.buttons !== leftMouseButtonCode) {
      return
    }
    this.initialItem = item
    this.gridster.movingItem = item
    this.gridster.previewStyle()
    // this.gridster.zone.runOutsideAngular(() => {
    this.emptyCellMMove = this.gridster.renderer.listen('window', 'mousemove', this.emptyCellMouseMove.bind(this))
    this.emptyCellMMoveTouch = this.gridster.renderer.listen('window', 'touchmove', this.emptyCellMouseMove.bind(this))
    // })
    this.emptyCellUp = this.gridster.renderer.listen('window', 'mouseup', this.emptyCellMouseUp.bind(this))
    this.emptyCellUpTouch = this.gridster.renderer.listen('window', 'touchend', this.emptyCellMouseUp.bind(this))
  }

  /**
   *
   * @param {MouseEvent} e
   */
  emptyCellMouseMove(e) {
    e.preventDefault()
    e.stopPropagation()
    const item = this.getValidItemFromEvent(e, this.initialItem)
    if (!item) {
      return
    }

    this.gridster.movingItem = item
    this.gridster.previewStyle()
  }

  /**
   *
   * @param {MouseEvent}e
   */
  emptyCellMouseUp(e) {
    this.emptyCellMMove()
    this.emptyCellMMoveTouch()
    this.emptyCellUp()
    this.emptyCellUpTouch()
    const item = this.getValidItemFromEvent(e, this.initialItem)
    if (item) {
      this.gridster.movingItem = item
    }
    if (this.gridster.options.emptyCellDragCallback && this.gridster.movingItem) {
      this.gridster.options.emptyCellDragCallback(e, this.gridster.movingItem)
    }
    setTimeout(() => {
      this.initialItem = null
      if (this.gridster) {
        this.gridster.movingItem = null
        this.gridster.previewStyle()
      }
    })
  }

  /**
   *
   * @param {MouseEvent}e
   * @param {ClientRect}rect
   * @returns {number}
   */
  getPixelsX(e, rect) {
    const scale = this.gridster.options.scale
    if (scale) {
      return (e.clientX - rect.left) / scale + this.gridster.$el.scrollLeft - this.gridster.gridRenderer.getLeftMargin()
    }
    return e.clientX + this.gridster.$el.scrollLeft - rect.left - this.gridster.gridRenderer.getLeftMargin()
  }

  /**
   *
   * @param {MouseEvent}e
   * @param {ClientRect}rect
   * @returns {number}
   */
  getPixelsY(e, rect) {
    const scale = this.gridster.options.scale
    if (scale) {
      return (e.clientY - rect.top) / scale + this.gridster.$el.scrollTop - this.gridster.gridRenderer.getTopMargin()
    }
    return e.clientY + this.gridster.$el.scrollTop - rect.top - this.gridster.gridRenderer.getTopMargin()
  }

  /**
   *
   * @param {MouseEvent}e
   * @param {GridsterItem | null}oldItem
   */
  getValidItemFromEvent(e, oldItem) {
    e.preventDefault()
    e.stopPropagation()
    GridsterUtils.checkTouchEvent(e)
    const rect = this.gridster.$el.getBoundingClientRect()
    const x = this.getPixelsX(e, rect)
    const y = this.getPixelsY(e, rect)
    const item = {
      x: this.gridster.pixelsToPositionX(x, Math.floor, true),
      y: this.gridster.pixelsToPositionY(y, Math.floor, true),
      cols: this.gridster._options.defaultItemCols,
      rows: this.gridster._options.defaultItemRows
    }
    if (oldItem) {
      item.cols = Math.min(Math.abs(oldItem.x - item.x) + 1, this.gridster._options.emptyCellDragMaxCols)
      item.rows = Math.min(Math.abs(oldItem.y - item.y) + 1, this.gridster._options.emptyCellDragMaxRows)
      if (oldItem.x < item.x) {
        item.x = oldItem.x
      } else if (oldItem.x - item.x > this.gridster._options.emptyCellDragMaxCols - 1) {
        item.x = this.gridster.movingItem ? this.gridster.movingItem.x : 0
      }
      if (oldItem.y < item.y) {
        item.y = oldItem.y
      } else if (oldItem.y - item.y > this.gridster._options.emptyCellDragMaxRows - 1) {
        item.y = this.gridster.movingItem ? this.gridster.movingItem.y : 0
      }
    }
    if (!this.gridster._options.enableOccupiedCellDrop && this.gridster.checkCollision(item)) {
      return
    }
    return item
  }
}
