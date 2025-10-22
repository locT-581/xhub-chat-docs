---
sidebar_position: 1
title: Storage System
description: Guide to XHub Chat storage system
tags: [core, storage, indexeddb]
---

# 💾 Storage System Guide

Learn how XHub Chat stores and manages data.

## Overview

XHub Chat provides a flexible storage system with multiple backends:

- **IndexedDB** - Persistent browser storage (recommended)
- **Memory** - In-memory storage (Node.js, testing)

## Using IndexedDB

```typescript
import { createClient } from '@xhub-chat/core';

const client = createClient({
  baseUrl: 'https://server.com',
  accessToken: 'token',
  userId: '@user:server.com',
  store: {
    type: 'indexeddb',
    dbName: 'my-chat-app',
    workerApi: true, // Use Web Worker
  },
});
```

## Using Memory Store

```typescript
const client = createClient({
  // ... config
  store: {
    type: 'memory',
  },
});
```

[Back to Core Package](/docs/packages/core/)
