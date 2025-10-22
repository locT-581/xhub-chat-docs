---
sidebar_position: 1
title: View Posts
description: Xem chi tiết bài post
tags: [posts, view]
---

# 👁️ View Posts

Xem chi tiết nội dung bài post và thông tin liên quan.

## Core Package (@xhub-chat/core)

### Get Post Details

```typescript
import { createClient } from '@xhub-chat/core';

const client = createClient({
  baseUrl: 'https://your-server.com',
  accessToken: 'your-access-token',
  userId: '@user:server.com',
});

const room = client.getRoom(roomId);

if (room && room.getCategory() === 'post') {
  // Get post details
  const postDetails = await room.getPostDetails(postId);
  
  console.log('Post:', {
    id: postDetails.data.id,
    content: postDetails.data.content,
    author: postDetails.data.author,
    likes: postDetails.data.likes_count,
    comments: postDetails.data.comments_count,
    created_at: postDetails.data.created_at,
  });
}
```

### List Posts in Room

```typescript
// Get timeline of posts
const timeline = room.getLiveTimeline();
const events = timeline.getEvents();

// Filter post events
const posts = events.filter(event => 
  event.getType() === 'm.room.message' && 
  room.getCategory() === 'post'
);

posts.forEach(post => {
  const content = post.getContent();
  console.log('Post:', content);
});
```

### Load More Posts (Pagination)

```typescript
import { EventTimeline } from '@xhub-chat/core';

const timeline = room.getLiveTimeline();

// Load older posts
await client.paginateEventTimeline(timeline, {
  backwards: true,
  limit: 10,
});

const allPosts = timeline.getEvents();
```

## React Package (@xhub-chat/react)

### Display Post List

```tsx
import { useRoom, useTimeline } from '@xhub-chat/react';

function PostList({ roomId }: { roomId: string }) {
  const room = useRoom(roomId);
  const { events, loading } = useTimeline(roomId);

  if (loading) return <div>Loading posts...</div>;
  if (!room || room.getCategory() !== 'post') {
    return <div>Not a post room</div>;
  }

  return (
    <div className="post-list">
      {events.map(event => (
        <PostCard key={event.getId()} event={event} />
      ))}
    </div>
  );
}

function PostCard({ event }: { event: XHubChatEvent }) {
  const content = event.getContent();
  
  return (
    <div className="post-card">
      <div className="post-header">
        <strong>{event.getSender()}</strong>
        <time>{event.getDate()?.toLocaleString()}</time>
      </div>
      <div className="post-content">
        {content.body || content.text}
      </div>
      <div className="post-stats">
        <span>❤️ {content.likes_count || 0}</span>
        <span>💬 {content.comments_count || 0}</span>
      </div>
    </div>
  );
}
```

### View Post Details

```tsx
import { useState, useEffect } from 'react';
import { useRoom } from '@xhub-chat/react';

function PostDetails({ roomId, postId }: Props) {
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

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="post-details">
      <h2>{post.title}</h2>
      <div className="post-meta">
        <span>By {post.author?.name}</span>
        <time>{new Date(post.created_at).toLocaleString()}</time>
      </div>
      <div className="post-body">
        {post.content}
      </div>
      <div className="post-footer">
        <button>❤️ {post.likes_count} Likes</button>
        <button>💬 {post.comments_count} Comments</button>
      </div>
    </div>
  );
}
```

### With Pagination

```tsx
import { useTimeline } from '@xhub-chat/react';
import { useCallback } from 'react';

function InfinitePostList({ roomId }: { roomId: string }) {
  const { 
    events, 
    loading,
    paginate,
    canPaginateBackwards 
  } = useTimeline(roomId);

  const loadMore = useCallback(async () => {
    await paginate({ backwards: true, limit: 10 });
  }, [paginate]);

  return (
    <div>
      <div className="post-list">
        {events.map(event => (
          <PostCard key={event.getId()} event={event} />
        ))}
      </div>

      {canPaginateBackwards && (
        <button onClick={loadMore} disabled={loading}>
          {loading ? 'Loading...' : 'Load More Posts'}
        </button>
      )}
    </div>
  );
}
```

## API Reference

### Room Methods

```typescript
// Get post details
getPostDetails(postId: string): Promise<HttpResponse<Post>>

// Get timeline
getLiveTimeline(): EventTimeline
```

### Post Interface

```typescript
interface Post {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
}
```

[Back to Features](/docs/features/)
