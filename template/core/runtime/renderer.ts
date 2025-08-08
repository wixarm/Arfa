export interface VNode {
  type: string | Function;
  props: Record<string, any> & { children?: any };
}

type Child = VNode | string | number | boolean | null | Child[];

export function render(vnode: Child | any, container: HTMLElement) {
  const dom = createDomElement(vnode);
  container.appendChild(dom);
}

function isVNode(node: any): node is VNode {
  return typeof node === "object" && node !== null && "type" in node;
}

function createDomElement(vnode: Child): Node {
  if (vnode == null || vnode === false || vnode === true) {
    return document.createTextNode("");
  }

  if (Array.isArray(vnode)) {
    const fragment = document.createDocumentFragment();
    vnode.forEach((child) => fragment.appendChild(createDomElement(child)));
    return fragment;
  }

  if (typeof vnode === "string" || typeof vnode === "number") {
    return document.createTextNode(String(vnode));
  }

  if (isVNode(vnode)) {
    if (typeof vnode.type === "function") {
      const componentResult = vnode.type(vnode.props || {});
      return createDomElement(componentResult);
    }

    const domElement = document.createElement(vnode.type as string);

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

    renderChildren(children, domElement);
    return domElement;
  }

  return document.createTextNode("");
}

function renderChildren(children: any, parent: HTMLElement) {
  if (Array.isArray(children)) {
    children.forEach((child) => parent.appendChild(createDomElement(child)));
  } else if (children != null && children !== false && children !== true) {
    parent.appendChild(createDomElement(children));
  }
}
