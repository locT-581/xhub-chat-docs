---
sidebar_position: 3
title: Next.js Integration
description: Using XHub Chat with Next.js App Router
tags: [react, nextjs, ssr]
---

# ⚡ Next.js Integration Guide

Complete guide to using XHub Chat with Next.js.

## App Router Setup

```tsx
// app/providers.tsx
'use client';

import { XHubChatProvider } from '@xhub-chat/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <XHubChatProvider
      baseUrl={process.env.NEXT_PUBLIC_CHAT_URL!}
      accessToken={/* get from auth */}
      userId={/* get from auth */}
    >
      {children}
    </XHubChatProvider>
  );
}
```

```tsx
// app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

## Chat Page

```tsx
// app/chat/page.tsx
'use client';

import { useRooms, useTimeline } from '@xhub-chat/react';

export default function ChatPage() {
  const rooms = useRooms();
  const { events } = useTimeline(rooms[0]?.roomId);
  
  return (
    <div>
      <h1>Chat</h1>
      {events.map(event => (
        <div key={event.getId()}>
          {event.getContent().body}
        </div>
      ))}
    </div>
  );
}
```

## Server Components

Use client components for hooks:

```tsx
// app/chat/layout.tsx (Server Component)
export default function ChatLayout({ children }) {
  return <div className="chat-layout">{children}</div>;
}
```

```tsx
// app/chat/messages.tsx (Client Component)
'use client';

export function Messages() {
  const { events } = useTimeline(roomId);
  return <div>{/* render messages */}</div>;
}
```

[Back to React Package](/docs/packages/react/)
