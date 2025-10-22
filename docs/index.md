---
sidebar_position: 1
slug: /
title: Welcome to XHub Chat
description: Modern, type-safe chat SDK for building real-time messaging experiences. Learn how to integrate and use XHub Chat effectively in your applications.
tags: [getting-started, overview, introduction, chat, sdk, react, typescript]
keywords: [xhub chat, chat sdk, real-time messaging, react hooks, typescript, websocket, offline-first]
---

# 🚀 Welcome to XHub Chat

Modern, type-safe chat SDK for building real-time messaging experiences in React and beyond.

---

## ✨ Why XHub Chat?

<div className="hero" style={{
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: '2rem',
  borderRadius: '1rem',
  color: 'white',
  marginBottom: '2rem',
}}>

XHub Chat provides a **comprehensive suite of tools** for building real-time chat applications with ease. Whether you're building a small team chat or a large-scale messaging platform, XHub Chat has you covered.

</div>

### Core Strengths

<div className="row" style={{ marginBottom: '2rem' }}>
  <div className="col col--4">
    <div className="badge-card" style={{
      padding: '1.5rem',
      borderRadius: '0.75rem',
      background: 'var(--ifm-background-surface-color)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      height: '100%',
    }}>
      <span style={{ fontSize: '2rem' }}>🎯</span>
      <h3>Type-Safe</h3>
      <p>Built with TypeScript for full type safety and IntelliSense support throughout your development workflow.</p>
    </div>
  </div>
  
  <div className="col col--4">
    <div className="badge-card" style={{
      padding: '1.5rem',
      borderRadius: '0.75rem',
      background: 'var(--ifm-background-surface-color)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      height: '100%',
    }}>
      <span style={{ fontSize: '2rem' }}>⚡</span>
      <h3>Real-Time</h3>
      <p>WebSocket-based communication with sliding sync, automatic reconnection, and optimistic UI updates.</p>
    </div>
  </div>
  
  <div className="col col--4">
    <div className="badge-card" style={{
      padding: '1.5rem',
      borderRadius: '0.75rem',
      background: 'var(--ifm-background-surface-color)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      height: '100%',
    }}>
      <span style={{ fontSize: '2rem' }}>💾</span>
      <h3>Offline-First</h3>
      <p>Built-in IndexedDB caching ensures your app works seamlessly offline and syncs when back online.</p>
    </div>
  </div>
</div>

### Developer Experience

- **🔌 Framework Agnostic Core** - Use with React, Vue, Angular, or vanilla JavaScript
- **🪝 React Hooks** - Powerful, easy-to-use hooks for seamless React integration
- **📦 Modular Architecture** - Use only what you need, fully tree-shakeable exports
- **🧪 Well Tested** - Comprehensive test coverage with Jest and TypeScript
- **📚 Extensive Documentation** - Detailed guides, API references, and real-world examples
- **🎨 Modern Tooling** - Built with latest TypeScript, bundled with tsup

---

## 🎨 Core Features

<div className="row" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
  <div className="col col--6">
    <h3>📱 For All Developers</h3>
    <ul>
      <li>🎭 Event-driven architecture</li>
      <li>🔌 Extensible plugin system</li>
      <li>💾 IndexedDB caching for offline support</li>
      <li>💬 Message reactions and threading</li>
      <li>🏠 Room management and presence</li>
      <li>📎 File attachments and media</li>
      <li>🔔 Push notifications support</li>
      <li>🔐 End-to-end encryption ready</li>
    </ul>
  </div>
  
  <div className="col col--6">
    <h3>⚛️ For React Developers</h3>
    <ul>
      <li><code>useXHubChat</code> - Core chat client access</li>
      <li><code>useRooms</code> - Room list management</li>
      <li><code>useTimeline</code> - Message timeline with pagination</li>
      <li><code>useReactions</code> - Message reactions handling</li>
      <li><code>useThread</code> - Thread management</li>
      <li><code>useTyping</code> - Typing indicators</li>
      <li><code>usePresence</code> - User presence tracking</li>
      <li>And many more custom hooks...</li>
    </ul>
  </div>
</div>

---

## 📦 Packages

<div className="row">
  <div className="col col--6">
    <div className="feature card-stack" style={{
      padding: '2rem',
      borderRadius: '1rem',
      background: 'var(--ifm-background-surface-color)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      marginBottom: '1rem',
    }}>
      <h3>
        <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>📦</span>
        @xhub-chat/core
      </h3>
      <p>Framework-agnostic core chat functionality with WebSocket support, event handling, and storage.</p>
      <p><strong>Perfect for:</strong> Building chat on any platform or framework</p>
      <a href="/docs/platforms/core" className="button button--primary">
        Learn more →
      </a>
    </div>
  </div>
  <div className="col col--6">
    <div className="feature">
      <h3>@xhub-chat/react</h3>
      <p>React hooks and components for seamless integration with the core SDK.</p>
      <a href="/docs/platforms/react">Learn more →</a>
    </div>
  </div>
</div>

## 🚀 Quick Start

Get started in less than 5 minutes:

```bash
# Install packages
pnpm add @xhub-chat/core @xhub-chat/react

# Or with npm
npm install @xhub-chat/core @xhub-chat/react

# Or with yarn
yarn add @xhub-chat/core @xhub-chat/react
```

```tsx
import { XHubChatProvider, useXHubChat, useRooms } from '@xhub-chat/react';

function App() {
  return (
    <XHubChatProvider config={{ baseUrl: 'https://api.example.com' }}>
      <ChatApp />
    </XHubChatProvider>
  );
}

function ChatApp() {
  const client = useXHubChat();
  const { rooms, loading } = useRooms();
  
  return (
    <div>
      <h1>My Rooms</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        rooms.map(room => (
          <div key={room.roomId}>{room.name}</div>
        ))
      )}
    </div>
  );
}
```

## 📖 What's Next?

<div className="row">
  <div className="col col--4">
    <div className="feature">
      <h3>📚 Getting Started</h3>
      <p>Learn the basics and get your first app running</p>
      <a href="/docs/getting-started/installation">Installation →</a>
    </div>
  </div>
  <div className="col col--4">
    <div className="feature">
      <h3>💡 Core Concepts</h3>
      <p>Understand the architecture and design principles</p>
      <a href="/docs/core-concepts/overview">Overview →</a>
    </div>
  </div>
  <div className="col col--4">
    <div className="feature">
      <h3>📘 API Reference</h3>
      <p>Detailed API documentation for all exports</p>
      <a href="/docs/api/reference">API Docs →</a>
    </div>
  </div>
</div>

## 🤝 Community & Support

- **GitHub**: [XHub-Platform/xhub-chat](https://github.com/XHub-Platform/xhub-chat)
- **Issues**: [Report bugs](https://github.com/XHub-Platform/xhub-chat/issues)
- **NPM**: [@xhub-chat/core](https://www.npmjs.com/package/@xhub-chat/core)

## 📄 License

XHub Chat is proprietary software © 2025 TekNix Corporation. All rights reserved.
