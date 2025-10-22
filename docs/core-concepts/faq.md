---
sidebar_position: 4
title: Frequently Asked Questions
description: Common questions and answers about XHub Chat
---

# ❓ Frequently Asked Questions

Find answers to common questions about XHub Chat.

## General Questions

### What is XHub Chat?

XHub Chat is a modern, type-safe SDK for building real-time chat applications. It consists of:
- **@xhub-chat/core**: Framework-agnostic core functionality
- **@xhub-chat/react**: React hooks and components

### What frameworks does XHub Chat support?

- **Core Package** (`@xhub-chat/core`): Framework-agnostic, works with vanilla JavaScript, Vue, Angular, Svelte, etc.
- **React Package** (`@xhub-chat/react`): Specifically for React 18+ applications

### Does XHub Chat work with TypeScript?

Yes! XHub Chat is written in TypeScript and provides full type definitions out of the box.

## Installation & Setup

### What are the minimum requirements?

- **Node.js**: 18.0 or higher
- **React**: 18.0 or 19.0 (for @xhub-chat/react)
- **TypeScript**: 4.9+ (recommended but optional)
- **Modern Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### How do I install XHub Chat?

```bash
# For React projects
pnpm add @xhub-chat/core @xhub-chat/react

# For other frameworks
pnpm add @xhub-chat/core
```

### Do I need both packages?

- **React apps**: Yes, install both `@xhub-chat/core` and `@xhub-chat/react`
- **Other frameworks**: Only `@xhub-chat/core` is needed

## Features & Functionality

### Does XHub Chat support end-to-end encryption?

Yes, XHub Chat supports end-to-end encryption through the crypto callbacks configuration.

### Can I send images and files?

Yes, XHub Chat supports file attachments using the client API.

### Does it support message reactions?

Yes! Use the `useReactions` hook in React:

```tsx
const { addReaction } = useReactions(roomId, eventId);
await addReaction('👍');
```

### Can I create threaded conversations?

Yes, use the `useThread` hook:

```tsx
const { events, sendTextMessage } = useThread(roomId, threadRootId);
```

### Does it work offline?

Yes! XHub Chat uses IndexedDB for offline storage. Messages are cached locally.

## React-Specific Questions

### Which React versions are supported?

React 18.0 and React 19.0 are officially supported.

### Can I use XHub Chat with Next.js?

Yes! Make sure to:
- Use Client Components (`'use client'`) for components using hooks
- Initialize the provider at the app level
- Handle SSR appropriately

## Troubleshooting

### Messages aren't appearing in real-time

**Possible causes:**
1. Client not started: Call `client.startClient()`
2. WebSocket not connected: Check connection state
3. Network issues: Check browser console

**Solution:**
```tsx
const client = useXHubChat();
useEffect(() => {
  client.startClient();
}, [client]);
```

### CORS errors when connecting

Ensure your server has proper CORS headers:

```js
app.use(cors({
  origin: 'https://your-app.com',
  credentials: true,
}));
```

## Still Have Questions?

- 📖 [Core Concepts](/docs/core-concepts/overview)
- 📚 [Guides](/docs/guides/using-with-react)
- 💻 [Examples](/docs/examples/minimal-example)
- 🐛 [Open an issue](https://github.com/XHub-Platform/xhub-chat/issues)
