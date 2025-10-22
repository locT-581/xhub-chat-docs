---
sidebar_position: 1
title: Packages Overview
description: Overview of all XHub Chat packages and their purposes
tags: [packages, overview, architecture]
---

# 📦 Packages Overview

XHub Chat is organized as a monorepo with multiple packages, each serving a specific purpose.

## Package Architecture

```
@xhub-chat/
├── core        → Framework-agnostic core functionality
└── react       → React bindings and hooks
```

## Available Packages

### 🎯 @xhub-chat/core

**The foundation of XHub Chat**

Framework-agnostic TypeScript SDK providing core chat functionality including:

- ✅ WebSocket/HTTP communication
- ✅ Event-driven architecture
- ✅ IndexedDB storage with offline support
- ✅ Sliding sync protocol
- ✅ Room and user management
- ✅ Message handling and threading
- ✅ File attachments and media

**Best for:**
- Building chat on any JavaScript platform
- Server-side applications (Node.js)
- Custom framework integrations
- Vanilla JavaScript projects

**Installation:**
```bash
pnpm add @xhub-chat/core
```

**Learn more:** [Core Package Documentation](/docs/packages/core/)

---

### ⚛️ @xhub-chat/react

**React bindings for XHub Chat**

React-specific hooks and components built on top of `@xhub-chat/core`:

- ✅ Ready-to-use React hooks
- ✅ Provider/Context architecture
- ✅ Automatic re-renders on updates
- ✅ TypeScript support
- ✅ SSR-compatible
- ✅ Next.js optimized

**Best for:**
- React applications (CRA, Vite, Next.js)
- React Native apps
- Quick prototyping
- Modern React projects

**Installation:**
```bash
pnpm add @xhub-chat/core @xhub-chat/react
```

**Learn more:** [React Package Documentation](/docs/packages/react/)

---

## Package Comparison

| Feature | @xhub-chat/core | @xhub-chat/react |
|---------|----------------|------------------|
| Framework | Agnostic | React only |
| Bundle Size | ~50KB | ~15KB (+ core) |
| TypeScript | ✅ Full | ✅ Full |
| Hooks | ❌ | ✅ |
| React Context | ❌ | ✅ |
| SSR Support | ✅ | ✅ |
| Node.js | ✅ | ⚠️ (needs DOM) |

## Which Package Should I Use?

### Use `@xhub-chat/core` if you:
- 🎯 Want framework-agnostic solution
- 🔧 Need maximum control and customization
- 🖥️ Building server-side application
- 🌐 Using Vue, Angular, Svelte, or vanilla JS
- 📦 Want smallest possible bundle

### Use `@xhub-chat/react` if you:
- ⚛️ Building a React application
- 🚀 Want quick integration with hooks
- 🎨 Need React-specific patterns
- 🔄 Want automatic re-renders
- 💻 Using Next.js or React Native

:::tip
You can use both packages together! `@xhub-chat/react` is built on top of `@xhub-chat/core`, so you can access core APIs when needed.
:::

## Installation Guide

### For React Projects

```bash
# Install both packages
pnpm add @xhub-chat/core @xhub-chat/react

# Or with npm
npm install @xhub-chat/core @xhub-chat/react

# Or with yarn
yarn add @xhub-chat/core @xhub-chat/react
```

### For Other Frameworks

```bash
# Install core only
pnpm add @xhub-chat/core
```

## Version Compatibility

| @xhub-chat/core | @xhub-chat/react | React Version | TypeScript |
|----------------|------------------|---------------|------------|
| 1.x.x | 1.x.x | ≥18.0.0 | ≥5.0.0 |

:::warning
Always use matching major versions of `@xhub-chat/core` and `@xhub-chat/react` to ensure compatibility.
:::

## Migration Between Packages

### From Core to React

If you started with `@xhub-chat/core` and want to use React bindings:

```tsx
// Before (Core only)
import { createClient } from '@xhub-chat/core';
const client = createClient({ ... });

// After (With React)
import { XHubChatProvider } from '@xhub-chat/react';

function App() {
  return (
    <XHubChatProvider config={{ ... }}>
      <YourApp />
    </XHubChatProvider>
  );
}
```

### From React to Core

If you need direct core access:

```tsx
import { useXHubChat } from '@xhub-chat/react';

function Component() {
  const { client } = useXHubChat();
  
  // Now you have access to core client
  client.sendTextMessage(roomId, 'Hello!');
}
```

## Next Steps

<div className="row" style={{ marginTop: '2rem' }}>
  <div className="col col--6">
    <div className="card" style={{ padding: '1.5rem' }}>
      <h3>🎯 Core Package</h3>
      <p>Deep dive into core functionality and APIs</p>
      <a href="/docs/packages/core/" className="button button--primary">
        Explore Core →
      </a>
    </div>
  </div>
  
  <div className="col col--6">
    <div className="card" style={{ padding: '1.5rem' }}>
      <h3>⚛️ React Package</h3>
      <p>Learn React hooks and integration patterns</p>
      <a href="/docs/packages/react/" className="button button--primary">
        Explore React →
      </a>
    </div>
  </div>
</div>

## Related Resources

- [Getting Started Guide](/docs/getting-started/installation)
- [Core Concepts](/docs/core-concepts/overview)
- [API Reference](/docs/api/reference)
- [Examples](/docs/examples/minimal-example)
