<div align="center">
  <a href="https://armantarhani.ir">
    <picture>
       <img alt="Arfa.js logo" src="/docs/assets/logo.png" height="160" />
    </picture>

  </a>
  <h1>Arfa.js</h1>

</div>

A modern **TSX-based framework** for building fast, component-driven web applications.

**see the documentation of [Arfa JS](https://wixarm.github.io/Arfa/)**

---

## 📖 Overview

Arfa.js is a lightweight framework that compiles **TSX** into optimized JavaScript, powered by **Vite** and the custom **Arfa runtime engine**.  
It offers a **React-like component model** and a **Next.js-style file-based router**, making it both familiar and easy to adopt.

Created by **Arman Tarhani**, Arfa.js aims to provide **simplicity, speed, and flexibility** out of the box.

---

## ✨ Features

- ⚡ **Blazing Fast** — Vite-powered dev server and builds
- 🎨 **TailwindCSS Ready** — Use Tailwind by default with zero setup
- 🧩 **TSX/JSX Support** — Write strongly-typed UI components
- ⚙️ **Custom Runtime** — Lightweight, optimized rendering engine
- 🧵 **Reactive Hooks** — Built with `arfa-reactives` for state and lifecycle
- 🚫 **Zero Config** — Sensible defaults with easy overrides
- 📘 **TypeScript Native** — First-class TypeScript support

---

## 🚀 Quick Start

```bash
npx create-arfa my-app
cd my-app
npm install
npm run dev
```

## Contact

For any inquiries, please contact: armantarhani1997@gmail.com

## 🔄 Reactivity with arfa-reactives

Arfa.js uses the arfa-reactives package to provide a familiar but lightweight hook system:

ref(initialValue) → Create reactive state ([getter, setter])

onMounted(fn) → Run logic when a component is mounted

onEffect(fn, deps) → Run side effects when dependencies change

Example Usage:

```bash
import { onMounted, onEffect, ref } from "arfa-reactives";

export default function CounterExample() {
  const [count, setCount] = ref(1);
  const [showMessage, setShowMessage] = ref(true);

  // Run once on mount
  onMounted(() => {
    console.log("Component mounted with initial count:", count());
  });

  // Effect runs when count changes
  onEffect(() => {
    console.log("Count changed:", count());
    return () => console.log("Cleaning up for count:", count());
  }, [count]);

  // Effect runs when showMessage changes
  onEffect(() => {
    console.log("Show message changed:", showMessage());
  }, [showMessage]);

  return (
    <div>
      <h2>Current count: {count()}</h2>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <button onClick={() => setShowMessage(v => !v)}>Toggle Message</button>

      {showMessage() && (
        <p>{count() % 2 === 0 ? "Count is even!" : "Count is odd!"}</p>
      )}
    </div>
  );
}

```

## 📁 File-based Routing

Arfa.js uses a file-system based router where routes are defined by files in the pages directory. very similar with next js!

```bash
pages/
  index.tsx        → /
  about.tsx        → /about
  contact.tsx      → /contact
```

Nested Routes:

```bash
pages/
  blog/
    index.tsx      → /blog
    [slug].tsx     → /blog/:slug
    latest.tsx     → /blog/latest
```

Dynamic Routes:

```bash
pages/
  users/
    [id].tsx       → /users/:id
  posts/
    [category]/
      [id].tsx    → /posts/:category/:id
```

Layout System: Create layouts by adding \_layout.tsx files:

```bash
pages/
  _layout.tsx      ← Applies to all routes
  about.tsx
  blog/
    _layout.tsx    ← Applies to /blog/*
    index.tsx
    [slug].tsx
```

## Protected Route

How it works (brief)

Router builds a list of layouts (from files named \_layout.tsx) mapped to directory paths (e.g. core/pages/admin/\_layout.tsx → "/admin").

When navigating, the router collects directory list for the destination (e.g. /admin/settings → ["/", "/admin", "/admin/settings"]) and calls each layout's protect in that order.

If any protect returns false (or resolves to false) the router redirects to that layout's protectRedirect (or /).

If all guards pass, the page is rendered wrapped in layouts and optional \_app.

```bash
export function protect(params?: any, pathname?: string): boolean | Promise<boolean> { ... }

// or as a property exported from default (both are supported by router)
export default function MyLayout(...) { ... }
export const protect = () => true;
export const protectRedirect = "/login";
```

Example:

```bash
export function protect() {
  return !!localStorage.getItem("token");
}

export const protectRedirect = "/login";

export default function AdminLayout({ children }: any) {
  return (
    <div class="admin-shell">
      <aside>Admin menu</aside>
      <main>{children}</main>
    </div>
  );
}

```

Async guard (e.g. validate token by calling an API):

```bash
//core/pages/dashboard/_layout.tsx
export async function protect() {
  const token = localStorage.getItem("token");
  if (!token) return false;
  // fake async check
  const ok = await fetch("/api/validate", { headers: { Authorization: `Bearer ${token}` } })
    .then(r => r.ok)
    .catch(() => false);
  return ok;
}

export const protectRedirect = "/login";

export default function DashboardLayout({ children }: any) {
  return <div class="dashboard">{children}</div>;
}

```

## 🧠 Context API

Arfa.js provides a Context API that allows you to share state across components without the need to pass props manually. It is reactive, and consumers re-render automatically when the provided value changes.

### createContext()

The `createContext` function is used to create a new context with a default value.

```bash
import { createContext } from "arfa-reactives";

// Create context with a default value
const CountCtx = createContext<number>(0);
```

## withContext()

The withContext function allows you to provide a value to the context. This value can be a plain value or a reactive reference getter (ref).

```bash
import { createContext } from "arfa-reactives";

// Create context with a default value
const CountCtx = createContext<number>(0);
import { withContext, ref } from "arfa-reactives";

const [countRef, setCount] = ref(0);

return withContext(CountCtx, countRef, () => {
  // Children here can call useContext(CountCtx)
  return <Child />;
});
```

## useContext()

The **useContext** hook allows you to consume the nearest context value, whether it's a static value or a reactive reference.

```bash

import { useContext } from "arfa-reactives";

function Child() {
  const count = useContext(CountCtx); // number
  return <div>Count: {count}</div>;
}

```

## Persisted Counter Example

This example demonstrates how to use context with persistence (e.g., in localStorage). The counter is persisted across page refreshes.

```bash

import { ref, createContext, useContext, withContext, onMounted, onEffect } from "arfa-reactives";

// Full storage key = keyPrefix + key
const COUNT_KEY = "arfa:docs:count";
const CountCtx = createContext<number>(0);

// Optional: seed from localStorage for first paint (SSR-safe)
function readInitialCount(defaultValue = 0): number {
  try {
    if (typeof window === "undefined") return defaultValue;
    const raw = window.localStorage.getItem(COUNT_KEY);
    if (!raw) return defaultValue;
    const env = JSON.parse(raw) as { v?: number; d: unknown };
    const n = Number((env as any).d);
    return Number.isFinite(n) ? n : defaultValue;
  } catch {
    return defaultValue;
  }
}

export default function ContextCounterPage() {
  // Persisted store
  const [countRef, setCount] = ref<number>(readInitialCount(0), {
    persist: {
      key: "docs:count",   // stored under "arfa:docs:count"
      version: 1,
      keyPrefix: "arfa:",
      // sync: true // default: cross-tab updates
    },
  });

  onMounted(() => {
    console.log("Mounted. Hydrated count =", countRef());
  });

  onEffect(() => {
    console.log("Count changed ->", countRef());
  }, [countRef]);

  const inc = () => setCount(c => (c ?? 0) + 1);
  const dec = () => setCount(c => (c ?? 0) - 1);
  const reset = () => setCount(0);

  // Provide the getter so consumers auto-update
  return withContext(CountCtx, countRef, () => {
    const count = useContext(CountCtx);
    return (
      <div class="p-3 border rounded">
        <h3>Counter via Context (Persisted)</h3>
        <p>Current: {count}</p>
        <div class="flex gap-2">
          <button class="btn" onClick={inc}>+1</button>
          <button class="btn" onClick={dec}>-1</button>
          <button class="btn" onClick={reset}>Reset</button>
        </div>
        <p class="code" style="margin-top:12px">
          Persisted under localStorage key: <code>arfa:docs:count</code>
        </p>
      </div>
    );
  });
}


```
