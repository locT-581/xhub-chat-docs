---
sidebar_position: 3
title: XHubChatProvider
description: Setup and configuration for React provider
tags: [react, provider, setup]
---

# ⚙️ XHubChatProvider Reference

Complete guide to setting up and configuring the provider.

## Basic Setup

```tsx
import { XHubChatProvider } from '@xhub-chat/react';

function App() {
  return (
    <XHubChatProvider
      baseUrl="https://server.com"
      accessToken="token"
      userId="@user:server.com"
    >
      <YourApp />
    </XHubChatProvider>
  );
}
```

## Props

```typescript
interface XHubChatProviderProps {
  baseUrl: string;
  accessToken: string;
  userId: string;
  children: React.ReactNode;
  
  // Optional
  store?: IStoreOpts;
  sync?: ISyncOpts;
  timelineSupport?: boolean;
  cryptoEnabled?: boolean;
}
```

## Advanced Configuration

```tsx
<XHubChatProvider
  baseUrl="https://server.com"
  accessToken={token}
  userId={userId}
  store={{
    type: 'indexeddb',
    dbName: 'my-app',
    workerApi: true,
  }}
  sync={{
    enabled: true,
    slidingSync: true,
  }}
>
  <YourApp />
</XHubChatProvider>
```

[Back to React Package](/docs/packages/react/)
