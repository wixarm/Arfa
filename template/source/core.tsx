import { h as _h, Fragment as _Fragment } from "./runtime/jsx";
import { render, cleanupAll } from "./runtime/renderer";
import { initRouter } from "./runtime/router";

globalThis.h = _h;
globalThis.Fragment = _Fragment;

const rootEl = document.getElementById("root")!;

const pages = (import.meta as any).glob("./pages/**/*.tsx", { eager: true });

initRouter(pages, (Page) => {
  cleanupAll();
  rootEl.innerHTML = "";
  render(<Page />, rootEl);
});
