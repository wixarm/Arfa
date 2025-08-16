<div align="center">
  <a href="https://armantarhani.ir">
    <picture>
       <img alt="Arfa.js logo" src="https://iili.io/FbTuVl2.md.png" height="160" />
    </picture>

  </a>
  <h1>Arfa.js</h1>

</div>

A modern **TSX-based framework** for building fast, component-driven web applications.

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
