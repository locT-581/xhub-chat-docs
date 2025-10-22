---
sidebar_position: 3
title: Sync Protocol
description: Understanding XHub Chat sync protocol
tags: [core, sync, sliding-sync]
---

# 🔄 Sync Protocol Guide

Learn about XHub Chat's sync protocol and how it works.

## Sliding Sync

XHub Chat uses sliding sync for efficient data synchronization:

```typescript
const client = createClient({
  // ... config
  sync: {
    enabled: true,
    slidingSync: true,
  },
});
```

## How It Works

1. Initial sync loads cached data
2. Incremental syncs receive only new updates
3. Automatic reconnection on network issues

[Back to Core Package](/docs/packages/core/)
