import { RefObject, useRef, useState } from "react";

export const getElementPosition = <T extends HTMLElement>(elementRef: RefObject<T>) => {
  const getPosition = getElementProperty(elementRef);

  return {
    bottom: getPosition("bottom"),
    left: getPosition("left"),
    height: getPosition("height"),
    width: getPosition("width"),
  };
};

// 引数のtargetProperty をDOMRectのもつPropertyに限定する
type DOMRectProperty = keyof Omit<DOMRect, "toJSON">;

const getElementProperty = <T extends HTMLElement>(elementRef: RefObject<T>) => {
  const getElementProperty = (targetProperty: DOMRectProperty): number => {
    const clientRect = elementRef.current?.getBoundingClientRect();
    if (clientRect) {
      return clientRect[targetProperty];
    }

    // clientRect が undefined のときはデフォルトで0を返すようにする
    return 0;
  };

  return getElementProperty;
};
