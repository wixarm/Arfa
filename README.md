# Arfa.js

A modern TSX-based framework for building web applications

## Overview

Arfa.js is a lightweight framework that compiles TSX to optimized JavaScript, powered by Vite and the Arfa runtime engine. Created by Arman Tarhani, it provides a component-based architecture with reactive updates.

## Contact

For any inquiries, please contact: armantarhani1997@gmail.com

## ✨ Features

- **Blazing Fast** - Vite-powered development and builds
- **TSX/JSX Support** - Write components with TypeScript syntax
- **Arfa Runtime** - Custom optimized rendering engine
- **Zero Config** - Sensible defaults with easy customization
- **TypeScript Native** - First-class TypeScript support

## 🚀 Quick Start

```bash
npx create-arfa my-app
cd my-app
npm install
npm run dev
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
