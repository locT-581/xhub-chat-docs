---
sidebar_position: 2
title: Event Handling
description: Guide to handling events in XHub Chat
tags: [core, events, listeners]
---

# 🎭 Event Handling Guide

Learn how to listen and handle events in XHub Chat.

## Event Types

```typescript
client.on('sync', (state) => { })
client.on('Room', (room) => { })
client.on('Room.timeline', (event, room) => { })
client.on('RoomState.events', (event, state) => { })
```

## Example

```typescript
import { createClient, ClientEvent } from '@xhub-chat/core';

const client = createClient({ /* ... */ });

client.on(ClientEvent.RoomTimeline, (event, room) => {
  console.log('New message:', event.getContent().body);
});
```

[Back to Core Package](/docs/packages/core/)
