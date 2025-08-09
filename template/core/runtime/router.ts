type RouteMap = Record<string, (props?: any) => any>;
let routes: RouteMap = {};

const NotFound = () => ({
  type: "div",
  props: { children: "404 - Not Found" },
});

export function initRouter(
  routeModules: Record<string, any>,
  renderFn: (comp: any) => void
) {
  routes = Object.fromEntries(
    Object.entries(routeModules).map(([filePath, mod]) => {
      const url =
        filePath
          .replace(/^\.\/pages/, "")
          .replace(/\.(t|j)sx?$/, "")
          .replace(/\/index$/, "") || "/";
      return [url, mod.default];
    })
  );

  navigateTo(location.pathname, renderFn, false);

  window.addEventListener("popstate", () =>
    navigateTo(location.pathname, renderFn, false)
  );

  document.addEventListener("click", (e) => {
    const target =
      (e.target as HTMLElement).closest &&
      (e.target as HTMLElement).closest("a");
    if (!target) return;
    const href = (target as HTMLAnchorElement).getAttribute("href");
    if (!href) return;
    if (href.startsWith("/") && !href.startsWith("//")) {
      e.preventDefault();
      navigateTo(href, renderFn);
    }
  });
}

export function navigateTo(
  path: string,
  renderFn: (comp: any) => void,
  push = true
) {
  const Page = routes[path] ?? NotFound;
  if (push) history.pushState({}, "", path);
  renderFn(Page);
}
