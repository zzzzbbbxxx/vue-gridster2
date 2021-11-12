
export class GridsterUtils {
  static merge(obj1, obj2, properties) {
    for (const p in obj2) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj2[p] !== void 0 && properties.hasOwnProperty(p)) {
        if (typeof obj2[p] === 'object') {
          obj1[p] = GridsterUtils.merge(obj1[p], obj2[p], properties[p])
        } else {
          obj1[p] = obj2[p]
        }
      }
    }

    return obj1
  }

  static debounce(func, wait) {
    let timeout
    return function() {
      const context = this
      const args = arguments
      const later = () => {
        timeout = undefined
        func.apply(context, args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  static checkTouchEvent(e) {
    if (e.clientX === undefined && e.touches) {
      if (e.touches && e.touches.length) {
        e.clientX = e.touches[0].clientX
        e.clientY = e.touches[0].clientY
      } else if (e.changedTouches && e.changedTouches.length) {
        e.clientX = e.changedTouches[0].clientX
        e.clientY = e.changedTouches[0].clientY
      }
    }
  }

  static checkContentClassForEvent(gridster, e) {
    if (gridster._options.draggable.ignoreContent) {
      if (!GridsterUtils.checkDragHandleClass(e.target, e.currentTarget,
        gridster._options.draggable.dragHandleClass, gridster._options.draggable.ignoreContentClass)) {
        return true
      }
    } else {
      if (GridsterUtils.checkContentClass(e.target, e.currentTarget,
        gridster._options.draggable.ignoreContentClass)) {
        return true
      }
    }
    return false
  }

  static checkContentClassForEmptyCellClickEvent(gridster, e) {
    return GridsterUtils.checkContentClass(e.target, e.currentTarget, gridster._options.draggable.ignoreContentClass) ||
  GridsterUtils.checkContentClass(e.target, e.currentTarget, gridster._options.draggable.dragHandleClass)
  }

  static checkDragHandleClass(target, current, dragHandleClass, ignoreContentClass) {
    if (!target || target === current) {
      return false
    }
    if (target.hasAttribute('class')) {
      // @ts-ignore
      const classnames = target.getAttribute('class').split(' ')
      if (classnames.indexOf(dragHandleClass) > -1) {
        return true
      }
      if (classnames.indexOf(ignoreContentClass) > -1) {
        return false
      }
    }
    // @ts-ignore
    return GridsterUtils.checkDragHandleClass(target.parentNode, current, dragHandleClass, ignoreContentClass)
  }

  static checkContentClass(target, current, contentClass) {
    if (!target || target === current) {
      return false
    }
    // @ts-ignore
    if (target.hasAttribute('class') && target.getAttribute('class').split(' ').indexOf(contentClass) > -1) {
      return true
    } else {
      // @ts-ignore
      return GridsterUtils.checkContentClass(target.parentNode, current, contentClass)
    }
  }

  static compareItems(a = { x: 0, y: 0 }, b = { x: 0, y: 0 }) {
    if (a.y > b.y) {
      return -1
    } else if (a.y < b.y) {
      return 1
    } else if (a.x > b.x) {
      return -1
    } else {
      return 1
    }
  }
}
