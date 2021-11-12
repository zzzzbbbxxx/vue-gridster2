let scrollSensitivity = 0
let scrollSpeed = 0
const intervalDuration = 50
let gridsterElement
let resizeEvent
let resizeEventType
let intervalE = 0
let intervalW = 0
let intervalN = 0
let intervalS = 0

/*
interface Position {
}
*/

// type CalculatePosition = (position: Position) => void;

/**
 *
 * @param {GridsterComponentInterface}gridster
 * @param {number}left
 * @param {number}top
 * @param {number}width
 * @param {number}height
 * @param {MouseEvent}e
 * @param { clientX,clientY} lastMouse
 * @param {Function}calculateItemPosition
 * @param {GridsterResizeEventType}resizeEventScrollType
 * @param resize
 */
export function scroll(gridster, left, top, width, height,
  e, lastMouse, calculateItemPosition, resize, resizeEventScrollType) {
  scrollSensitivity = gridster._options.scrollSensitivity
  scrollSpeed = gridster._options.scrollSpeed
  gridsterElement = gridster.$el
  resizeEvent = resize
  resizeEventType = resizeEventScrollType

  const offsetWidth = gridsterElement.offsetWidth
  const offsetHeight = gridsterElement.offsetHeight
  const offsetLeft = gridsterElement.scrollLeft
  const offsetTop = gridsterElement.scrollTop
  const elemTopOffset = top - offsetTop
  const elemBottomOffset = offsetHeight + offsetTop - top - height

  if (!gridster._options.disableScrollVertical) {
    if (lastMouse.clientY < e.clientY && elemBottomOffset < scrollSensitivity) {
      cancelN()
      if ((resizeEvent && resizeEventType && !resizeEventType.s) || intervalS) {
        return
      }
      intervalS = startVertical(1, calculateItemPosition, lastMouse)
    } else if (lastMouse.clientY > e.clientY && offsetTop > 0 && elemTopOffset < scrollSensitivity) {
      cancelS()
      if ((resizeEvent && resizeEventType && !resizeEventType.n) || intervalN) {
        return
      }
      intervalN = startVertical(-1, calculateItemPosition, lastMouse)
    } else if (lastMouse.clientY !== e.clientY) {
      cancelVertical()
    }
  }

  const elemRightOffset = offsetLeft + offsetWidth - left - width
  const elemLeftOffset = left - offsetLeft

  if (!gridster._options.disableScrollHorizontal) {
    if (lastMouse.clientX < e.clientX && elemRightOffset <= scrollSensitivity) {
      cancelW()
      if ((resizeEvent && resizeEventType && !resizeEventType.e) || intervalE) {
        return
      }
      intervalE = startHorizontal(1, calculateItemPosition, lastMouse)
    } else if (lastMouse.clientX > e.clientX && offsetLeft > 0 && elemLeftOffset < scrollSensitivity) {
      cancelE()
      if ((resizeEvent && resizeEventType && !resizeEventType.w) || intervalW) {
        return
      }
      intervalW = startHorizontal(-1, calculateItemPosition, lastMouse)
    } else if (lastMouse.clientX !== e.clientX) {
      cancelHorizontal()
    }
  }
}

/**
 *
 * @param {number}sign
 * @param {Function}calculateItemPosition
 * @param {Position}lastMouse
 * @returns {NodeJS.Timer}
 */
function startVertical(sign, calculateItemPosition, lastMouse) {
  let clientY = lastMouse.clientY
  return setInterval(() => {
    if (!gridsterElement || sign === -1 && gridsterElement.scrollTop - scrollSpeed < 0) {
      cancelVertical()
    }
    // @ts-ignore
    gridsterElement.scrollTop += sign * scrollSpeed
    clientY += sign * scrollSpeed
    calculateItemPosition({ clientX: lastMouse.clientX, clientY })
  }, intervalDuration)
}

/**
 *
 * @param {number}sign
 * @param {Function}calculateItemPosition
 * @param {Position}lastMouse
 * @returns {NodeJS.Timer}
 */
function startHorizontal(sign, calculateItemPosition, lastMouse) {
  let clientX = lastMouse.clientX
  return setInterval(() => {
    if (!gridsterElement || sign === -1 && gridsterElement.scrollLeft - scrollSpeed < 0) {
      cancelHorizontal()
    }
    // @ts-ignore
    gridsterElement.scrollLeft += sign * scrollSpeed
    clientX += sign * scrollSpeed
    calculateItemPosition({ clientX, clientY: lastMouse.clientY })
  }, intervalDuration)
}

export function cancelScroll() {
  cancelHorizontal()
  cancelVertical()
  gridsterElement = null
}

function cancelHorizontal() {
  cancelE()
  cancelW()
}

function cancelVertical() {
  cancelN()
  cancelS()
}

function cancelE() {
  if (intervalE) {
    clearInterval(intervalE)
    intervalE = 0
  }
}

function cancelW() {
  if (intervalW) {
    clearInterval(intervalW)
    intervalW = 0
  }
}

function cancelS() {
  if (intervalS) {
    clearInterval(intervalS)
    intervalS = 0
  }
}

function cancelN() {
  if (intervalN) {
    clearInterval(intervalN)
    intervalN = 0
  }
}
