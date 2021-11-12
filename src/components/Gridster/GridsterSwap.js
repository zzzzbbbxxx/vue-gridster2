export class GridsterSwap {
  swapedItem;
  gridsterItem;
  gridster;

  constructor(gridsterItem) {
    this.gridsterItem = gridsterItem
    this.gridster = gridsterItem.gridster
  }

  destroy() {
    // @ts-ignore
    delete this.gridster
    // @ts-ignore
    delete this.gridsterItem
    delete this.swapedItem
  }

  swapItems() {
    if (this.gridster._options.swap) {
      this.checkSwapBack()
      this.checkSwap(this.gridsterItem)
    }
  }

  checkSwapBack() {
    if (this.swapedItem) {
      const x = this.swapedItem.$item.x
      const y = this.swapedItem.$item.y
      this.swapedItem.$item.x = this.swapedItem.item.x || 0
      this.swapedItem.$item.y = this.swapedItem.item.y || 0
      if (this.gridster.checkCollision(this.swapedItem.$item)) {
        this.swapedItem.$item.x = x
        this.swapedItem.$item.y = y
      } else {
        this.swapedItem.setSize()
        this.gridsterItem.$item.x = this.gridsterItem.item.x || 0
        this.gridsterItem.$item.y = this.gridsterItem.item.y || 0
        this.swapedItem = undefined
      }
    }
  }

  restoreSwapItem() {
    if (this.swapedItem) {
      this.swapedItem.$item.x = this.swapedItem.item.x || 0
      this.swapedItem.$item.y = this.swapedItem.item.y || 0
      this.swapedItem.setSize()
      this.swapedItem = undefined
    }
  }

  setSwapItem() {
    if (this.swapedItem) {
      this.swapedItem.checkItemChanges(this.swapedItem.$item, this.swapedItem.item)
      this.swapedItem = undefined
    }
  }

  checkSwap(pushedBy) {
    let gridsterItemCollision
    if (this.gridster._options.swapWhileDragging) {
      gridsterItemCollision = this.gridster.checkCollisionForSwaping(pushedBy.$item)
    } else {
      gridsterItemCollision = this.gridster.checkCollision(pushedBy.$item)
    }
    if (gridsterItemCollision && gridsterItemCollision !== true && gridsterItemCollision.canBeDragged()) {
      const gridsterItemCollide = gridsterItemCollision
      const copyCollisionX = gridsterItemCollide.$item.x
      const copyCollisionY = gridsterItemCollide.$item.y
      const copyX = pushedBy.$item.x
      const copyY = pushedBy.$item.y
      const diffX = copyX - copyCollisionX
      const diffY = copyY - copyCollisionY
      gridsterItemCollide.$item.x = pushedBy.item.x - diffX
      gridsterItemCollide.$item.y = pushedBy.item.y - diffY
      pushedBy.$item.x = gridsterItemCollide.item.x + diffX
      pushedBy.$item.y = gridsterItemCollide.item.y + diffY
      if (this.gridster.checkCollision(gridsterItemCollide.$item) || this.gridster.checkCollision(pushedBy.$item)) {
        pushedBy.$item.x = copyX
        pushedBy.$item.y = copyY
        gridsterItemCollide.$item.x = copyCollisionX
        gridsterItemCollide.$item.y = copyCollisionY
      } else {
        gridsterItemCollide.setSize()
        this.swapedItem = gridsterItemCollide
        if (this.gridster._options.swapWhileDragging) {
          this.gridsterItem.checkItemChanges(this.gridsterItem.$item, this.gridsterItem.item)
          this.setSwapItem()
        }
      }
    }
  }
}
