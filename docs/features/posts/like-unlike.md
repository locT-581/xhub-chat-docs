---
sidebar_position: 2
title: Like/Unlike Posts
description: Thích và bỏ thích bài post
tags: [posts, like, unlike]
---

# ❤️ Like/Unlike Posts

Thích (like) hoặc bỏ thích (unlike) bài post.

## Core Package (@xhub-chat/core)

### Like a Post

```typescript
import { createClient } from '@xhub-chat/core';

const client = createClient({
  baseUrl: 'https://your-server.com',
  accessToken: 'your-access-token',
  userId: '@user:server.com',
});

const room = client.getRoom(roomId);

if (room) {
  // Like a post
  await room.likePost(postId);
  console.log('Post liked successfully');
}
```

### Unlike a Post

```typescript
// Unlike a post
await room.unlikePost(postId);
console.log('Post unliked successfully');
```

### Toggle Like/Unlike

```typescript
async function togglePostLike(room: Room, postId: string, isLiked: boolean) {
  try {
    if (isLiked) {
      await room.unlikePost(postId);
      return false; // Now unliked
    } else {
      await room.likePost(postId);
      return true; // Now liked
    }
  } catch (error) {
    console.error('Failed to toggle like:', error);
    throw error;
  }
}

// Usage
const newLikedState = await togglePostLike(room, postId, currentlyLiked);
```

### Check if User Liked a Post

```typescript
// Get post details to check like status
const postDetails = await room.getPostDetails(postId);
const userLiked = postDetails.data.is_liked; // Assuming API returns this
const likesCount = postDetails.data.likes_count;

console.log(`Post has ${likesCount} likes`);
console.log(`Current user liked: ${userLiked}`);
```

## React Package (@xhub-chat/react)

### Like Button Component

```tsx
import { useRoom } from '@xhub-chat/react';
import { useState } from 'react';

function LikeButton({ 
  roomId, 
  postId, 
  initialLiked = false,
  initialCount = 0 
}: Props) {
  const room = useRoom(roomId);
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const handleToggleLike = async () => {
    if (!room || loading) return;

    setLoading(true);
    try {
      if (isLiked) {
        await room.unlikePost(postId);
        setIsLiked(false);
        setLikesCount(prev => prev - 1);
      } else {
        await room.likePost(postId);
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleLike}
      disabled={loading}
      className={isLiked ? 'liked' : 'not-liked'}
    >
      {isLiked ? '❤️' : '🤍'} {likesCount}
    </button>
  );
}
```

### Custom Hook for Post Likes

```tsx
import { useRoom } from '@xhub-chat/react';
import { useState, useCallback } from 'react';

function usePostLike(roomId: string, postId: string) {
  const room = useRoom(roomId);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const toggleLike = useCallback(async () => {
    if (!room || loading) return;

    setLoading(true);
    try {
      if (isLiked) {
        await room.unlikePost(postId);
        setIsLiked(false);
        setLikesCount(prev => Math.max(0, prev - 1));
      } else {
        await room.likePost(postId);
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [room, postId, isLiked, loading]);

  return {
    isLiked,
    likesCount,
    loading,
    toggleLike,
    setIsLiked,
    setLikesCount,
  };
}

// Usage
function PostCard({ roomId, postId }: Props) {
  const { isLiked, likesCount, loading, toggleLike } = usePostLike(
    roomId, 
    postId
  );

  return (
    <button onClick={toggleLike} disabled={loading}>
      {isLiked ? '❤️' : '🤍'} {likesCount}
    </button>
  );
}
```

### Post with Like Feature

```tsx
import { useRoom } from '@xhub-chat/react';
import { useState, useEffect } from 'react';

function PostWithLike({ roomId, postId }: Props) {
  const room = useRoom(roomId);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!room) return;

    room.getPostDetails(postId)
      .then(response => setPost(response.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [room, postId]);

  const handleLike = async () => {
    if (!room || !post) return;

    try {
      if (post.is_liked) {
        await room.unlikePost(postId);
      } else {
        await room.likePost(postId);
      }

      // Refresh post data
      const updated = await room.getPostDetails(postId);
      setPost(updated.data);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="post">
      <p>{post.content}</p>
      <button onClick={handleLike}>
        {post.is_liked ? '❤️' : '🤍'} {post.likes_count}
      </button>
    </div>
  );
}
```

### Animated Like Button

```tsx
import { useRoom } from '@xhub-chat/react';
import { useState } from 'react';
import './LikeButton.css'; // Custom animations

function AnimatedLikeButton({ roomId, postId, post }: Props) {
  const room = useRoom(roomId);
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLike = async () => {
    if (!room || isAnimating) return;

    setIsAnimating(true);
    const wasLiked = isLiked;

    // Optimistic update
    setIsLiked(!wasLiked);
    setLikesCount(prev => wasLiked ? prev - 1 : prev + 1);

    try {
      if (wasLiked) {
        await room.unlikePost(postId);
      } else {
        await room.likePost(postId);
      }
    } catch (error) {
      // Rollback on error
      setIsLiked(wasLiked);
      setLikesCount(prev => wasLiked ? prev + 1 : prev - 1);
      console.error('Failed to toggle like:', error);
    } finally {
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`like-button ${isLiked ? 'liked' : ''} ${isAnimating ? 'animating' : ''}`}
    >
      <span className="heart-icon">
        {isLiked ? '❤️' : '🤍'}
      </span>
      <span className="count">{likesCount}</span>
    </button>
  );
}
```

## API Reference

### Room Methods

```typescript
// Like a post
likePost(postId: string): Promise<HttpResponse<unknown>>

// Unlike a post
unlikePost(postId: string): Promise<HttpResponse<unknown>>
```

### Post Like Properties

```typescript
interface Post {
  id: string;
  is_liked: boolean;        // Whether current user liked
  likes_count: number;      // Total likes
  // ... other properties
}
```

### Response

```typescript
// Both likePost and unlikePost return:
Promise<HttpResponse<unknown>>
```

[Back to Features](/docs/features/)
