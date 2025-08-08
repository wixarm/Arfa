// VNode interface (simplified)
export interface VNode {
  type: string | Function;
  props: Record<string, any> & { children?: any };
}

// Define type of allowed vnode values
type Child = VNode | string | number | boolean | null | Child[];

// Render a VNode tree into a container DOM node
export function render(vnode: Child, container: HTMLElement) {
  const dom = createDomElement(vnode);
  container.appendChild(dom);
}

// Type guard to check if a value is a VNode
function isVNode(node: any): node is VNode {
  return typeof node === "object" && node !== null && "type" in node;
}

// Create a real DOM node (or DocumentFragment) from a VNode or array
function createDomElement(vnode: Child): Node {
  // Handle null, undefined, false, true
  if (vnode == null || vnode === false || vnode === true) {
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

  // Handle VNodes
  if (isVNode(vnode)) {
    // Component
    if (typeof vnode.type === "function") {
      const componentResult = vnode.type(vnode.props || {});
      return createDomElement(componentResult);
    }

    // HTML Element
    const domElement = document.createElement(vnode.type as string);

    // Apply props (attributes & event listeners)
    const { children, ...props } = vnode.props || {};
    Object.keys(props).forEach((name) => {
      const value = props[name];
      if (name.startsWith("on") && typeof value === "function") {
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

  // Fallback (should never reach here)
  return document.createTextNode("");
}

// Render children (could be array, single, or other types)
function renderChildren(children: any, parent: HTMLElement) {
  if (Array.isArray(children)) {
    children.forEach((child) => parent.appendChild(createDomElement(child)));
  } else if (children != null && children !== false && children !== true) {
    parent.appendChild(createDomElement(children));
  }
}
