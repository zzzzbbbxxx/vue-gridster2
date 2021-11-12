const GridType = {
  Fit: 'fit',
  ScrollVertical: 'scrollVertical',
  ScrollHorizontal: 'scrollHorizontal',
  Fixed: 'fixed',
  VerticalFixed: 'verticalFixed',
  HorizontalFixed: 'horizontalFixed'
}

const DirTypes = {
  LTR: 'ltr',
  RTL: 'rtl'
}

export const Renderer = {
  setStyle(el, prop, value) {
    el.style[prop] = value
  },
  removeClass(el, className) {
    el.classList.remove(className)
  },
  addClass(el, className) {
    el.classList.add(className)
  },
  listen(key, event, handler) {
    if (key === 'document') {
      document.addEventListener(event, handler)
      return () => document.removeEventListener(event, handler)
    } else if (key === 'window') {
      window.addEventListener(event, handler)
      return () => window.removeEventListener(event, handler)
    } else if (key instanceof HTMLElement) {
      key.addEventListener(event, handler)
      return () => key.removeEventListener(event, handler)
    }
  }
}

export class GridsterRenderer {
  constructor(gridster) {
    this.gridster = gridster
  }

  destroy() {
  // @ts-ignore
    delete this.gridster
  }

  updateItem(el, item, renderer = Renderer) {
    if (this.gridster.mobile) {
      this.clearCellPosition(renderer, el)
      if (this.gridster._options.keepFixedHeightInMobile) {
        el.style.height = ((item.rows - 1) * this.gridster._options.margin + item.rows * this.gridster._options.fixedRowHeight) + 'px'
        // renderer.setStyle(el, 'height', ((item.rows - 1) * this.gridster._options.margin + item.rows * this.gridster._options.fixedRowHeight) + 'px')
      } else {
        el.style.height = (item.rows * this.gridster.curWidth / item.cols) + 'px'
        // renderer.setStyle(el, 'height', (item.rows * this.gridster.curWidth / item.cols) + 'px')
      }
      if (this.gridster._options.keepFixedWidthInMobile) {
        el.style.width = this.gridster._options.fixedColWidth + 'px'
        // renderer.setStyle(el, 'width', this.gridster._options.fixedColWidth + 'px')
      } else {
        el.style.width = ''
        // renderer.setStyle(el, 'width', '')
      }
      el.style.marginBottom = this.gridster._options.margin + 'px'
      el.style[DirTypes.LTR ? 'marginRight' : 'marginLeft'] = ''
      // renderer.setStyle(el, 'margin-bottom', this.gridster._options.margin + 'px')
      // renderer.setStyle(el, DirTypes.LTR ? 'margin-right' : 'margin-left', '')
    } else {
      const x = Math.round(this.gridster.curColWidth * item.x)
      const y = Math.round(this.gridster.curRowHeight * item.y)
      const width = this.gridster.curColWidth * item.cols - this.gridster._options.margin
      const height = (this.gridster.curRowHeight * item.rows - this.gridster._options.margin)
      // set the cell style`
      this.setCellPosition(renderer, el, x, y)
      el.style.width = width + 'px'
      el.style.height = height + 'px'
      // renderer.setStyle(el, 'width', width + 'px')
      // renderer.setStyle(el, 'height', height + 'px')
      let marginBottom = null
      let marginRight = null
      if (this.gridster._options.outerMargin) {
        if (this.gridster.rows === item.rows + item.y) {
          if (this.gridster._options.outerMarginBottom !== null) {
            marginBottom = this.gridster._options.outerMarginBottom + 'px'
          } else {
            marginBottom = this.gridster._options.margin + 'px'
          }
        }
        if (this.gridster.columns === item.cols + item.x) {
          if (this.gridster._options.outerMarginBottom !== null) {
            marginRight = this.gridster._options.outerMarginRight + 'px'
          } else {
            marginRight = this.gridster._options.margin + 'px'
          }
        }
      }

      renderer.setStyle(el, 'margin-bottom', marginBottom)
      renderer.setStyle(el, DirTypes.LTR ? 'margin-right' : 'margin-left', marginRight)
    }
  }

  updateGridster() {
    let addClass = ''
    let removeClass1 = ''
    let removeClass2 = ''
    let removeClass3 = ''
    if (this.gridster._options.gridType === GridType.Fit) {
      addClass = GridType.Fit
      removeClass1 = GridType.ScrollVertical
      removeClass2 = GridType.ScrollHorizontal
      removeClass3 = GridType.Fixed
    } else if (this.gridster._options.gridType === GridType.ScrollVertical) {
      this.gridster.curRowHeight = this.gridster.curColWidth * this.gridster._options.rowHeightRatio
      addClass = GridType.ScrollVertical
      removeClass1 = GridType.Fit
      removeClass2 = GridType.ScrollHorizontal
      removeClass3 = GridType.Fixed
    } else if (this.gridster._options.gridType === GridType.ScrollHorizontal) {
      const widthRatio = this.gridster._options.rowHeightRatio
      const calWidthRatio = widthRatio >= 1 ? widthRatio : widthRatio + 1
      this.gridster.curColWidth = this.gridster.curRowHeight * calWidthRatio
      addClass = GridType.ScrollHorizontal
      removeClass1 = GridType.Fit
      removeClass2 = GridType.ScrollVertical
      removeClass3 = GridType.Fixed
    } else if (this.gridster._options.gridType === GridType.Fixed) {
      this.gridster.curColWidth = this.gridster._options.fixedColWidth +
    (this.gridster._options.ignoreMarginInRow ? 0 : this.gridster._options.margin)
      this.gridster.curRowHeight = this.gridster._options.fixedRowHeight +
    (this.gridster._options.ignoreMarginInRow ? 0 : this.gridster._options.margin)
      addClass = GridType.Fixed
      removeClass1 = GridType.Fit
      removeClass2 = GridType.ScrollVertical
      removeClass3 = GridType.ScrollHorizontal
    } else if (this.gridster._options.gridType === GridType.VerticalFixed) {
      this.gridster.curRowHeight = this.gridster._options.fixedRowHeight +
    (this.gridster._options.ignoreMarginInRow ? 0 : this.gridster._options.margin)
      addClass = GridType.ScrollVertical
      removeClass1 = GridType.Fit
      removeClass2 = GridType.ScrollHorizontal
      removeClass3 = GridType.Fixed
    } else if (this.gridster._options.gridType === GridType.HorizontalFixed) {
      this.gridster.curColWidth = this.gridster._options.fixedColWidth +
    (this.gridster._options.ignoreMarginInRow ? 0 : this.gridster._options.margin)
      addClass = GridType.ScrollHorizontal
      removeClass1 = GridType.Fit
      removeClass2 = GridType.ScrollVertical
      removeClass3 = GridType.Fixed
    }

    if (this.gridster.mobile || this.gridster._options.setGridSize && this.gridster._options.gridType !== GridType.Fit) {
      this.gridster.$el.classList.remove(addClass)
      // this.gridster.renderer.removeClass(this.gridster.el, addClass)
    } else {
      this.gridster.$el.classList.add(addClass)
      // this.gridster.renderer.addClass(this.gridster.el, addClass)
    }
    this.gridster.$el.classList.remove(removeClass1)
    this.gridster.$el.classList.remove(removeClass2)
    this.gridster.$el.classList.remove(removeClass3)
    // this.gridster.renderer.removeClass(this.gridster.el, removeClass1)
    // this.gridster.renderer.removeClass(this.gridster.el, removeClass2)
    // this.gridster.renderer.removeClass(this.gridster.el, removeClass3)
  }

  getGridColumnStyle(i) {
    return {
      ...this.getLeftPosition(this.gridster.curColWidth * i),
      width: this.gridster.curColWidth - this.gridster._options.margin + 'px',
      height: this.gridster.gridRows.length * this.gridster.curRowHeight - this.gridster._options.margin + 'px'
    }
  }

  getGridRowStyle(i) {
    return {
      ...this.getTopPosition(this.gridster.curRowHeight * i),
      width: this.gridster.gridColumns.length * this.gridster.curColWidth - this.gridster._options.margin + 'px',
      height: this.gridster.curRowHeight - this.gridster._options.margin + 'px'
    }
  }

  getLeftPosition(d) {
    const dPosition = this.gridster._options.dirType === DirTypes.RTL ? -d : d
    if (this.gridster._options.useTransformPositioning) {
      return {
        transform: 'translateX(' + dPosition + 'px)',
      }
    } else {
      return {
        left: (this.getLeftMargin() + dPosition) + 'px'
      }
    }
  }

  getTopPosition(d) {
    if (this.gridster._options.useTransformPositioning) {
      return {
        transform: 'translateY(' + d + 'px)',
      }
    } else {
      return {
        top: this.getTopMargin() + d + 'px'
      }
    }
  }

  clearCellPosition(renderer, el) {
    if (this.gridster._options.useTransformPositioning) {
      renderer.setStyle(el, 'transform', '')
    } else {
      renderer.setStyle(el, 'top', '')
      renderer.setStyle(el, 'left', '')
    }
  }

  setCellPosition(renderer, el, x, y) {
    const xPosition = this.gridster._options.dirType === DirTypes.RTL ? -x : x
    if (this.gridster._options.useTransformPositioning) {
      const transform = 'translate3d(' + xPosition + 'px, ' + y + 'px, 0)'
      renderer.setStyle(el, 'transform', transform)
    } else {
      renderer.setStyle(el, 'left', this.getLeftMargin() + xPosition + 'px')
      renderer.setStyle(el, 'top', this.getTopMargin() + y + 'px')
    }
  }

  getLeftMargin() {
    if (this.gridster._options.outerMargin) {
      if (this.gridster._options.outerMarginLeft !== null) {
        return this.gridster._options.outerMarginLeft
      } else {
        return this.gridster._options.margin
      }
    } else {
      return 0
    }
  }

  getTopMargin() {
    if (this.gridster._options.outerMargin) {
      if (this.gridster._options.outerMarginTop !== null) {
        return this.gridster._options.outerMarginTop
      } else {
        return this.gridster._options.margin
      }
    } else {
      return 0
    }
  }
}
