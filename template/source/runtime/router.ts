type PageComponent = (props?: any) => any;

type RouteRecord = {
  filePath: string;
  routePath: string;
  isDynamic: boolean;
  paramNames: string[];
  regex?: RegExp;
  component: PageComponent;
  dirPath: string;
};

let routes: RouteRecord[] = [];
let layoutsByDir: Record<string, PageComponent> = {};
let appWrapper: PageComponent | null = null;
let notFoundPage: PageComponent | null = null;

const NotFound: PageComponent = () => ({
  type: "div",
  props: { children: "404 - Not Found" },
});

function filePathToRouteInfo(
  filePath: string,
  component: PageComponent
): RouteRecord {
  let routePath =
    filePath
      .replace(/^\.\/pages/, "")
      .replace(/\.(t|j)sx?$/, "")
      .replace(/\/index$/, "") || "/";

  const paramNames: string[] = [];
  let isDynamic = false;

  const segments = routePath.split("/").filter(Boolean);
  if (segments.length === 0) {
    return {
      filePath,
      routePath: "/",
      isDynamic: false,
      paramNames: [],
      component,
      dirPath: "/",
    };
  }

  const regexParts = segments.map((seg) => {
    const match = seg.match(/^\[(\.\.\.)?(.+?)\]$/);
    if (match) {
      isDynamic = true;
      const isCatchAll = !!match[1];
      const name = match[2];
      paramNames.push(name);
      return isCatchAll ? "(.+)" : "([^/]+)";
    } else {
      return seg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
  });

  const regex = new RegExp("^/" + regexParts.join("/") + "/?$");

  return {
    filePath,
    routePath: routePath === "" ? "/" : routePath,
    isDynamic,
    paramNames,
    regex,
    component,
    dirPath: "/" + routePath.split("/").filter(Boolean).slice(0, -1).join("/"),
  };
}

function buildRoutesAndLayouts(routeModules: Record<string, any>) {
  layoutsByDir = {};
  appWrapper = null;
  notFoundPage = null;

  const records: RouteRecord[] = [];

  for (const [filePath, mod] of Object.entries(routeModules)) {
    const normalized = filePath
      .replace(/^\.\/pages/, "")
      .replace(/\.(t|j)sx?$/, "");

    if (normalized === "/404") {
      notFoundPage = mod.default;
      continue;
    }

    if (normalized.endsWith("/_layout")) {
      const dir = normalized.replace(/\/_layout$/, "") || "/";
      layoutsByDir[dir === "" ? "/" : dir] = mod.default;
      continue;
    }

    if (normalized === "/_app") {
      appWrapper = mod.default;
      continue;
    }

    const rec = filePathToRouteInfo(filePath, mod.default);
    const dirPath =
      filePath
        .replace(/^\.\/pages/, "")
        .replace(/\.(t|j)sx?$/, "")
        .replace(/\/[^/]+$/, "") || "/";
    rec.dirPath = dirPath === "" ? "/" : dirPath;
    records.push(rec);
  }

  records.sort((a, b) => {
    if (a.isDynamic === b.isDynamic) {
      const aSegs = a.routePath.split("/").filter(Boolean).length;
      const bSegs = b.routePath.split("/").filter(Boolean).length;
      return bSegs - aSegs;
    }
    return a.isDynamic ? 1 : -1;
  });

  routes = records;
}

function matchRoute(pathname: string): {
  record?: RouteRecord;
  params: Record<string, any>;
} {
  for (const r of routes) {
    if (!r.isDynamic && r.routePath === pathname) {
      return { record: r, params: {} };
    }
  }

  for (const r of routes) {
    if (r.isDynamic && r.regex) {
      const m = pathname.match(r.regex);
      if (m) {
        const params: Record<string, any> = {};
        for (let i = 0; i < r.paramNames.length; i++) {
          const raw = m[i + 1] ?? "";
          const name = r.paramNames[i];
          if (raw.includes("/")) {
            params[name] = raw.split("/").map(decodeURIComponent);
          } else {
            params[name] = decodeURIComponent(raw);
          }
        }
        return { record: r, params };
      }
    }
  }

  return { record: undefined, params: {} };
}

function getLayoutsForPath(pathname: string): PageComponent[] {
  const parts = pathname.split("/").filter(Boolean);
  const dirs: string[] = ["/"];
  let acc = "";
  for (const p of parts) {
    acc += "/" + p;
    dirs.push(acc);
  }

  const matchedLayouts: PageComponent[] = [];
  for (const d of dirs) {
    if (layoutsByDir[d]) matchedLayouts.push(layoutsByDir[d]);
  }
  return matchedLayouts;
}

export function initRouter(
  routeModules: Record<string, any>,
  renderFn: (comp: PageComponent) => void
) {
  buildRoutesAndLayouts(routeModules);
  navigateTo(location.href, renderFn, false);
  window.addEventListener("popstate", () =>
    navigateTo(location.href, renderFn, false)
  );
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const el = target && target.closest ? target.closest("a") : null;
    if (!el) return;
    const href = (el as HTMLAnchorElement).getAttribute("href");
    if (!href) return;
    if (href.startsWith("/") && !href.startsWith("//")) {
      e.preventDefault();
      navigateTo(href, renderFn);
    }
  });
}

export function navigateTo(
  pathOrHref: string,
  renderFn: (comp: PageComponent) => void,
  push = true
) {
  const url = new URL(pathOrHref, location.origin);
  const pathname = url.pathname;

  const { record, params } = matchRoute(pathname);

  if (push) history.pushState({}, "", pathname + url.search + url.hash);

  if (!record) {
    const PageComp = notFoundPage ?? NotFound;
    const pageVNode = PageComp({ params: {} });
    const layouts = getLayoutsForPath("/404");
    let composed = pageVNode;
    for (let i = layouts.length - 1; i >= 0; i--) {
      const Layout = layouts[i];
      composed = Layout({ children: composed, params: {} });
    }
    if (appWrapper) {
      const finalVNode = appWrapper({
        Component: () => composed,
        pageProps: { params: {} },
      });
      const Wrapper: PageComponent = () => finalVNode;
      renderFn(Wrapper);
    } else {
      const Wrapper: PageComponent = () => composed;
      renderFn(Wrapper);
    }
    return;
  }

  const Page = record.component;
  const pageVNode = Page({ params });
  const layouts = getLayoutsForPath(pathname);
  let composed = pageVNode;
  for (let i = layouts.length - 1; i >= 0; i--) {
    const Layout = layouts[i];
    composed = Layout({ children: composed, params });
  }

  if (appWrapper) {
    const finalVNode = appWrapper({
      Component: () => composed,
      pageProps: { params },
    });
    const Wrapper: PageComponent = () => finalVNode;
    renderFn(Wrapper);
  } else {
    const Wrapper: PageComponent = () => composed;
    renderFn(Wrapper);
  }
}
