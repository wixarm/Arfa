// core/runtime/router.ts
type PageComponent = (props?: any) => any;

type RouteRecord = {
  filePath: string;
  routePath: string; // e.g. "/blog/[id]" -> "/blog/[id]"
  isDynamic: boolean;
  paramNames: string[]; // e.g. ["id"] or ["slug"]
  regex?: RegExp; // only for dynamic routes
  component: PageComponent;
};

let routes: RouteRecord[] = [];

const NotFound: PageComponent = () => ({
  type: "div",
  props: { children: "404 - Not Found" },
});

/**
 * Convert a route file path (like "./pages/blog/[id].tsx") to:
 *  - a normalized routePath "/blog/[id]"
 *  - a regex to match pathnames
 *  - param names array ["id"]
 */
function filePathToRouteInfo(
  filePath: string,
  component: PageComponent
): RouteRecord {
  // normalize filePath -> routePath
  let routePath =
    filePath
      .replace(/^\.\/pages/, "") // remove ./pages
      .replace(/\.(t|j)sx?$/, "") // remove ext
      .replace(/\/index$/, "") || "/"; // /index => ''

  // detect param segments [id] and catch-all [...slug]
  const paramNames: string[] = [];
  let isDynamic = false;

  // build regex from routePath
  // escape non param parts, replace [name] -> ([^/]+), [...name] -> (.+)
  const segments = routePath.split("/").filter(Boolean); // omit leading empty for "/"
  if (segments.length === 0) {
    // root "/"
    return {
      filePath,
      routePath: "/",
      isDynamic: false,
      paramNames: [],
      component,
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
      // escape regex special chars
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
  };
}

export function initRouter(
  routeModules: Record<string, any>,
  renderFn: (comp: PageComponent) => void
) {
  const records: RouteRecord[] = Object.entries(routeModules).map(
    ([filePath, mod]) => filePathToRouteInfo(filePath, mod.default)
  );

  records.sort((a, b) => {
    if (a.isDynamic === b.isDynamic) {
      const aSegs = a.routePath.split("/").filter(Boolean).length;
      const bSegs = b.routePath.split("/").filter(Boolean).length;
      return bSegs - aSegs;
    }
    return a.isDynamic ? 1 : -1;
  });

  routes = records;

  navigateTo(location.href, renderFn, false);

  window.addEventListener("popstate", () => {
    navigateTo(location.href, renderFn, false);
  });

  document.addEventListener("click", (e) => {
    const el =
      (e.target as HTMLElement).closest &&
      (e.target as HTMLElement).closest("a");
    if (!el) return;
    const href = (el as HTMLAnchorElement).getAttribute("href");
    if (!href) return;
    // only intercept root-relative internal links
    if (href.startsWith("/") && !href.startsWith("//")) {
      e.preventDefault();
      navigateTo(href, renderFn);
    }
  });
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
    renderFn(NotFound);
    return;
  }

  const Page = record.component;
  const Wrapper: PageComponent = (props?: any) => {
    const merged = { ...(props || {}), params };
    return Page(merged);
  };

  renderFn(Wrapper);
}
