/**
 * Returns true if the React DOM has been prerendered.
 * @param rootNode Mounting point of the application.
 */
export const isComponentPrerendered = (rootNode: HTMLElement) => {
  const isElementNode = (node: ChildNode) => node.nodeType === Node.ELEMENT_NODE;
  return Array.prototype.some.call(rootNode.childNodes, isElementNode);
};
