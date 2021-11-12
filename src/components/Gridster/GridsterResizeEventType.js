
export class GridsterResizeEventType {
  n;// boolean;
  s;// boolean;
  w;// boolean;
  e;// boolean;
}

export class EventTarget2 extends EventTarget {
  hasAttribute; // (attribute: String) => boolean
  getAttribute; // (attribute: String) => boolean
}

export class MouseEvent2 extends MouseEvent {
  target//  EventTarget2;
}
