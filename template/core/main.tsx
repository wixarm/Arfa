import { h } from "./runtime/jsx";
import App from "./App";
import { render } from "./runtime/renderer";

const tree = <App />;
render(tree, document.getElementById("root")!);
