import { VNode } from "./runtime/renderer";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }

  function h(
    type: string | Function,
    props: Record<string, any> | null,
    ...children: any[]
  ): VNode;

  function Fragment(props: { children?: any }): any;
}
