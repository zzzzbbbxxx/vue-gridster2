import { CompactType } from './GridsterConfig.js'

export class GridsterCompact {
  gridster;

  /**
   *
   * @param {GridsterComponentInterface} gridster
   */
  constructor(gridster) {
    this.gridster = gridster
  }

  destroy() {
    delete this.gridster
  }

  checkCompact() {
    const compactType = this.gridster?._options?.compactType
    if (compactType && compactType !== CompactType.None) {
      if (this.gridster._options.compactType === CompactType.CompactUp) {
        this.checkCompactMovement('y', -1)
      } else if (this.gridster._options.compactType === CompactType.CompactLeft) {
        this.checkCompactMovement('x', -1)
      } else if (this.gridster._options.compactType === CompactType.CompactUpAndLeft) {
        this.checkCompactMovement('y', -1)
        this.checkCompactMovement('x', -1)
      } else if (this.gridster._options.compactType === CompactType.CompactLeftAndUp) {
        this.checkCompactMovement('x', -1)
        this.checkCompactMovement('y', -1)
      } else if (this.gridster._options.compactType === CompactType.CompactRight) {
        this.checkCompactMovement('x', 1)
      } else if (this.gridster._options.compactType === CompactType.CompactUpAndRight) {
        this.checkCompactMovement('y', -1)
        this.checkCompactMovement('x', 1)
      } else if (this.gridster._options.compactType === CompactType.CompactRightAndUp) {
        this.checkCompactMovement('x', 1)
        this.checkCompactMovement('y', -1)
      } else if (this.gridster._options.compactType === CompactType.CompactDown) {
        this.checkCompactMovement('y', 1)
      } else if (this.gridster._options.compactType === CompactType.CompactDownAndLeft) {
        this.checkCompactMovement('y', 1)
        this.checkCompactMovement('x', -1)
      } else if (this.gridster._options.compactType === CompactType.CompactDownAndRight) {
        this.checkCompactMovement('y', 1)
        this.checkCompactMovement('x', 1)
      } else if (this.gridster._options.compactType === CompactType.CompactLeftAndDown) {
        this.checkCompactMovement('x', -1)
        this.checkCompactMovement('y', 1)
      } else if (this.gridster._options.compactType === CompactType.CompactRightAndDown) {
        this.checkCompactMovement('x', 1)
        this.checkCompactMovement('y', 1)
      }
    }
  }

  /**
   *
   * @param {GridsterItem} item
   */
  checkCompactItem(item) {
    if (this.gridster._options.compactType !== CompactType.None) {
      if (this.gridster._options.compactType === CompactType.CompactUp) {
        this.moveTillCollision(item, 'y', -1)
      } else if (this.gridster._options.compactType === CompactType.CompactLeft) {
        this.moveTillCollision(item, 'x', -1)
      } else if (this.gridster._options.compactType === CompactType.CompactUpAndLeft) {
        this.moveTillCollision(item, 'y', -1)
        this.moveTillCollision(item, 'x', -1)
      } else if (this.gridster._options.compactType === CompactType.CompactLeftAndUp) {
        this.moveTillCollision(item, 'x', -1)
        this.moveTillCollision(item, 'y', -1)
      } else if (this.gridster._options.compactType === CompactType.CompactUpAndRight) {
        this.moveTillCollision(item, 'y', -1)
        this.moveTillCollision(item, 'x', 1)
      } else if (this.gridster._options.compactType === CompactType.CompactDown) {
        this.moveTillCollision(item, 'y', 1)
      } else if (this.gridster._options.compactType === CompactType.CompactDownAndLeft) {
        this.moveTillCollision(item, 'y', 1)
        this.moveTillCollision(item, 'x', -1)
      } else if (this.gridster._options.compactType === CompactType.CompactLeftAndDown) {
        this.moveTillCollision(item, 'x', -1)
        this.moveTillCollision(item, 'y', 1)
      } else if (this.gridster._options.compactType === CompactType.CompactDownAndRight) {
        this.moveTillCollision(item, 'y', 1)
        this.moveTillCollision(item, 'x', 1)
      } else if (this.gridster._options.compactType === CompactType.CompactRightAndDown) {
        this.moveTillCollision(item, 'x', 1)
        this.moveTillCollision(item, 'y', 1)
      }
    }
  }

  /**
   *
   * @param {'x'|'y'}direction
   * @param {number}delta
   * @return {void}
   */
  checkCompactMovement(direction, delta) {
    let widgetMoved = false
    this.gridster.grid.forEach(
      /**
       * @param {GridsterItemComponentInterface} widget
       */
      (widget) => {
        if (widget.$item.compactEnabled !== false) {
          const moved = this.moveTillCollision(widget.$item, direction, delta)
          if (moved) {
            widgetMoved = true
            widget.item[direction] = widget.$item[direction]
            widget.itemChanged()
          }
        }
      })
    if (widgetMoved) {
      this.checkCompact()
    }
  }

  /**
   *
   * @param {GridsterItem}item
   * @param {'x' | 'y'}direction
   * @param {number}delta
   * @returns {boolean}
   */
  moveTillCollision(item, direction, delta) {
    item[direction] += delta
    if (this.gridster.checkCollision(item)) {
      item[direction] -= delta
      return false
    } else {
      this.moveTillCollision(item, direction, delta)
      return true
    }
  }
}
