import {  useEffect, useState } from "react";

/**
 * Gets bounding boxes for an element. This is implemented for you
 */
export function getElementBounds(elem: HTMLElement) {
  const bounds = elem.getBoundingClientRect();
  const top = bounds.top + window.scrollY;
  const left = bounds.left + window.scrollX;

  return {
    x: left,
    y: top,
    top,
    left,
    width: bounds.width,
    height: bounds.height,
  };
}

/**
 * **TBD:** Implement a function that checks if a point is inside an element
 */
export function isPointInsideElement(
  coordinate: { x: number; y: number },
  element: HTMLElement
): boolean {
  const bounds = getElementBounds(element);
  return (
    coordinate.x>bounds.left && 
    coordinate.x<bounds.left+bounds.width && 
    coordinate.y>bounds.top && 
    coordinate.y<bounds.top+bounds.height
  );
}


/**
 * **TBD:** Implement a function that returns the height of the first line of text in an element
 * We will later use this to size the HTML element that contains the hover player
 */
export function getLineHeightOfFirstLine(element: HTMLElement): number {
  const childNodes: NodeListOf<ChildNode> = element.childNodes;

  for (let i = 0; i < childNodes.length; i++) {
      const node: ChildNode = childNodes[i];
      if (node.nodeType === Node.TEXT_NODE && node.nodeValue && node.nodeValue.trim() !== '') {
          const style=window.getComputedStyle(element);
          const lineHeight = parseFloat(style.lineHeight);
          return lineHeight;
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
          const elementNode = node as HTMLElement;
          const textContent: string = elementNode.textContent?.trim() || '';
          if (textContent !== '' && elementNode.innerHTML.trim() === textContent) {
              const style=window.getComputedStyle(elementNode);
              const lineHeight = parseFloat(style.lineHeight);
              return lineHeight
          }
      }
    }
  return 0;
}


export type HoveredElementInfo = {
  element: HTMLElement;
  top: number;
  left: number;
  heightOfFirstLine: number;
};

/**
 * **TBD:** Implement a React hook to be used to help to render hover player
 * Return the absolute coordinates on where to render the hover player
 * Returns null when there is no active hovered paragraph
 * Note: If using global event listeners, attach them window instead of document to ensure tests pass
 */


export function useHoveredParagraphCoordinate(
  parsedElements: HTMLElement[]
): HoveredElementInfo | null {
  const [hoveredElement, setHoveredElement] = useState<HoveredElementInfo | null>(null);

  useEffect(() => {
    function handleMouseMove(event:any) {
      const point = { x: event.pageX  , y: event.pageY };
      console.log(event.pageX,event.pageY);
      for (const element of parsedElements) {
        if (isPointInsideElement(point, element)) {
          const bounds = getElementBounds(element);
          const heightOfFirstLine = getLineHeightOfFirstLine(element);
          setHoveredElement({ element, top: bounds.top , left: bounds.left, heightOfFirstLine });
          return;
        }
      }

      setHoveredElement(null);
    }
    window.addEventListener('mousemove',handleMouseMove);

    return () => {
      window.removeEventListener('mousemove',handleMouseMove );
    };
  }, [parsedElements]);

  return hoveredElement;
}

