import { h as _h, Fragment as _Fragment } from "arfa-runtime";
import { render, cleanupAll } from "arfa-runtime";
import { initRouter } from "arfa-runtime";

(globalThis as any).h = _h;
(globalThis as any).Fragment = _Fragment;

const rootEl = document.getElementById("root")!;

const pages = (import.meta as any).glob("./pages/**/*.tsx", { eager: true });

initRouter(pages, (Page: any) => {
  cleanupAll();
  rootEl.innerHTML = "";
  render(<Page />, rootEl);
});
