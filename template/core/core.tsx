import { h as _h, Fragment as _Fragment } from "./runtime/jsx";
import { render } from "./runtime/renderer";
import Root from "./Root";

globalThis.h = _h;
globalThis.Fragment = _Fragment;

const tree = <Root />;
render(tree, document.getElementById("root")!);
