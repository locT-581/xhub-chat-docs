---
sidebar_position: 3
title: Configuration & Requirements
description: Learn about XHub Chat configuration options and requirements
---

# ⚙️ Configuration & Requirements

Learn about system requirements and how to configure XHub Chat for your application.

## System Requirements

### Runtime Environment

- **Node.js**: Version 18.0 or higher
- **Browser Support**:
  - Chrome 90+
  - Firefox 88+
  - Safari 14+
  - Edge 90+
- **React** (for @xhub-chat/react): Version 18.0 or 19.0

### Development Requirements

- **TypeScript**: 4.9+ (recommended)
- **Package Manager**: pnpm, npm, or yarn
- **Build Tool**: Vite, Webpack, or similar modern bundler

## Core Configuration

### Basic Configuration

The `XHubChatProvider` accepts a `config` object with the following options:

```tsx
import { XHubChatProvider } from '@xhub-chat/react';

<XHubChatProvider
  config={{
    baseUrl: 'https://api.your-server.com',
    accessToken: 'your-access-token',
  }}
>
  <App />
</XHubChatProvider>
```

### Configuration Options

#### Required Options

| Option | Type | Description |
|--------|------|-------------|
| `baseUrl` | `string` | The base URL of your XHub Chat server |
| `accessToken` | `string` | Authentication token for API requests |

#### Optional Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `userId` | `string` | - | User ID for the current user |
| `deviceId` | `string` | Auto-generated | Unique device identifier |
| `timelineSupport` | `boolean` | `true` | Enable timeline functionality |
| `cryptoCallbacks` | `ICryptoCallbacks` | - | Encryption callbacks |
| `store` | `IStore` | IndexedDB | Custom storage backend |
| `scheduler` | `IScheduler` | Default | Custom task scheduler |
| `logger` | `ILogger` | Console | Custom logger implementation |

### Advanced Configuration

```tsx
import { XHubChatProvider, IndexedDBStore } from '@xhub-chat/react';

const customStore = new IndexedDBStore({
  dbName: 'my-chat-app',
  workerScript: '/workers/indexeddb.worker.js',
});

<XHubChatProvider
  config={{
    baseUrl: process.env.REACT_APP_CHAT_API,
    accessToken: getUserToken(),
    userId: getCurrentUserId(),
    deviceId: getDeviceId(),
    store: customStore,
    timelineSupport: true,
    logger: {
      trace: console.trace,
      debug: console.debug,
      info: console.info,
      warn: console.warn,
      error: console.error,
    },
  }}
>
  <App />
</XHubChatProvider>
```

## Environment Variables

### Recommended Setup

Create a `.env` file in your project root:

```bash title=".env"
# API Configuration
REACT_APP_CHAT_BASE_URL=https://api.your-server.com
REACT_APP_CHAT_WS_URL=wss://ws.your-server.com

# Feature Flags
REACT_APP_ENABLE_ENCRYPTION=true
REACT_APP_ENABLE_OFFLINE=true
REACT_APP_DEBUG_MODE=false
```

### Using Environment Variables

```tsx
const config = {
  baseUrl: process.env.REACT_APP_CHAT_BASE_URL!,
  accessToken: getAccessToken(),
  // ... other options
};
```

## Storage Configuration

### IndexedDB (Default)

XHub Chat uses IndexedDB by default for offline storage:

```tsx
import { IndexedDBStore } from '@xhub-chat/core';

const store = new IndexedDBStore({
  dbName: 'xhub-chat',
  workerScript: '/workers/indexeddb.worker.js',
});
```

### Custom Storage

Implement the `IStore` interface for custom storage:

```tsx
import { IStore } from '@xhub-chat/core';

class CustomStore implements IStore {
  async getItem(key: string): Promise<any> {
    // Your implementation
  }

  async setItem(key: string, value: any): Promise<void> {
    // Your implementation
  }

  // ... other methods
}
```

## WebSocket Configuration

### Connection Options

```tsx
const config = {
  baseUrl: 'https://api.example.com',
  accessToken: token,
  websocket: {
    url: 'wss://ws.example.com',
    reconnect: true,
    reconnectDelay: 1000,
    maxReconnectAttempts: 5,
  },
};
```

### WebSocket Events

Listen to connection events:

```tsx
import { useXHubChat } from '@xhub-chat/react';

function ConnectionStatus() {
  const client = useXHubChat();

  useEffect(() => {
    const handleConnect = () => console.log('Connected');
    const handleDisconnect = () => console.log('Disconnected');

    client.on('connected', handleConnect);
    client.on('disconnected', handleDisconnect);

    return () => {
      client.off('connected', handleConnect);
      client.off('disconnected', handleDisconnect);
    };
  }, [client]);

  return <div>Connection Status Component</div>;
}
```

## Logging Configuration

### Log Levels

Configure logging for development and production:

```tsx
import log from 'loglevel';

if (process.env.NODE_ENV === 'development') {
  log.setLevel('debug');
} else {
  log.setLevel('warn');
}

const config = {
  baseUrl: 'https://api.example.com',
  accessToken: token,
  logger: log,
};
```

### Custom Logger

```tsx
const customLogger = {
  trace: (...args: any[]) => console.trace('[TRACE]', ...args),
  debug: (...args: any[]) => console.debug('[DEBUG]', ...args),
  info: (...args: any[]) => console.info('[INFO]', ...args),
  warn: (...args: any[]) => console.warn('[WARN]', ...args),
  error: (...args: any[]) => console.error('[ERROR]', ...args),
};
```

## Performance Configuration

### Optimization Options

```tsx
const config = {
  baseUrl: 'https://api.example.com',
  accessToken: token,
  // Performance optimizations
  lazyLoadMembers: true,
  pendingEventOrdering: 'chronological',
  threadSupport: true,
  // Reduce memory usage
  timelineWindowSize: 50,
  // Enable virtual scrolling for large rooms
  virtualScrolling: true,
};
```

## Security Configuration

### Encryption

Enable end-to-end encryption:

```tsx
import { CryptoCallbacks } from '@xhub-chat/core';

const cryptoCallbacks = new CryptoCallbacks({
  getCrossSigningKey: async () => {
    // Return cross-signing key
  },
  saveCrossSigningKeys: async (keys) => {
    // Save keys securely
  },
});

const config = {
  baseUrl: 'https://api.example.com',
  accessToken: token,
  cryptoCallbacks,
};
```

### Access Token Management

```tsx
function App() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Refresh token periodically
    const interval = setInterval(async () => {
      const newToken = await refreshAccessToken();
      setToken(newToken);
    }, 15 * 60 * 1000); // Refresh every 15 minutes

    return () => clearInterval(interval);
  }, []);

  if (!token) return <div>Loading...</div>;

  return (
    <XHubChatProvider config={{ baseUrl: API_URL, accessToken: token }}>
      <ChatApp />
    </XHubChatProvider>
  );
}
```

## Production Checklist

Before deploying to production, ensure:

- ✅ Environment variables are properly configured
- ✅ Access tokens are securely managed
- ✅ Logging is set to appropriate level
- ✅ WebSocket reconnection is enabled
- ✅ Error boundaries are implemented
- ✅ Storage is properly configured
- ✅ HTTPS/WSS are used for all connections

## Troubleshooting

### Common Configuration Issues

#### CORS Errors

Ensure your server allows requests from your domain:

```js
// Server configuration
app.use(cors({
  origin: ['https://your-app.com'],
  credentials: true,
}));
```

#### WebSocket Connection Failed

Check firewall and proxy settings. Ensure WSS (not WS) is used in production.

#### Storage Quota Exceeded

Configure storage limits or implement cleanup:

```tsx
const store = new IndexedDBStore({
  dbName: 'xhub-chat',
  maxSize: 100 * 1024 * 1024, // 100MB
});
```

## Next Steps

- [📚 Core Concepts](/docs/core-concepts/overview) - Understand the architecture
- [🔌 API Reference](/docs/api/reference) - Explore available APIs
- [💡 Guides](/docs/guides/using-with-react) - Learn best practices
