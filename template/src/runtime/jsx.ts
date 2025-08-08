// src/runtime/jsx.ts

export function h(
  type: string | Function,
  props: Record<string, any> | null,
  ...children: any[]
) {
  // default props object
  props = props ? { ...props } : {};
  // flatten & drop null/undefined
  const flat = children.flat().filter((c) => c != null);
  // if single child, don’t wrap in array
  props.children = flat.length === 1 ? flat[0] : flat;
  return { type, props };
}

export function Fragment(props: { children: any }) {
  return props.children;
}
