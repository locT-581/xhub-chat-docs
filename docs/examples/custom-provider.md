---
sidebar_position: 2
title: Custom Provider
description: Build a custom provider with authentication and state management
---

# 🔐 Custom Provider Example

Learn how to create a custom provider with authentication, error handling, and global state management.

## Overview

This example shows:
- Custom authentication flow
- Persistent storage
- Global state management
- Error boundary integration
- Loading states and reconnection

## Complete Implementation

### 1. Authentication Provider

```tsx title="providers/AuthProvider.tsx"
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  accessToken: string | null;
  login: (userId: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Restore session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('xhub_token');
    const storedUserId = localStorage.getItem('xhub_userId');

    if (storedToken && storedUserId) {
      setAccessToken(storedToken);
      setUserId(storedUserId);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      // Call your authentication API
      const response = await fetch('https://your-api.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      
      // Store credentials
      localStorage.setItem('xhub_token', data.access_token);
      localStorage.setItem('xhub_userId', data.user_id);

      setAccessToken(data.access_token);
      setUserId(data.user_id);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('xhub_token');
    localStorage.removeItem('xhub_userId');
    setAccessToken(null);
    setUserId(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userId,
        accessToken,
        login,
        logout,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

### 2. Custom Chat Provider

```tsx title="providers/CustomChatProvider.tsx"
import React, { useEffect, useState } from 'react';
import { XHubChatProvider, XHubChatConfig } from '@xhub-chat/react';
import { useAuth } from './AuthProvider';

interface CustomChatProviderProps {
  children: React.ReactNode;
  baseUrl: string;
}

export function CustomChatProvider({
  children,
  baseUrl,
}: CustomChatProviderProps) {
  const { isAuthenticated, userId, accessToken } = useAuth();
  const [syncState, setSyncState] = useState<string>('STOPPED');
  const [error, setError] = useState<Error | null>(null);

  if (!isAuthenticated || !userId || !accessToken) {
    return (
      <div className="auth-required">
        <p>Please log in to access chat</p>
      </div>
    );
  }

  const config: XHubChatConfig = {
    baseUrl,
    accessToken,
    userId,
    store: {
      type: 'indexeddb',
      dbName: 'xhub-chat-db',
    },
    sync: {
      enabled: true,
      slidingSync: true,
    },
    // Custom event handlers
    onSyncStateChange: (state) => {
      setSyncState(state);
    },
    onError: (err) => {
      console.error('XHub Chat Error:', err);
      setError(err);
    },
  };

  return (
    <>
      {/* Sync Status Bar */}
      <div className={`sync-status sync-${syncState.toLowerCase()}`}>
        {syncState === 'SYNCING' && '🔄 Syncing...'}
        {syncState === 'PREPARED' && '✅ Connected'}
        {syncState === 'ERROR' && '❌ Connection Error'}
        {syncState === 'STOPPED' && '⏸️ Offline'}
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-banner">
          <span>⚠️ {error.message}</span>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      <XHubChatProvider config={config}>
        {children}
      </XHubChatProvider>
    </>
  );
}
```

### 3. App Root with All Providers

```tsx title="App.tsx"
import React from 'react';
import { AuthProvider, useAuth } from './providers/AuthProvider';
import { CustomChatProvider } from './providers/CustomChatProvider';
import { ChatApp } from './components/ChatApp';
import { LoginForm } from './components/LoginForm';

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <CustomChatProvider baseUrl="https://your-server.com">
      <ChatApp />
    </CustomChatProvider>
  );
}

export default App;
```

### 4. Login Component

```tsx title="components/LoginForm.tsx"
import React, { useState } from 'react';
import { useAuth } from '../providers/AuthProvider';

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
    } catch (err) {
      // Error is handled in AuthProvider
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Welcome to XHub Chat</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="@user:example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="submit-button"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

### 5. Global State Management

```tsx title="store/chatStore.ts"
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChatState {
  selectedRoomId: string | null;
  setSelectedRoom: (roomId: string | null) => void;
  
  unreadCounts: Record<string, number>;
  setUnreadCount: (roomId: string, count: number) => void;
  
  drafts: Record<string, string>;
  saveDraft: (roomId: string, text: string) => void;
  clearDraft: (roomId: string) => void;
  
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    soundEnabled: boolean;
  };
  updatePreferences: (prefs: Partial<ChatState['preferences']>) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      selectedRoomId: null,
      setSelectedRoom: (roomId) => set({ selectedRoomId: roomId }),

      unreadCounts: {},
      setUnreadCount: (roomId, count) =>
        set((state) => ({
          unreadCounts: { ...state.unreadCounts, [roomId]: count },
        })),

      drafts: {},
      saveDraft: (roomId, text) =>
        set((state) => ({
          drafts: { ...state.drafts, [roomId]: text },
        })),
      clearDraft: (roomId) =>
        set((state) => {
          const { [roomId]: _, ...rest } = state.drafts;
          return { drafts: rest };
        }),

      preferences: {
        theme: 'light',
        notifications: true,
        soundEnabled: true,
      },
      updatePreferences: (prefs) =>
        set((state) => ({
          preferences: { ...state.preferences, ...prefs },
        })),
    }),
    {
      name: 'xhub-chat-storage',
      partialize: (state) => ({
        preferences: state.preferences,
        drafts: state.drafts,
      }),
    }
  )
);
```

### 6. Using the Store

```tsx title="components/ChatApp.tsx"
import React from 'react';
import { useChatStore } from '../store/chatStore';
import { RoomList } from './RoomList';
import { ChatRoom } from './ChatRoom';
import { SettingsPanel } from './SettingsPanel';

export function ChatApp() {
  const { selectedRoomId, setSelectedRoom } = useChatStore();

  return (
    <div className="chat-app">
      <aside className="sidebar">
        <RoomList onRoomSelect={setSelectedRoom} />
      </aside>
      
      <main className="main-content">
        {selectedRoomId ? (
          <ChatRoom roomId={selectedRoomId} />
        ) : (
          <div className="empty-state">
            <p>Select a room to start chatting</p>
          </div>
        )}
      </main>
      
      <SettingsPanel />
    </div>
  );
}
```

## Advanced Features

### Error Boundary

```tsx title="components/ErrorBoundary.tsx"
import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    // Send to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Connection Monitor

```tsx title="hooks/useConnectionMonitor.ts"
import { useEffect, useState } from 'react';
import { useXHubChat } from '@xhub-chat/react';

export function useConnectionMonitor() {
  const client = useXHubChat();
  const [isOnline, setIsOnline] = useState(true);
  const [syncState, setSyncState] = useState('PREPARED');

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      client.startSync();
    };

    const handleOffline = () => {
      setIsOnline(false);
      client.stopSync();
    };

    const handleSync = (state: string) => {
      setSyncState(state);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    client.on('sync', handleSync);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      client.off('sync', handleSync);
    };
  }, [client]);

  return { isOnline, syncState, isConnected: isOnline && syncState === 'PREPARED' };
}
```

## Complete Styles

```css title="styles.css"
.sync-status {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 0.5rem;
  text-align: center;
  font-size: 0.875rem;
  z-index: 1000;
  transition: all 0.3s;
}

.sync-prepared {
  background: #10b981;
  color: white;
}

.sync-syncing {
  background: #3b82f6;
  color: white;
}

.sync-error {
  background: #ef4444;
  color: white;
}

.sync-stopped {
  background: #6b7280;
  color: white;
}

.error-banner {
  position: fixed;
  top: 2.5rem;
  left: 50%;
  transform: translateX(-50%);
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 999;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-card h1 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #1f2937;
  text-align: center;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.error-message {
  padding: 0.75rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.submit-button {
  width: 100%;
  padding: 0.75rem;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-button:hover:not(:disabled) {
  background: #4f46e5;
}

.submit-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}
```

## Key Features

✅ **Authentication Flow** - Complete login/logout with persistence
✅ **Error Handling** - Error boundaries and user feedback
✅ **State Management** - Zustand with persistence
✅ **Connection Monitoring** - Online/offline detection
✅ **Loading States** - Smooth transitions
✅ **Type Safety** - Full TypeScript support

## Next Steps

- [🎨 Full App Example](/docs/examples/full-app) - Complete production app
- [📚 Using with React](/docs/guides/using-with-react) - React patterns
- [🔧 Configuration](/docs/getting-started/requirements) - More config options