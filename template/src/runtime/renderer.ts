import { h, Fragment } from "./jsx";

// VNode interface (simplified)
export interface VNode {
  type: string | Function;
  props: Record<string, any> & { children?: any };
}

// Render a VNode tree into a container DOM node
export function render(
  vnode: VNode | string | number | null | Array<any>,
  container: HTMLElement
) {
  const dom = createDomElement(vnode);
  container.appendChild(dom);
}

// Create a real DOM node (or DocumentFragment) from a VNode or array
function createDomElement(
  vnode: VNode | string | number | null | Array<any>
): Node {
  // Handle null, false, undefined
  if (vnode == null || vnode === false) {
    return document.createTextNode("");
  }

  // Handle arrays of VNodes (Fragments)
  if (Array.isArray(vnode)) {
    const fragment = document.createDocumentFragment();
    vnode.forEach((child) => fragment.appendChild(createDomElement(child)));
    return fragment;
  }

  // Handle text nodes
  if (typeof vnode === "string" || typeof vnode === "number") {
    return document.createTextNode(String(vnode));
  }

  // If the VNode type is a function, it's a component
  if (typeof vnode.type === "function") {
    const componentResult = (vnode.type as Function)(vnode.props || {});
    return createDomElement(componentResult as any);
  }

  // Otherwise, it's an HTML element
  const domElement = document.createElement(vnode.type as string);

  // Apply props (attributes & event listeners)
  const { children, ...props } = vnode.props || {};
  Object.keys(props).forEach((name) => {
    const value = props[name];
    if (name.startsWith("on") && typeof value === "function") {
      // Event listener: onClick, onInput, etc.
      const event = name.slice(2).toLowerCase();
      domElement.addEventListener(event, value);
    } else if (name === "className") {
      domElement.setAttribute("class", value);
    } else {
      domElement.setAttribute(name, value);
    }
  });

  // Render children
  renderChildren(children, domElement);
  return domElement;
}

// Render children (could be array, single, or other types)
function renderChildren(children: any, parent: HTMLElement) {
  if (Array.isArray(children)) {
    children.forEach((child) => parent.appendChild(createDomElement(child)));
  } else if (children != null) {
    parent.appendChild(createDomElement(children));
  }
}
