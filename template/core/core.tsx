import { h as _h, Fragment as _Fragment } from "./runtime/jsx";
import { render } from "./runtime/renderer";
import { initRouter } from "./runtime/router";

globalThis.h = _h;
globalThis.Fragment = _Fragment;

const rootEl = document.getElementById("root")!;

const pages = (import.meta as any).glob("./pages/**/*.tsx", { eager: true });

initRouter(pages, (Page) => {
  rootEl.innerHTML = "";
  render(<Page />, rootEl);
});
