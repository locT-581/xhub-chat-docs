---
sidebar_position: 6
title: View Tracking
description: Track user viewing behavior for AI analysis
tags: [reels, analytics, tracking, ai, behavior]
---

# 📊 View Tracking

Track user viewing behavior throughout video playback for AI analysis and recommendations.

## Overview

The View Tracking feature enables:
- **Continuous tracking** - Sends viewing data at regular intervals (e.g., every 3 seconds)
- **AI behavior analysis** - Server can analyze viewing patterns, skip behavior, watch time
- **Recommendation improvement** - AI learns user preferences from viewing data
- **Automatic start/stop** - Tracks when video plays, stops when paused

:::info How It Works
Unlike traditional "view count" that increments once, this API is called **continuously** during playback.
For a 15-second video with 3-second intervals, it sends **5 API calls** at different timestamps.
:::

## Core Package (@xhub-chat/core)

### Basic Usage

```typescript
import { createClient } from '@xhub-chat/core';

const client = createClient({
  baseUrl: 'https://your-server.com',
  accessToken: 'your-access-token',
  userId: '@user:server.com',
});

await client.startClient();

// Notify view at specific timestamp
await client.notifyReelView('reel123', 5.0); // At 5 seconds

// For continuous tracking, call periodically
const video = document.querySelector('video');
const trackingInterval = setInterval(() => {
  client.notifyReelView('reel123', video.currentTime);
}, 3000); // Every 3 seconds

// Cleanup when done
clearInterval(trackingInterval);
```

### API Request Format

```typescript
// POST /api/v1/reels/{id}/notify-views
// Body:
{
  "current_time": 5.0  // Current playback position in seconds
}
```

### Tracking Timeline Example

For a 15-second video with 3-second intervals:

```
Video Start → 
  0s  → POST { current_time: 0 }
  3s  → POST { current_time: 3 }
  6s  → POST { current_time: 6 }
  9s  → POST { current_time: 9 }
  12s → POST { current_time: 12 }
  15s → Video End
```

## React Package (@xhub-chat/react)

### Basic Usage with `useReelRoom`

```tsx
import { useReelRoom } from '@xhub-chat/react';
import { useRef } from 'react';

function ReelPlayer({ reelId }: { reelId: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const {
    room,
    viewsCount,
    isTracking,      // Whether tracking is active
    startTracking,   // Start auto-tracking
    stopTracking,    // Stop auto-tracking
    notifyView,      // Manual single notification
  } = useReelRoom(reelId, {
    enableViewTracking: true,
    trackingInterval: 3000, // 3 seconds
  });

  // Start tracking when video plays
  const handlePlay = () => {
    startTracking(() => videoRef.current?.currentTime ?? 0);
  };

  // Stop tracking when video pauses or ends
  const handlePause = () => {
    stopTracking();
  };

  if (!room) return <div>Loading...</div>;

  const reel = room.getReelData();

  return (
    <div className="reel-player">
      <video
        ref={videoRef}
        src={reel.media?.[0]?.url}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handlePause}
        autoPlay
        loop
      />
      
      <div className="stats">
        <span>👁 {viewsCount} views</span>
        {isTracking && <span className="tracking-indicator">🔴 Tracking</span>}
      </div>
    </div>
  );
}
```

### Full-Featured Player with Tracking

```tsx
import { useReelRoom } from '@xhub-chat/react';
import { useRef, useState } from 'react';

function FullReelPlayer({ reelId }: { reelId: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const {
    room,
    viewsCount,
    isTracking,
    startTracking,
    stopTracking,
    isLiked,
    likesCount,
    toggleLike,
  } = useReelRoom(reelId, {
    enableViewTracking: true,
    trackingInterval: 3000,
    enableLike: true,
  });

  const handlePlay = () => {
    startTracking(() => videoRef.current?.currentTime ?? 0);
  };

  const handlePause = () => {
    stopTracking();
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  if (!room) return <Spinner />;

  const reel = room.getReelData();
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="full-reel-player">
      {/* Video */}
      <video
        ref={videoRef}
        src={reel.media?.[0]?.url}
        poster={reel.thumbnail?.url}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handlePause}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        autoPlay
        muted
        playsInline
      />

      {/* Progress Bar */}
      <div className="progress-bar">
        <div className="fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Tracking Indicator */}
      {isTracking && (
        <div className="tracking-badge">
          <span className="pulse">●</span> AI Tracking Active
        </div>
      )}

      {/* Stats Sidebar */}
      <div className="sidebar">
        <button onClick={toggleLike} className={isLiked ? 'liked' : ''}>
          {isLiked ? '❤️' : '🤍'} {likesCount}
        </button>
        <div className="views">
          👁 {viewsCount}
        </div>
      </div>

      {/* Debug Info (dev only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug">
          <div>Time: {currentTime.toFixed(1)}s / {duration.toFixed(1)}s</div>
          <div>Tracking: {isTracking ? 'ON' : 'OFF'}</div>
        </div>
      )}
    </div>
  );
}
```

### Manual Tracking Control

For advanced use cases, you can manually control tracking:

```tsx
import { useReelRoom } from '@xhub-chat/react';

function ManualTrackingPlayer({ reelId }: { reelId: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const {
    room,
    notifyView,    // Single notification
    startTracking, // Start auto tracking
    stopTracking,  // Stop auto tracking
    isTracking,
  } = useReelRoom(reelId, {
    enableViewTracking: true,
    trackingInterval: 3000,
  });

  // Manual: Send single notification
  const handleManualTrack = () => {
    if (videoRef.current) {
      notifyView(videoRef.current.currentTime);
    }
  };

  // Auto: Toggle tracking
  const toggleTracking = () => {
    if (isTracking) {
      stopTracking();
    } else {
      startTracking(() => videoRef.current?.currentTime ?? 0);
    }
  };

  if (!room) return null;

  return (
    <div>
      <video ref={videoRef} src={room.getReelData().media?.[0]?.url} />
      
      <div className="controls">
        <button onClick={handleManualTrack}>
          📍 Track Now
        </button>
        <button onClick={toggleTracking}>
          {isTracking ? '⏹ Stop Auto' : '▶️ Start Auto'}
        </button>
      </div>
    </div>
  );
}
```

### Vertical Swipe Feed with Tracking

```tsx
import { useReelRoom, useReelsFeed } from '@xhub-chat/react';
import { useRef, useEffect, useState } from 'react';

function VerticalReelsFeed() {
  const { reels, loadMore, hasMore } = useReelsFeed({ limit: 5 });
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="vertical-feed">
      {reels.map((reel, index) => (
        <ReelSlide
          key={reel.id}
          reelId={reel.id}
          isActive={index === currentIndex}
        />
      ))}
    </div>
  );
}

function ReelSlide({ reelId, isActive }: { reelId: string; isActive: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const {
    room,
    startTracking,
    stopTracking,
    isTracking,
  } = useReelRoom(reelId, {
    enableViewTracking: true,
    trackingInterval: 3000,
  });

  // Start/stop tracking based on visibility
  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.play();
      startTracking(() => videoRef.current?.currentTime ?? 0);
    } else {
      videoRef.current?.pause();
      stopTracking();
    }
  }, [isActive, startTracking, stopTracking]);

  if (!room) return <Spinner />;

  return (
    <div className={`reel-slide ${isActive ? 'active' : ''}`}>
      <video
        ref={videoRef}
        src={room.getReelData().media?.[0]?.url}
        loop
        muted
        playsInline
      />
      {isTracking && <div className="tracking-dot" />}
    </div>
  );
}
```

## API Reference

### Hook Options

```typescript
interface IUseReelRoomOptions {
  /** Enable view tracking functionality for AI analysis (default: true) */
  enableViewTracking?: boolean;
  /** Interval in milliseconds to send tracking data (default: 3000ms) */
  trackingInterval?: number;
  // ... other options
}
```

### Hook Return Values

```typescript
interface IUseReelRoom {
  // View Tracking
  /** Total number of views */
  viewsCount: number;
  /** Whether auto-tracking is currently active */
  isTracking: boolean;
  /** Start auto-tracking view progress */
  startTracking: (getCurrentTime: () => number) => void;
  /** Stop auto-tracking */
  stopTracking: () => void;
  /** Manually notify server of view progress */
  notifyView: (currentTime: number) => Promise<void>;
  // ... other fields
}
```

### Client Method

```typescript
/**
 * Notify server of current viewing progress for AI behavior analysis.
 * Should be called periodically (e.g., every 3 seconds) throughout video playback.
 */
client.notifyReelView(reelId: string, currentTime: number): Promise<void>
```

## AI Analysis Capabilities

The tracking data enables AI to analyze:

| Pattern | Analysis |
|---------|----------|
| **Watch Time** | How long users watch each video |
| **Completion Rate** | % of users who watch to the end |
| **Skip Points** | Where users commonly skip or leave |
| **Re-watch Behavior** | Which parts users replay |
| **Engagement Correlation** | Watch time vs likes/comments |

### Example AI Insights

```
Video A (15s):
├── Average watch time: 12.5s (83%)
├── Drop-off points: 3s (10%), 8s (15%)
├── Re-watch rate: 25% (mostly 0-5s section)
└── Recommendation: High quality, promote more

Video B (30s):
├── Average watch time: 8.2s (27%)
├── Drop-off points: 5s (40%), 10s (30%)
├── Re-watch rate: 5%
└── Recommendation: Consider shorter format
```

## Best Practices

### 1. Start/Stop Properly

```tsx
// ✅ Good: Track only when video is playing
const handlePlay = () => {
  startTracking(() => videoRef.current?.currentTime ?? 0);
};

const handlePause = () => {
  stopTracking();
};

<video onPlay={handlePlay} onPause={handlePause} onEnded={handlePause} />
```

### 2. Handle Tab Visibility

```tsx
// ✅ Good: Stop tracking when tab is hidden
useEffect(() => {
  const handleVisibility = () => {
    if (document.hidden) {
      stopTracking();
    } else if (videoRef.current && !videoRef.current.paused) {
      startTracking(() => videoRef.current?.currentTime ?? 0);
    }
  };

  document.addEventListener('visibilitychange', handleVisibility);
  return () => document.removeEventListener('visibilitychange', handleVisibility);
}, [startTracking, stopTracking]);
```

### 3. Choose Appropriate Interval

```tsx
// ✅ Good: Balance between accuracy and network usage
const { startTracking } = useReelRoom(reelId, {
  trackingInterval: 3000, // 3 seconds - good balance
});

// ❌ Bad: Too frequent
const { startTracking } = useReelRoom(reelId, {
  trackingInterval: 500, // Too many requests!
});

// ❌ Bad: Too infrequent
const { startTracking } = useReelRoom(reelId, {
  trackingInterval: 30000, // Misses important data
});
```

### 4. Cleanup on Unmount

```tsx
// ✅ Good: Hook handles cleanup automatically
function ReelPlayer({ reelId }) {
  const { startTracking, stopTracking } = useReelRoom(reelId);
  
  // Cleanup is automatic when component unmounts
  // or when reelId changes
  
  return <video />;
}
```

### 5. Disable for Previews/Thumbnails

```tsx
// ✅ Good: Don't track preview plays
function ReelPreview({ reelId }) {
  const { room } = useReelRoom(reelId, {
    enableViewTracking: false, // No tracking for previews
  });
  
  return <video autoPlay muted loop style={{ maxHeight: 100 }} />;
}
```

## CSS for Tracking Indicator

```css
/* Pulsing tracking indicator */
.tracking-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #ff4444;
  font-size: 12px;
}

.tracking-indicator .pulse {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Tracking badge overlay */
.tracking-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.tracking-badge .pulse {
  color: #ff4444;
  animation: pulse 1s infinite;
}
```

## Related

- [Reel Player](./reel-player) - Video playback
- [Reels Feed](./reels-feed) - Display reels list
- [Trending Search](./trending-search) - AI-powered trending keywords

[Back to Reels Features](/docs/features/reels/)

