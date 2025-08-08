import { h } from "./runtime/jsx";
import { render } from "./runtime/renderer";
import Root from "./Root";

const tree = <Root />;
render(tree, document.getElementById("root")!);
