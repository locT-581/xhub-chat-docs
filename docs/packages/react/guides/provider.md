---
sidebar_position: 1
title: Provider Setup
description: Advanced provider patterns and best practices
tags: [react, provider, patterns]
---

# 🎯 Advanced Provider Patterns

Learn advanced patterns for using XHubChatProvider.

## Dynamic Configuration

```tsx
import { useState, useEffect } from 'react';
import { XHubChatProvider } from '@xhub-chat/react';

function App() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    // Load config from API
    fetch('/api/chat-config')
      .then(res => res.json())
      .then(setConfig);
  }, []);

  if (!config) return <div>Loading...</div>;

  return (
    <XHubChatProvider {...config}>
      <ChatApp />
    </XHubChatProvider>
  );
}
```

## Multiple Instances

```tsx
<XHubChatProvider baseUrl="https://server1.com" {...config1}>
  <ChatView1 />
</XHubChatProvider>

<XHubChatProvider baseUrl="https://server2.com" {...config2}>
  <ChatView2 />
</XHubChatProvider>
```

[Back to React Package](/docs/packages/react/)
