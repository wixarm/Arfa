import type { PageComponent, PageModule, RouteModules } from "arfa-types";
import {
  h as _h,
  Fragment as _Fragment,
  render,
  cleanupAll,
  initRouter,
} from "arfa-runtime";

(globalThis as any).h = _h;
(globalThis as any).Fragment = _Fragment;

const rootEl = document.getElementById("root")!;

const pages = import.meta.glob<PageModule>("./pages/**/*.tsx", { eager: true });

initRouter(pages as RouteModules, (Page: PageComponent) => {
  cleanupAll();
  rootEl.innerHTML = "";
  render(<Page />, rootEl);
});
