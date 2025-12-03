---
sidebar_position: 3
title: Reel Comments
description: View and send comments for reels
tags: [reels, comments, messaging, real-time]
---

# 💬 Reel Comments

View and send comments for reels with real-time updates.

## Overview

Reels comments work like post comments, use Room's timeline để quản lý messages.

Key features:
- Real-time comment updates
- Threaded replies (optional)
- Like/unlike comments
- Pagination for large comment lists

## Core Package (@xhub-chat/core)

### Get Reel Room First

```typescript
import { createClient } from '@xhub-chat/core';

const client = createClient({
  baseUrl: 'https://your-server.com',
  accessToken: 'your-access-token',
  userId: '@user:server.com',
});

await client.startClient();

// Load reels first
await client.paginateReels({ limit: 10 });

// Get reel room
const reelsStore = client.getReelsStore();
const room = reelsStore.getRoom('reel_123');
```

### Send Comment

```typescript
if (room && room.isReelRoom()) {
  // Send a text comment
  await room.sendTextMessage('Great video! 👍');
  
  // Send with metadata
  await room.sendEvent('m.room.message', {
    msgtype: 'm.text',
    body: 'Amazing content!',
    // Optional: Add custom metadata
    'm.relates_to': {
      rel_type: 'm.annotation',
      event_id: '$parent_event_id', // For threaded replies
    },
  });
}
```

### Get Comments

```typescript
// Get all timeline events (includes comments)
const timeline = room.getLiveTimeline();
const events = timeline.getEvents();

// Filter text messages (comments)
const comments = events.filter(event => 
  event.getType() === 'm.room.message' &&
  event.getContent().msgtype === 'm.text'
);

comments.forEach(comment => {
  console.log({
    id: comment.getId(),
    sender: comment.getSender(),
    text: comment.getContent().body,
    timestamp: event.getDate(),
  });
});
```

### Listen to New Comments

```typescript
import { RoomEvent } from '@xhub-chat/core';

room.on(RoomEvent.Timeline, (event, room, toStartOfTimeline) => {
  if (toStartOfTimeline) return; // Skip old events
  
  if (event.getType() === 'm.room.message') {
    console.log('New comment:', event.getContent().body);
    // Update your UI with the new comment
  }
});
```

## React Package (@xhub-chat/react)

### Display Comments

```tsx
import { useReelComments } from '@xhub-chat/react';

function ReelComments({ reelId }: { reelId: string }) {
  const { comments, loading, error } = useReelComments(reelId);

  if (loading) return <div>Loading comments...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="comments-section">
      <h3>Comments ({comments.length})</h3>
      {comments.map(comment => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}

function CommentItem({ comment }: { comment: CommentData }) {
  return (
    <div className="comment">
      <img 
        src={comment.sender.avatarUrl} 
        alt={comment.sender.name}
        className="avatar"
      />
      <div className="content">
        <strong>{comment.sender.name}</strong>
        <p>{comment.content.body}</p>
        <span className="timestamp">
          {new Date(comment.timestamp).toLocaleString()}
        </span>
      </div>
    </div>
  );
}
```

### Send Comment

```tsx
import { useReelRoom, useReelComments } from '@xhub-chat/react';
import { useState } from 'react';

function CommentInput({ reelId }: { reelId: string }) {
  const { room } = useReelRoom(reelId);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!room || !text.trim()) return;

    setSending(true);
    try {
      await room.sendTextMessage(text.trim());
      setText(''); // Clear input
    } catch (error) {
      console.error('Failed to send comment:', error);
      alert('Failed to send comment');
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-input">
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Add a comment..."
        disabled={sending}
      />
      <button type="submit" disabled={sending || !text.trim()}>
        {sending ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}
```

### Complete Comments Section

```tsx
import { useReelRoom, useReelComments } from '@xhub-chat/react';
import { useState } from 'react';

function ReelCommentsSection({ reelId }: { reelId: string }) {
  const { room } = useReelRoom(reelId);
  const { comments, loading } = useReelComments(reelId);
  const [commentText, setCommentText] = useState('');
  const [sending, setSending] = useState(false);

  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!room || !commentText.trim()) return;

    setSending(true);
    try {
      await room.sendTextMessage(commentText.trim());
      setCommentText('');
    } catch (error) {
      console.error('Failed to send comment:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="comments-section">
      {/* Header */}
      <div className="comments-header">
        <h3>Comments</h3>
        <span className="count">{comments.length}</span>
      </div>

      {/* Comments List */}
      <div className="comments-list">
        {loading ? (
          <div>Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="no-comments">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="comment">
              <img 
                src={comment.sender.avatarUrl} 
                alt={comment.sender.name}
              />
              <div className="comment-content">
                <div className="comment-header">
                  <strong>{comment.sender.name}</strong>
                  <span className="timestamp">
                    {formatTimestamp(comment.timestamp)}
                  </span>
                </div>
                <p>{comment.content.body}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Comment Input */}
      <form onSubmit={handleSendComment} className="comment-form">
        <input
          type="text"
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          disabled={sending}
        />
        <button type="submit" disabled={sending || !commentText.trim()}>
          {sending ? '⏳' : '📤'}
        </button>
      </form>
    </div>
  );
}

function formatTimestamp(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}
```

### With Like Functionality

```tsx
import { useReelComments, useReactions } from '@xhub-chat/react';

function CommentWithLikes({ 
  reelId, 
  comment 
}: { 
  reelId: string; 
  comment: CommentData;
}) {
  const { toggleReaction } = useReactions(reelId);
  const [isLiked, setIsLiked] = useState(comment.isLiked);
  const [likeCount, setLikeCount] = useState(comment.likeCount);

  const handleLike = async () => {
    try {
      await toggleReaction(comment.id, '❤️');
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  return (
    <div className="comment">
      <div className="comment-content">
        <strong>{comment.sender.name}</strong>
        <p>{comment.content.body}</p>
      </div>
      <button 
        onClick={handleLike}
        className={isLiked ? 'liked' : ''}
      >
        ❤️ {likeCount}
      </button>
    </div>
  );
}
```

### Real-time Updates

```tsx
import { useReelComments } from '@xhub-chat/react';
import { useEffect, useRef } from 'react';

function LiveComments({ reelId }: { reelId: string }) {
  const { comments } = useReelComments(reelId);
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(comments.length);

  // Auto-scroll to new comments
  useEffect(() => {
    if (comments.length > prevCountRef.current) {
      commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevCountRef.current = comments.length;
  }, [comments.length]);

  return (
    <div className="live-comments">
      {comments.map(comment => (
        <div key={comment.id} className="comment">
          {comment.content.body}
        </div>
      ))}
      <div ref={commentsEndRef} />
    </div>
  );
}
```

### Pagination for Large Lists

```tsx
import { useReelComments } from '@xhub-chat/react';
import { useState } from 'react';

function PaginatedComments({ reelId }: { reelId: string }) {
  const { comments } = useReelComments(reelId);
  const [visibleCount, setVisibleCount] = useState(10);

  const visibleComments = comments.slice(0, visibleCount);
  const hasMore = visibleCount < comments.length;

  return (
    <div className="paginated-comments">
      {visibleComments.map(comment => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
      
      {hasMore && (
        <button onClick={() => setVisibleCount(v => v + 10)}>
          Load More ({comments.length - visibleCount} remaining)
        </button>
      )}
    </div>
  );
}
```

## API Reference

### Hook: `useReelComments`

```typescript
function useReelComments(reelId: string): IUseReelComments;

interface IUseReelComments {
  /** Array of comments */
  comments: CommentData[];
  /** Whether comments are loading */
  loading: boolean;
  /** Error if loading failed */
  error: Error | null;
  /** Send a new comment */
  sendComment: (text: string) => Promise<void>;
  /** Refresh comments */
  refresh: () => void;
}

interface CommentData {
  id: string;
  sender: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  content: {
    body: string;
    msgtype: string;
  };
  timestamp: number;
  isLiked?: boolean;
  likeCount?: number;
}
```

### Room Methods

```typescript
// Send text comment
room.sendTextMessage(text: string): Promise<void>

// Send structured comment
room.sendEvent(type: string, content: object): Promise<void>

// Get timeline
room.getLiveTimeline(): EventTimeline
```

## Best Practices

### 1. Always Check Room Availability

```tsx
function ReelComments({ reelId }: { reelId: string }) {
  const { room } = useReelRoom(reelId);
  const { comments } = useReelComments(reelId);

  // ✅ Good: Check room exists
  if (!room) {
    return <div>Reel not loaded</div>;
  }

  return <div>{/* ... */}</div>;
}
```

### 2. Handle Send Errors

```tsx
const handleSendComment = async (text: string) => {
  try {
    await room.sendTextMessage(text);
  } catch (error) {
    // ✅ Good: Show error to user
    console.error('Failed to send:', error);
    toast.error('Failed to send comment. Please try again.');
  }
};
```

### 3. Optimize Re-renders

```tsx
import { memo } from 'react';

// ✅ Good: Memoize comment items
const CommentItem = memo(({ comment }: { comment: CommentData }) => {
  return (
    <div className="comment">
      {comment.content.body}
    </div>
  );
});
```

### 4. Validate Input

```tsx
const handleSendComment = async (text: string) => {
  // ✅ Good: Validate before sending
  const trimmed = text.trim();
  
  if (!trimmed) {
    return; // Don't send empty comments
  }
  
  if (trimmed.length > 500) {
    toast.error('Comment too long (max 500 characters)');
    return;
  }
  
  await room.sendTextMessage(trimmed);
};
```

## Related

- [Reels Feed](./reels-feed) - Load reels list
- [Reel Player](./reel-player) - Play reel videos
- [Post Comments](../posts/comments) - Comments for posts

[Back to Reels Features](./index)
