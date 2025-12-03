---
sidebar_position: 3
title: Reels Features
description: TikTok-style short-form video features
tags: [reels, video, short-form, tiktok]
---

# 🎬 Reels Features

Reels are TikTok-style short-form videos that allow users to watch, interact with, and share vertical video content.

## ✨ Overview

XHub Chat's Reels system provides:

- **📱 Infinite Scroll Feed** - Endless scrolling to watch videos continuously
- **🎥 Video Player** - Play videos with full controls
- **💬 Comments** - Real-time comments and interactions
- **❤️ Likes & Reactions** - Like and react to reels
- **🔄 Pagination** - Auto-load more reels
- **⚡ Performance** - Optimized memory with EphemeralStore

## 📚 Key Features

### Feed & Discovery

- **[Reels Feed](./reels-feed)** - Display reels list with infinite scroll
- **[My Reels](./my-reels)** - Manage and display user's own reels
- **[Load More](./reels-feed#pagination)** - Auto-load more reels on scroll
- **[Refresh Feed](./reels-feed#refresh)** - Refresh reels list

### Player & Interaction

- **[Reel Player](./reel-player)** - Play video with Room instance
- **[Comments](./reel-comments)** - View and send comments
- **[Likes & Views](./reel-player#interactions)** - Like and view counts

## 🎯 Use Cases

### Social Media Feed
```tsx
// TikTok-style vertical feed
<ReelsFeed autoPlay infiniteScroll />
```

### User Profile
```tsx
// Grid view của reels người dùng
<UserReelsGrid userId="@user:server.com" />
```

### Discover Page
```tsx
// Khám phá reels mới
<DiscoverReels category="trending" />
```

## 🏗️ Architecture

### EphemeralStore
Reels are stored in memory (not persisted to IndexedDB) for optimal performance:

```typescript
// Reels only exist in current session
const reelsStore = client.getReelsStore();
const rooms = await reelsStore.getSavedRooms();
```

### Virtual Rooms
Each reel is a virtual room with category `'reel'`:

```typescript
// Auto-generated room ID
const roomId = `reel_${reelId}`;
```

## 🎨 Supported Platforms

- **@xhub-chat/core** - Core APIs and client methods
- **@xhub-chat/react** - React hooks optimized for Reels

## 📖 Getting Started

Get started with [Reels Feed →](./reels-feed)
