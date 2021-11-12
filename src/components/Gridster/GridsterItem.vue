<template>
  <div class="gridster-item">
    <slot :$item="$item" />
    <div
      v-if="gridster._options.resizable.handles.s && resize.resizeEnabled"
      class="gridster-item-resizable-handler handle-s"
      @mousedown="resize.dragStartDelay($event)"
      @touchstart="resize.dragStartDelay($event)"
    />
    <div
      v-if="gridster._options.resizable.handles.e && resize.resizeEnabled"
      class="gridster-item-resizable-handler handle-e"
      @mousedown="resize.dragStartDelay($event)"
      @touchstart="resize.dragStartDelay($event)"
    />
    <div
      v-if="gridster._options.resizable.handles.n && resize.resizeEnabled"
      class="gridster-item-resizable-handler handle-n"
      @mousedown="resize.dragStartDelay($event)"
      @touchstart="resize.dragStartDelay($event)"
    />
    <div
      v-if="gridster._options.resizable.handles.w && resize.resizeEnabled"
      class="gridster-item-resizable-handler handle-w"
      @mousedown="resize.dragStartDelay($event)"
      @touchstart="resize.dragStartDelay($event)"
    />
    <div
      v-if="gridster._options.resizable.handles.se && resize.resizeEnabled"
      class="gridster-item-resizable-handler handle-se"
      @mousedown="resize.dragStartDelay($event)"
      @touchstart="resize.dragStartDelay($event)"
    />
    <div
      v-if="gridster._options.resizable.handles.ne && resize.resizeEnabled"
      class="gridster-item-resizable-handler handle-ne"
      @mousedown="resize.dragStartDelay($event)"
      @touchstart="resize.dragStartDelay($event)"
    />
    <div
      v-if="gridster._options.resizable.handles.sw && resize.resizeEnabled"
      class="gridster-item-resizable-handler handle-sw"
      @mousedown="resize.dragStartDelay($event)"
      @touchstart="resize.dragStartDelay($event)"
    />
    <div
      v-if="gridster._options.resizable.handles.nw && resize.resizeEnabled"
      class="gridster-item-resizable-handler handle-nw"
      @mousedown="resize.dragStartDelay($event)"
      @touchstart="resize.dragStartDelay($event)"
    />
  </div>
</template>

<script >
/* eslint-disable vue/no-mutating-props */
import { GridsterDraggable } from './GridsterDraggable'
import { GridsterResizable } from './GridsterResizeable'
import { GridsterUtils } from './GridsterUtils'
import { Renderer } from './gridsterRenderer'
import { nextTick } from 'vue'

export default {
  name: 'GridsterItem',
  components: {

  },
  inject: ['gridster'],
  props: {
    item: {
      type: Object,
      default: undefined // GridsterItem 对象
    }
  },
  emits: ['itemInit', 'itemChange', 'itemResize'],
  data() {
    return {
      renderer: Renderer,
      $item: {},
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      drag: {},
      resize: {},
      notPlaced: false,
      init: false
    }
  },
  watch: {
    item: {
      handler(item, oldValue) {
        this.updateOptions()
        if (oldValue) {
          this.setSize()
        }
      },
      deep: true,
    },
    init() {
      this.gridster.calculateLayoutDebounce()
    }
  },
  created() {
    this.$item = {
      cols: -1,
      rows: -1,
      x: -1,
      y: -1,
    }
    this.resize = new GridsterResizable(this, this.gridster)
    this.drag = new GridsterDraggable(this, this.gridster)
    this.updateOptions()
  },
  mounted() {
    this.gridster.addItem(this)
  },
  unmounted() {
    this.gridster.removeItem(this)
    // @ts-ignore
    delete this.gridster
    this.drag.destroy()
    // @ts-ignore
    delete this.drag
    this.resize.destroy()
    // @ts-ignore
    delete this.resize
  },
  methods: {
    updateOptions() {
      this.$item = GridsterUtils.merge(this.$item, this.item, {
        cols: undefined,
        rows: undefined,
        x: undefined,
        y: undefined,
        layerIndex: undefined,
        dragEnabled: undefined,
        resizeEnabled: undefined,
        compactEnabled: undefined,
        maxItemRows: undefined,
        minItemRows: undefined,
        maxItemCols: undefined,
        minItemCols: undefined,
        maxItemArea: undefined,
        minItemArea: undefined,
      })
    },
    setSize() {
      this.$el.style.display = this.notPlaced ? '' : 'block'
      // this.renderer.setStyle(this.$el, 'display', this.notPlaced ? '' : 'block')
      nextTick(() => {
        this.gridster.gridRenderer.updateItem(this.$el, this.$item)
        this.updateItemSize()
      })
    },
    updateItemSize() {
      const top = this.$item.y * this.gridster.curRowHeight
      const left = this.$item.x * this.gridster.curColWidth
      const width = this.$item.cols * this.gridster.curColWidth - this.gridster._options.margin
      const height = this.$item.rows * this.gridster.curRowHeight - this.gridster._options.margin

      this.top = top
      this.left = left

      if (!this.init && width > 0 && height > 0) {
        this.init = true
        if (this.item.initCallback) {
          this.item.initCallback(this.item, this)
        }
        if (this.gridster.options.itemInitCallback) {
          this.gridster.options.itemInitCallback(this.item, this)
        }
        this.$emit('itemInit', { item: this.item, itemComponent: this })
        if (this.gridster._options.scrollToNewItems) {
          this.$el.scrollIntoView(false)
        }
      }
      if (width !== this.width || height !== this.height) {
        this.width = width
        this.height = height
        if (this.gridster.options.itemResizeCallback) {
          this.gridster.options.itemResizeCallback(this.item, this)
        }
        this.$emit('itemResize', { item: this.item, itemComponent: this })
        // this.itemResize.next({ item: this.item, itemComponent: this })
      }
    },
    itemChanged() {
      if (this.gridster.options.itemChangeCallback) {
        this.gridster.options.itemChangeCallback(this.item, this)
      }
      this.$emit('itemChange', { item: this.item, itemComponent: this })
    },
    checkItemChanges(newValue, oldValue) {
      if (newValue.rows === oldValue.rows && newValue.cols === oldValue.cols && newValue.x === oldValue.x && newValue.y === oldValue.y) {
        return
      }
      if (this.gridster.checkCollision(this.$item)) {
        this.$item.x = oldValue.x || 0
        this.$item.y = oldValue.y || 0
        this.$item.cols = oldValue.cols || 1
        this.$item.rows = oldValue.rows || 1
        this.setSize()
      } else {
        this.item.cols = this.$item.cols
        this.item.rows = this.$item.rows
        this.item.x = this.$item.x
        this.item.y = this.$item.y
        this.gridster.calculateLayoutDebounce()
        this.itemChanged()
      }
    },
    canBeDragged() {
      const gridDragEnabled = this.gridster._options.draggable.enabled
      const itemDragEnabled = this.$item.dragEnabled === undefined ? gridDragEnabled : this.$item.dragEnabled
      return !this.gridster.mobile && gridDragEnabled && itemDragEnabled
    },
    canBeResized() {
      const gridResizable = this.gridster._options.resizable.enabled
      const itemResizable = this.$item.resizeEnabled === undefined ? gridResizable : this.$item.resizeEnabled
      return !this.gridster.mobile && gridResizable && itemResizable
    },
    bringToFront(offset) {
      if (offset && offset <= 0) {
        return
      }
      const layerIndex = this.getLayerIndex()
      const topIndex = this.gridster._options.maxLayerIndex
      if (layerIndex < topIndex) {
        const targetIndex = offset ? layerIndex + offset : topIndex
        this.item.layerIndex = this.$item.layerIndex = targetIndex > topIndex ? topIndex : targetIndex
      }
    },
    sendToBack(offset) {
      if (offset && offset <= 0) {
        return
      }
      const layerIndex = this.getLayerIndex()
      if (layerIndex > 0) {
        const targetIndex = offset ? layerIndex - offset : 0
        this.item.layerIndex = this.$item.layerIndex = targetIndex < 0 ? 0 : targetIndex
      }
    },
    getLayerIndex() {
      if (this.item.layerIndex !== undefined) {
        return this.item.layerIndex
      }
      if (this.gridster._options.defaultLayerIndex !== undefined) {
        return this.gridster._options.defaultLayerIndex
      }
      return 0
    }
  }

}

</script>

<style scoped>
.gridster-item {
  box-sizing: border-box;
  z-index: 1;
  position: absolute;
  overflow: hidden;
  transition: .3s;
  display: none;
  background: white;
  user-select: text;
  border-radius: 16px;
}

.gridster-item.gridster-item-moving {
  cursor: move;
}

.gridster-item.gridster-item-resizing, .gridster-item.gridster-item-moving {
  transition: 0s;
  z-index: 200;
  box-shadow: 0 0 5px 5px rgba(0, 0, 0, .2), 0 6px 10px 0 rgba(0, 0, 0, .14), 0 1px 18px 0 rgba(0, 0, 0, .12);
}

.gridster-item-resizable-handler {
  position: absolute;
  z-index: 200;
}

.gridster-item-resizable-handler.handle-n {
  cursor: ns-resize;
  height: 10px;
  right: 0;
  top: 0;
  left: 0;
}

.gridster-item-resizable-handler.handle-e {
  cursor: ew-resize;
  width: 10px;
  bottom: 0;
  right: 0;
  top: 0;
}

.gridster-item-resizable-handler.handle-s {
  cursor: ns-resize;
  height: 10px;
  right: 0;
  bottom: 0;
  left: 0;
}

.gridster-item-resizable-handler.handle-w {
  cursor: ew-resize;
  width: 10px;
  left: 0;
  top: 0;
  bottom: 0;
}

.gridster-item-resizable-handler.handle-ne {
  cursor: ne-resize;
  width: 10px;
  height: 10px;
  right: 0;
  top: 0;
}

.gridster-item-resizable-handler.handle-nw {
  cursor: nw-resize;
  width: 10px;
  height: 10px;
  left: 0;
  top: 0;
}

.gridster-item-resizable-handler.handle-se {
  cursor: se-resize;
  width: 0;
  height: 0;
  right: 0;
  bottom: 0;
  border-style: solid;
  border-width: 0 0 10px 10px;
  border-color: transparent;
}

.gridster-item-resizable-handler.handle-sw {
  cursor: sw-resize;
  width: 10px;
  height: 10px;
  left: 0;
  bottom: 0;
}

.gridster-item:hover .gridster-item-resizable-handler.handle-se {
  border-color: transparent transparent #ccc
}

</style>
