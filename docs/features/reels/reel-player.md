---
sidebar_position: 2
title: Reel Player
description: Play video and interact with a specific reel
tags: [reels, player, video, room]
---

# 🎥 Reel Player

Play video and interact with a specific reel through Room instance.

## Overview

The `useReelRoom` hook allows you to get a Room instance for a reel to:
- Play video with full controls
- Real-time interactions (likes, views)
- Integrate with comments and reactions
- Access Room events

:::warning Important
`useReelRoom` **only retrieves from cache**, doesn't fetch from server.
Must load reels feed first using `useReelsFeed`!
:::

## Core Package (@xhub-chat/core)

### Get Reel Room

```typescript
import { createClient } from '@xhub-chat/core';

const client = createClient({
  baseUrl: 'https://your-server.com',
  accessToken: 'your-access-token',
  userId: '@user:server.com',
});

await client.startClient();

// 1. Load reels first
await client.paginateReels({ limit: 10 });

// 2. Get reel room from cache
const reelsStore = client.getReelsStore();
const roomId = 'reel_123'; // Format: reel_{reelId}
const room = reelsStore.getRoom(roomId);

if (room && room.isReelRoom()) {
  const reelData = room.getReelData();
  const videoUrl = reelData.media?.[0]?.url;
  console.log('Reel:', videoUrl);
}
```

### Access Reel Data

```typescript
const room = reelsStore.getRoom('reel_123');

if (room) {
  // Get reel data
  const reel = room.getReelData();
  
  console.log({
    videoUrl: reel.media?.[0]?.url,
    thumbnail: reel.thumbnail?.url,
    title: reel.title,
    creator: reel.owner?.first_name + ' ' + reel.owner?.last_name,
    likes: reel.likes,
    views: reel.views,
  });
}
```

### Listen to Room Events

```typescript
import { RoomEvent } from '@xhub-chat/core';

const room = reelsStore.getRoom('reel_123');

if (room) {
  // Listen for new likes
  room.on(RoomEvent.Timeline, (event) => {
    if (event.getType() === 'm.reaction') {
      console.log('New reaction:', event.getContent());
    }
  });
  
  // Listen for room updates
  room.on(RoomEvent.Name, () => {
    console.log('Room name changed');
  });
}
```

## React Package (@xhub-chat/react)

### Basic Player

```tsx
import { useReelRoom } from '@xhub-chat/react';

function ReelPlayer({ reelId }: { reelId: string }) {
  const { room, loading, error, isReelRoom } = useReelRoom(reelId);

  if (loading) return <div>Loading reel...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!room || !isReelRoom) return <div>Reel not found</div>;

  const reel = room.getReelData();
  const videoUrl = reel.media?.[0]?.url;
  const posterUrl = reel.thumbnail?.url;

  return (
    <div className="reel-player">
      <video
        src={videoUrl}
        poster={posterUrl}
        controls
        autoPlay
        loop
      />
      <div className="reel-info">
        <h3>{reel.title}</h3>
        <p>{reel.description}</p>
      </div>
    </div>
  );
}
```

### Player with Stats

```tsx
import { useReelRoom } from '@xhub-chat/react';

function ReelPlayerWithStats({ reelId }: { reelId: string }) {
  const { room, isReelRoom } = useReelRoom(reelId);

  if (!room || !isReelRoom) return null;

  const reel = room.getReelData();
  const videoUrl = reel.media?.[0]?.url;
  const creatorName = reel.owner 
    ? `${reel.owner.first_name} ${reel.owner.last_name}` 
    : 'Unknown';
  const creatorAvatar = reel.owner?.avatar;

  return (
    <div className="reel-player">
      <video src={videoUrl} controls />
      
      <div className="stats">
        <div className="stat">
          <span className="icon">❤️</span>
          <span className="count">{reel.likes.toLocaleString()}</span>
        </div>
        <div className="stat">
          <span className="icon">👁️</span>
          <span className="count">{reel.views.toLocaleString()}</span>
        </div>
        <div className="stat">
          <span className="icon">💬</span>
          <span className="count">{reel.total_comments.toLocaleString()}</span>
        </div>
      </div>
      
      <div className="creator">
        <img src={creatorAvatar} alt={creatorName} />
        <span>{creatorName}</span>
      </div>
    </div>
  );
}
```

### Full-Featured Player

```tsx
import { useReelRoom, useReelComments } from '@xhub-chat/react';
import { useState } from 'react';

function FullReelPlayer({ reelId }: { reelId: string }) {
  const { room, isReelRoom } = useReelRoom(reelId);
  const { comments } = useReelComments(reelId);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  if (!room || !isReelRoom) return null;

  const reel = room.getReelData();
  const videoUrl = reel.media?.[0]?.url;
  const posterUrl = reel.thumbnail?.url;
  const creatorName = reel.owner 
    ? `${reel.owner.first_name} ${reel.owner.last_name}` 
    : 'Unknown';
  const creatorAvatar = reel.owner?.avatar;

  return (
    <div className="full-reel-player">
      {/* Video Player */}
      <div className="video-container">
        <video
          src={videoUrl}
          poster={posterUrl}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        
        {/* Video Controls */}
        <div className="controls">
          <button onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <button onClick={() => setIsMuted(!isMuted)}>
            {isMuted ? '🔇' : '🔊'}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="sidebar">
        {/* Creator Info */}
        <div className="creator">
          <img src={creatorAvatar} alt={creatorName} />
          <div>
            <h4>{creatorName}</h4>
            <button>
              Follow
            </button>
          </div>
        </div>

        {/* Reel Info */}
        <div className="info">
          <h3>{reel.title}</h3>
          <p>{reel.description}</p>
        </div>

        {/* Interaction Buttons */}
        <div className="actions">
          <button className={reel.liked ? 'liked' : ''}>
            ❤️ {reel.likes.toLocaleString()}
          </button>
          <button>
            💬 {reel.total_comments.toLocaleString()}
          </button>
          <button>
            📤 Share
          </button>
        </div>

        {/* Comments Section */}
        <div className="comments">
          <h4>Comments ({comments.length})</h4>
          {comments.map(comment => (
            <div key={comment.id} className="comment">
              <img src={comment.sender.avatarUrl} />
              <div>
                <strong>{comment.sender.name}</strong>
                <p>{comment.content.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### Modal Player

```tsx
import { useReelRoom } from '@xhub-chat/react';
import { useEffect, useRef } from 'react';

function ReelPlayerModal({ 
  reelId, 
  onClose 
}: { 
  reelId: string; 
  onClose: () => void;
}) {
  const { room, isReelRoom } = useReelRoom(reelId);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-play when modal opens
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, []);

  // Cleanup: pause video when modal closes
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, []);

  if (!room || !isReelRoom) return null;

  const reel = room.getReelData();
  const videoUrl = reel.media?.[0]?.url;
  const posterUrl = reel.thumbnail?.url;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        
        <video
          ref={videoRef}
          src={videoUrl}
          poster={posterUrl}
          controls
          autoPlay
          loop
          className="modal-video"
        />
        
        <div className="modal-info">
          <h3>{reel.title}</h3>
          <p>{reel.description}</p>
        </div>
      </div>
    </div>
  );
}
```

### Common Pattern: Feed → Player

Combine feed and player for the best UX:

```tsx
import { useReelsFeed, useReelRoom } from '@xhub-chat/react';
import { useState } from 'react';

function ReelsPage() {
  const { reels, loadMore, hasMore } = useReelsFeed({ limit: 10 });
  const [selectedReelId, setSelectedReelId] = useState<string | null>(null);

  return (
    <div className="reels-page">
      {/* Feed View */}
      <div className="feed-grid">
        {reels.map(reel => (
          <div
            key={reel.id}
            className="reel-thumbnail"
            onClick={() => setSelectedReelId(reel.id)}
          >
            <img src={reel.thumbnail?.url} alt={reel.title} />
            <div className="stats">
              <span>❤️ {reel.likes}</span>
              <span>👁️ {reel.views}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <button onClick={loadMore}>Load More</button>
      )}

      {/* Player Modal */}
      {selectedReelId && (
        <ReelPlayerModal
          reelId={selectedReelId}
          onClose={() => setSelectedReelId(null)}
        />
      )}
    </div>
  );
}
```

## API Reference

### Hook: `useReelRoom`

```typescript
function useReelRoom(reelId: string): IUseReelRoom;

interface IUseReelRoom {
  /** Virtual Room instance for this reel (null if not loaded yet) */
  room: Room | null;
  /** Whether the room is being loaded */
  loading: boolean;
  /** Error if room creation failed */
  error: Error | null;
  /** Whether this is a valid reel room */
  isReelRoom: boolean;
}
```

### Room Methods

```typescript
// Check if room is a reel
room.isReelRoom(): boolean

// Get reel data
room.getReelData(): ReelData

// Room ID format
roomId = `reel_${reelId}`
```

## Best Practices

### 1. Always Load Feed First

```tsx
// ✅ Good: Load feed, then access room
function GoodExample() {
  const { reels } = useReelsFeed();
  const { room } = useReelRoom(reels[0]?.id);
  
  return <div>{/* ... */}</div>;
}

// ❌ Bad: Use room without loading feed
function BadExample() {
  const { room } = useReelRoom('reel_123'); // Will error!
  return <div>{/* ... */}</div>;
}
```

### 2. Check Room Validity

```tsx
function ReelPlayer({ reelId }: { reelId: string }) {
  const { room, isReelRoom } = useReelRoom(reelId);

  // ✅ Good: Check both room and isReelRoom
  if (!room || !isReelRoom) {
    return <div>Reel not available</div>;
  }

  const videoUrl = room.getReelData().media?.[0]?.url;
  return <video src={videoUrl} />;
}
```

### 3. Handle Loading & Error States

```tsx
function ReelPlayer({ reelId }: { reelId: string }) {
  const { room, loading, error, isReelRoom } = useReelRoom(reelId);

  if (loading) return <Skeleton />;
  if (error) return <ErrorView error={error} />;
  if (!room || !isReelRoom) return <NotFound />;

  return <VideoPlayer room={room} />;
}
```

### 4. Cleanup Video on Unmount

```tsx
function ReelPlayer({ reelId }: { reelId: string }) {
  const { room } = useReelRoom(reelId);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    return () => {
      // Pause video when component unmounts
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    };
  }, []);

  if (!room) return null;

  const videoUrl = room.getReelData().media?.[0]?.url;
  return <video ref={videoRef} src={videoUrl} />;
}
```

## Related

- [Reels Feed](./reels-feed) - Load reels list
- [Reel Comments](./reel-comments) - Comments for reels

[Back to Reels Features](./index)
