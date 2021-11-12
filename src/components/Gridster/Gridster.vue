<template>
  <div class="gridster">
    <div v-for="(column, i) in gridColumns" :key="i" class="gridster-column" :style="gridRenderer.getGridColumnStyle(i)" />
    <div v-for="(row, i) in gridRows" :key="i" class="gridster-row" :style="gridRenderer.getGridRowStyle(i)" />
    <slot />
    <gridster-preview ref="preview" :grid-renderer="gridRenderer" class="gridster-preview" />
  </div>
</template>

<script >
import GridsterPreview from './GridsterPreview'
import { GridsterConfig } from './GridsterConfig'
import { GridsterUtils } from './GridsterUtils'
import { GridsterRenderer, Renderer } from './gridsterRenderer'
import { GridsterConfigService } from './GridsterConfigConstant'
import { GridsterEmptyCell } from './GridsterEmptyCell'
import { GridsterCompact } from './GridsterCompact'

const GridType = {
  Fit: 'fit',
  ScrollVertical: 'scrollVertical',
  ScrollHorizontal: 'scrollHorizontal',
  Fixed: 'fixed',
  VerticalFixed: 'verticalFixed',
  HorizontalFixed: 'horizontalFixed'
}

export default {
  name: 'Gridster',
  components: {
    GridsterPreview
  },
  provide() {
    const _this = this
    return {
      gridster: _this
    }
  },
  props: {
    options: {
      type: Object,
      default: GridsterConfig()
    }
  },
  data() {
    return {
      gridRenderer: new GridsterRenderer(),
      calculateLayoutDebounce: () => {},
      movingItem: () => {},
      _options: JSON.parse(JSON.stringify(GridsterConfigService)),
      mobile: false,
      curWidth: null,
      curHeight: null,
      grid: [],
      columns: 0,
      rows: 0,
      curColWidth: 0,
      curRowHeight: 0,
      gridColumns: [],
      gridRows: [],
      windowResize: () => {},
      dragInProgress: false,
      emptyCell: {},
      compact: {},
      renderer: Renderer
    }
  },
  watch: {
    // 变更选项
    options: {
      handler(newOptions) {
        this._options.api = {
          optionsChanged: this.optionsChanged.bind(this),
          resize: this.onResize.bind(this),
          getNextPossiblePosition: this.getNextPossiblePosition.bind(this),
          getFirstPossiblePosition: this.getFirstPossiblePosition.bind(this),
          getLastPossiblePosition: this.getLastPossiblePosition.bind(this),
          getItemComponent: (item) => this.getItemComponent(item)
        }
        this.setOptions()
        this.columns = this._options.minCols
        this.rows = this._options.minRows
        this.setGridSize()
        this.calculateLayout()
      },
      deep: true,
    }
  },
  created() {
    this.calculateLayoutDebounce = GridsterUtils.debounce(this.calculateLayout.bind(this), 0)
    this.mobile = false
    this.curWidth = 0
    this.curHeight = 0
    this.grid = []
    this.curColWidth = 0
    this.curRowHeight = 0
    this.dragInProgress = false
    this.emptyCell = new GridsterEmptyCell(this)
    this.compact = new GridsterCompact(this)
    this.gridRenderer = new GridsterRenderer(this)
  },
  mounted() {
    if (this.options.initCallback) {
      this.options.initCallback(this)
    }
    this.setOptions()
  },
  unmounted() {
    if (this.windowResize) {
      this.windowResize()
    }
    if (this.options && this.options.destroyCallback) {
      this.options.destroyCallback(this)
    }
    if (this.options && this.options.api) {
      this._options.api.resize = undefined
      this._options.api.optionsChanged = undefined
      this._options.api.getNextPossiblePosition = undefined
      this._options.api = undefined
    }
    this.emptyCell.destroy()
    // @ts-ignore
    delete this.emptyCell
    this.compact.destroy()
    // @ts-ignore
    delete this.compact
  },
  methods: {
    // identical to checkCollision() except that here we add boundaries.
    checkCollisionTwoItemsForSwaping(item, item2) {
      // if the cols or rows of the items are 1 , doesnt make any sense to set a boundary. Only if the item is bigger we set a boundary
      const horizontalBoundaryItem1 = item.cols === 1 ? 0 : 1
      const horizontalBoundaryItem2 = item2.cols === 1 ? 0 : 1
      const verticalBoundaryItem1 = item.rows === 1 ? 0 : 1
      const verticalBoundaryItem2 = item2.rows === 1 ? 0 : 1
      return item.x + horizontalBoundaryItem1 < item2.x + item2.cols &&
        item.x + item.cols > item2.x + horizontalBoundaryItem2 &&
        item.y + verticalBoundaryItem1 < item2.y + item2.rows &&
        item.y + item.rows > item2.y + verticalBoundaryItem2
    },
    checkCollisionTwoItems(item, item2) {
      const collision = item.x < item2.x + item2.cols &&
        item.x + item.cols > item2.x &&
        item.y < item2.y + item2.rows &&
        item.y + item.rows > item2.y
      if (!collision) {
        return false
      }
      if (!this._options.allowMultiLayer) {
        return true
      }
      const defaultLayerIndex = this._options.defaultLayerIndex
      const layerIndex = item.layerIndex === undefined ? defaultLayerIndex : item.layerIndex
      const layerIndex2 = item2.layerIndex === undefined ? defaultLayerIndex : item2.layerIndex
      return layerIndex === layerIndex2
    },
    resize() {
      let height
      let width
      if (this._options.gridType === 'fit' && !this.mobile) {
        width = this.$el.offsetWidth
        height = this.$el.offsetHeight
      } else {
        width = this.$el.clientWidth
        height = this.$el.clientHeight
      }
      if ((width !== this.curWidth || height !== this.curHeight) && this.checkIfToResize()) {
        this.onResize()
      }
    },
    setOptions() {
      this._options = GridsterUtils.merge(this._options, this.options, this._options)
      if (!this._options.disableWindowResize && !this.windowResize) {
        this.windowResize = this.renderer.listen('window', 'resize', this.onResize.bind(this))
      } else if (this._options.disableWindowResize && this.windowResize) {
        this.windowResize()
        this.windowResize = null
      }
      this.emptyCell.updateOptions()
    },
    optionsChanged() {
      this.setOptions()
      let widgetsIndex = this.grid.length - 1
      let widget
      for (; widgetsIndex >= 0; widgetsIndex--) {
        widget = this.grid[widgetsIndex]
        widget.updateOptions()
      }
      this.calculateLayout()
    },
    onResize() {
      if (this.$el.clientWidth) {
        if (this.options.setGridSize) { // reset width/height so the size is recalculated afterwards
          this.$el.style.width = ''
          this.$el.style.height = ''
          // this.renderer.setStyle(this.$el, 'width', '')
          // this.renderer.setStyle(this.$el, 'height', '')
        }
        this.setGridSize()
        this.calculateLayout()
      }
    },
    checkIfToResize() {
      const clientWidth = this.$el.clientWidth
      const offsetWidth = this.$el.offsetWidth
      const scrollWidth = this.$el.scrollWidth
      const clientHeight = this.$el.clientHeight
      const offsetHeight = this.$el.offsetHeight
      const scrollHeight = this.$el.scrollHeight
      const verticalScrollPresent = clientWidth < offsetWidth && scrollHeight > offsetHeight &&
        scrollHeight - offsetHeight < offsetWidth - clientWidth
      const horizontalScrollPresent = clientHeight < offsetHeight &&
        scrollWidth > offsetWidth && scrollWidth - offsetWidth < offsetHeight - clientHeight
      if (verticalScrollPresent) {
        return false
      }
      return !horizontalScrollPresent
    },
    setGridSize() {
      const el = this.$el
      let width
      let height
      if (this._options.setGridSize || this._options.gridType === GridType.Fit && !this.mobile) {
        width = el.offsetWidth
        height = el.offsetHeight
      } else {
        width = el.clientWidth
        height = el.clientHeight
      }
      this.curWidth = width
      this.curHeight = height
    },
    setGridDimensions() {
      this.setGridSize()
      if (!this.mobile && this._options.mobileBreakpoint > this.curWidth) {
        this.mobile = !this.mobile
        this.$el.classList.add('mobile')
        // this.renderer.addClass(this.$el, 'mobile')
      } else if (this.mobile && this._options.mobileBreakpoint < this.curWidth) {
        this.mobile = !this.mobile
        this.$el.classList.remove('mobile')
        // this.renderer.removeClass(this.$el, 'mobile')
      }
      let rows = this._options.minRows
      let columns = this._options.minCols

      let widgetsIndex = this.grid.length - 1
      let widget
      for (; widgetsIndex >= 0; widgetsIndex--) {
        widget = this.grid[widgetsIndex]
        if (!widget.notPlaced) {
          rows = Math.max(rows, widget.$item.y + widget.$item.rows)
          columns = Math.max(columns, widget.$item.x + widget.$item.cols)
        }
      }

      if (this.columns !== columns || this.rows !== rows) {
        this.columns = columns
        this.rows = rows
        if (this.options.gridSizeChangedCallback) {
          this.options.gridSizeChangedCallback(this)
        }
      }
    },
    calculateLayout() {
      if (this.compact) {
        this.compact.checkCompact()
      }

      this.setGridDimensions()
      if (this._options.outerMargin) {
        let marginWidth = -this._options.margin
        if (this._options.outerMarginLeft !== null) {
          marginWidth += this._options.outerMarginLeft
          this.$el.style.paddingLeft = this._options.outerMarginLeft + 'px'
          // this.renderer.setStyle(this.$el, 'padding-left', this._options.outerMarginLeft + 'px')
        } else {
          marginWidth += this._options.margin
          this.$el.style.paddingLeft = this._options.margin + 'px'
          // this.renderer.setStyle(this.$el, 'padding-left', this._options.margin + 'px')
        }
        if (this._options.outerMarginRight !== null) {
          marginWidth += this._options.outerMarginRight
          this.$el.style.paddingRight = this._options.outerMarginRight + 'px'
          // this.renderer.setStyle(this.$el, 'padding-right', this._options.outerMarginRight + 'px')
        } else {
          marginWidth += this._options.margin
          this.$el.style.paddingRight = this._options.margin + 'px'
          // this.renderer.setStyle(this.$el, 'padding-right', this._options.margin + 'px')
        }
        this.curColWidth = (this.curWidth - marginWidth) / this.columns
        let marginHeight = -this._options.margin
        if (this._options.outerMarginTop !== null) {
          marginHeight += this._options.outerMarginTop
          this.$el.style.paddingTop = this._options.outerMarginTop + 'px'
          // this.renderer.setStyle(this.$el, 'padding-top', this._options.outerMarginTop + 'px')
        } else {
          marginHeight += this._options.margin
          this.$el.style.paddingTop = this._options.margin + 'px'
          // this.renderer.setStyle(this.$el, 'padding-top', this._options.margin + 'px')
        }
        if (this._options.outerMarginBottom !== null) {
          marginHeight += this._options.outerMarginBottom
          this.$el.style.paddingBottom = this._options.outerMarginBottom + 'px'
          // this.renderer.setStyle(this.$el, 'padding-bottom', this._options.outerMarginBottom + 'px')
        } else {
          marginHeight += this._options.margin
          this.$el.style.paddingBottom = this._options.margin + 'px'
          // this.renderer.setStyle(this.$el, 'padding-bottom', this._options.margin + 'px')
        }
        this.curRowHeight = ((this.curHeight - marginHeight) / this.rows) * this._options.rowHeightRatio
      } else {
        this.curColWidth = (this.curWidth + this._options.margin) / this.columns
        this.curRowHeight = ((this.curHeight + this._options.margin) / this.rows) * this._options.rowHeightRatio
        this.$el.style.paddingLeft = 0 + 'px'
        this.$el.style.paddingRight = 0 + 'px'
        this.$el.style.paddingTop = 0 + 'px'
        this.$el.style.paddingBottom = 0 + 'px'
        /* this.renderer.setStyle(this.$el, 'padding-left', 0 + 'px')
        this.renderer.setStyle(this.$el, 'padding-right', 0 + 'px')
        this.renderer.setStyle(this.$el, 'padding-top', 0 + 'px')
        this.renderer.setStyle(this.$el, 'padding-bottom', 0 + 'px')*/
      }
      this.gridRenderer.updateGridster()

      if (this._options.setGridSize) {
        this.$el.classList.add('gridSize')
        // this.renderer.addClass(this.$el, 'gridSize')
        if (!this.mobile) {
          this.$el.style.width = (this.columns * this.curColWidth + this._options.margin) + 'px'
          this.$el.style.height = (this.rows * this.curRowHeight + this._options.margin) + 'px'
          // this.renderer.setStyle(this.$el, 'width', (this.columns * this.curColWidth + this._options.margin) + 'px')
          // this.renderer.setStyle(this.$el, 'height', (this.rows * this.curRowHeight + this._options.margin) + 'px')
        }
      } else {
        this.$el.classList.remove('gridSize')
        // this.renderer.removeClass(this.$el, 'gridSize')
        this.$el.style.width = ''
        this.$el.style.height = ''
        // this.renderer.setStyle(this.$el, 'width', '')
        // this.renderer.setStyle(this.$el, 'height', '')
      }
      this.updateGrid()

      let widgetsIndex = this.grid.length - 1
      let widget
      for (; widgetsIndex >= 0; widgetsIndex--) {
        widget = this.grid[widgetsIndex]
        widget.setSize()
        widget.drag.toggle()
        widget.resize.toggle()
      }

      setTimeout(this.resize.bind(this), 100)
    },
    updateGrid() {
      if (this._options.displayGrid === 'always' && !this.mobile) {
        this.$el.classList.add('display-grid')
        // this.renderer.addClass(this.$el, 'display-grid')
      } else if (this._options.displayGrid === 'onDrag&Resize' && this.dragInProgress) {
        this.$el.classList.add('display-grid')
        // this.renderer.addClass(this.$el, 'display-grid')
      } else if (this._options.displayGrid === 'none' || !this.dragInProgress || this.mobile) {
        this.$el.classList.remove('display-grid')
        // this.renderer.removeClass(this.$el, 'display-grid')
      }
      this.setGridDimensions()
      this.gridColumns.length = this.getNewArrayLength(this.columns, this.curWidth, this.curColWidth)
      this.gridRows.length = this.getNewArrayLength(this.rows, this.curHeight, this.curRowHeight)
      // this.cdRef.markForCheck()
    },
    addItem(itemComponent) {
      if (itemComponent.$item.cols === undefined) {
        itemComponent.$item.cols = this._options.defaultItemCols
        itemComponent.item.cols = itemComponent.$item.cols
        itemComponent.itemChanged()
      }
      if (itemComponent.$item.rows === undefined) {
        itemComponent.$item.rows = this._options.defaultItemRows
        itemComponent.item.rows = itemComponent.$item.rows
        itemComponent.itemChanged()
      }
      if (itemComponent.$item.x === -1 || itemComponent.$item.y === -1) {
        this.autoPositionItem(itemComponent)
      } else if (this.checkCollision(itemComponent.$item)) {
        if (!this._options.disableWarnings) {
          itemComponent.notPlaced = true
          console.warn('Can\'t be placed in the bounds of the dashboard, trying to auto position!/n' +
            JSON.stringify(itemComponent.item, ['cols', 'rows', 'x', 'y']))
        }
        if (!this._options.disableAutoPositionOnConflict) {
          this.autoPositionItem(itemComponent)
        } else {
          itemComponent.notPlaced = true
        }
      }
      this.grid.push(itemComponent)
      this.calculateLayoutDebounce()
    },
    removeItem(itemComponent) {
      this.grid.splice(this.grid.indexOf(itemComponent), 1)
      this.calculateLayoutDebounce()
      if (this.options.itemRemovedCallback) {
        this.options.itemRemovedCallback(itemComponent.item, itemComponent)
      }
    },
    checkCollision(gridsterItem) {
      let collision = false
      if (this.options.itemValidateCallback) {
        collision = !this.options.itemValidateCallback(gridsterItem)
      }
      if (!collision && this.checkGridCollision(gridsterItem)) {
        collision = true
      }
      if (!collision) {
        const c = this.findItemWithItem(gridsterItem)
        if (c) {
          collision = c
        }
      }
      return collision
    },
    checkGridCollision(item) {
      const noNegativePosition = item.y > -1 && item.x > -1
      const maxGridCols = item.cols + item.x <= this._options.maxCols
      const maxGridRows = item.rows + item.y <= this._options.maxRows
      const maxItemCols = item.maxItemCols === undefined ? this._options.maxItemCols : item.maxItemCols
      const minItemCols = item.minItemCols === undefined ? this._options.minItemCols : item.minItemCols
      const maxItemRows = item.maxItemRows === undefined ? this._options.maxItemRows : item.maxItemRows
      const minItemRows = item.minItemRows === undefined ? this._options.minItemRows : item.minItemRows
      const inColsLimits = item.cols <= maxItemCols && item.cols >= minItemCols
      const inRowsLimits = item.rows <= maxItemRows && item.rows >= minItemRows
      const minAreaLimit = item.minItemArea === undefined ? this._options.minItemArea : item.minItemArea
      const maxAreaLimit = item.maxItemArea === undefined ? this._options.maxItemArea : item.maxItemArea
      const area = item.cols * item.rows
      const inMinArea = minAreaLimit <= area
      const inMaxArea = maxAreaLimit >= area
      return !(noNegativePosition && maxGridCols && maxGridRows && inColsLimits && inRowsLimits && inMinArea && inMaxArea)
    },
    findItemWithItem(item) {
      let widgetsIndex = 0
      let widget
      for (; widgetsIndex < this.grid.length; widgetsIndex++) {
        widget = this.grid[widgetsIndex]
        if (widget.$item !== item && this.checkCollisionTwoItems(widget.$item, item)) {
          return widget
        }
      }
      return false
    },
    findItemsWithItem(item) {
      const a = []
      let widgetsIndex = 0
      let widget
      for (; widgetsIndex < this.grid.length; widgetsIndex++) {
        widget = this.grid[widgetsIndex]
        if (widget.$item !== item && this.checkCollisionTwoItems(widget.$item, item)) {
          a.push(widget)
        }
      }
      return a
    },
    autoPositionItem(itemComponent) {
      if (this.getNextPossiblePosition(itemComponent.$item)) {
        itemComponent.notPlaced = false
        itemComponent.item.x = itemComponent.$item.x
        itemComponent.item.y = itemComponent.$item.y
        itemComponent.itemChanged()
      } else {
        itemComponent.notPlaced = true
        if (!this._options.disableWarnings) {
          console.warn('Can\'t be placed in the bounds of the dashboard!/n' +
            JSON.stringify(itemComponent.item, ['cols', 'rows', 'x', 'y']))
        }
      }
    },
    getNextPossiblePosition(newItem, startingFrom = {}) {
      if (newItem.cols === -1) {
        newItem.cols = this._options.defaultItemCols
      }
      if (newItem.rows === -1) {
        newItem.rows = this._options.defaultItemRows
      }
      this.setGridDimensions()
      let rowsIndex = startingFrom.y || 0
      let colsIndex
      for (; rowsIndex < this.rows; rowsIndex++) {
        newItem.y = rowsIndex
        colsIndex = startingFrom.x || 0
        for (; colsIndex < this.columns; colsIndex++) {
          newItem.x = colsIndex
          if (!this.checkCollision(newItem)) {
            return true
          }
        }
      }
      const canAddToRows = this._options.maxRows >= this.rows + newItem.rows
      const canAddToColumns = this._options.maxCols >= this.columns + newItem.cols
      const addToRows = this.rows <= this.columns && canAddToRows
      if (!addToRows && canAddToColumns) {
        newItem.x = this.columns
        newItem.y = 0
        return true
      } else if (canAddToRows) {
        newItem.y = this.rows
        newItem.x = 0
        return true
      }
      return false
    },
    getFirstPossiblePosition(item) {
      const tmpItem = Object.assign({}, item)
      this.getNextPossiblePosition(tmpItem)
      return tmpItem
    },
    getLastPossiblePosition(item) {
      let farthestItem = { y: 0, x: 0 }
      farthestItem = this.grid.reduce((prev, curr) => {
        const currCoords = { y: curr.$item.y + curr.$item.rows - 1, x: curr.$item.x + curr.$item.cols - 1 }
        if (GridsterUtils.compareItems(prev, currCoords) === 1) {
          return currCoords
        } else {
          return prev
        }
      }, farthestItem)

      const tmpItem = Object.assign({}, item)
      this.getNextPossiblePosition(tmpItem, farthestItem)
      return tmpItem
    },
    pixelsToPositionX(x, roundingMethod, noLimit) {
      const position = roundingMethod(x / this.curColWidth)
      if (noLimit) {
        return position
      } else {
        return Math.max(position, 0)
      }
    },
    pixelsToPositionY(y, roundingMethod, noLimit) {
      const position = roundingMethod(y / this.curRowHeight)
      if (noLimit) {
        return position
      } else {
        return Math.max(position, 0)
      }
    },
    positionXToPixels(x) {
      return x * this.curColWidth
    },
    positionYToPixels(y) {
      return y * this.curRowHeight
    },
    getItemComponent(item) {
      return this.grid.find(c => c.item === item)
    },
    // ------ Functions for swapWhileDragging option

    // identical to checkCollision() except that this function calls findItemWithItemForSwaping() instead of findItemWithItem()
    checkCollisionForSwaping(item) {
      let collision = false
      if (this.options.itemValidateCallback) {
        collision = !this.options.itemValidateCallback(item)
      }
      if (!collision && this.checkGridCollision(item)) {
        collision = true
      }
      if (!collision) {
        const c = this.findItemWithItemForSwapping(item)
        if (c) {
          collision = c
        }
      }
      return collision
    },
    // identical to findItemWithItem() except that this function calls checkCollisionTwoItemsForSwaping() instead of checkCollisionTwoItems()
    findItemWithItemForSwapping(gridsterItem) {
      let widgetsIndex = this.grid.length - 1
      let widget
      for (; widgetsIndex > -1; widgetsIndex--) {
        widget = this.grid[widgetsIndex]
        if (widget.$item !== gridsterItem && this.checkCollisionTwoItemsForSwaping(widget.$item, gridsterItem)) {
          return widget
        }
      }
      return false
    },
    previewStyle(drag) {
      if (this.movingItem) {
        if (this.compact && drag) {
          this.compact.checkCompactItem(this.movingItem)
        }
        this.$refs.preview?.previewStyle(this.movingItem)
      } else {
        this.$refs.preview?.previewStyle()
      }
    },
    // ------ End of functions for swapWhileDragging option

    getNewArrayLength(length, overallSize, size) {
      const newLength = Math.max(length, Math.floor(overallSize / size))

      if (newLength < 0) {
        return 0
      }

      if (Number.isFinite(newLength)) {
        return Math.floor(newLength)
      }

      return 0
    }
  },

}

</script>

<style scoped>
.gridster {
  position: relative;
  box-sizing: border-box;
  background: #EBEEF4;
  width: 100%;
  height: 100%;
  user-select: none;
  display: block;
}

.gridster.fit {
  overflow-x: hidden;
  overflow-y: hidden;
}

.gridster.scrollVertical {
  overflow-x: hidden;
  overflow-y: auto;
}

.gridster.scrollHorizontal {
  overflow-x: auto;
  overflow-y: hidden;
}

.gridster.fixed {
  overflow: auto;
}

.gridster.mobile {
  overflow-x: hidden;
  overflow-y: auto;
}

.gridster.mobile .gridster-item {
  position: relative;
}

.gridster.gridSize {
  height: initial;
  width: initial;
}

.gridster.gridSize.fit {
  height: 100%;
  width: 100%;
}

.gridster .gridster-column, .gridster .gridster-row {
  position: absolute;
  display: none;
  transition: .3s;
  box-sizing: border-box;
}

.gridster.display-grid .gridster-column, .gridster.display-grid .gridster-row {
  display: block;
}

.gridster .gridster-column {
  border-left: 1px dashed #CCD2D8;
  border-right: 1px dashed #CCD2D8;
}

.gridster .gridster-row {
  border-top: 1px dashed #CCD2D8;
  border-bottom: 1px dashed #CCD2D8;
}

</style>
