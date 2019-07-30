import { createElement, ComponentType } from 'react';
import { render, hydrate } from 'react-dom';

import { isReactPrerendered } from './isReactPrerendered';

/**
 * Renders the component into DOM with specified properties.
 * @param component The component.
 * @param props The properties.
 */
export const renderComponent = <Props>(component: ComponentType<Props>, props: Props) =>
  new Promise((resolve) => {
    const element = createElement(component, props);
    const node = document.getElementById('root');

    if (isReactPrerendered(node)) {
      hydrate(element, node, resolve);
      return;
    }

    render(element, node, resolve);
  });
