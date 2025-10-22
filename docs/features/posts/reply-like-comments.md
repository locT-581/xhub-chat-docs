---
sidebar_position: 4
title: Reply & Like Comments
description: Trả lời và thích/bỏ thích comment
tags: [posts, comments, reply, like]
---

# 💬❤️ Reply & Like Comments

Trả lời comment và thích/bỏ thích comment trên bài post.

## Core Package (@xhub-chat/core)

### Like a Comment

```typescript
import { createClient } from '@xhub-chat/core';

const client = createClient({
  baseUrl: 'https://your-server.com',
  accessToken: 'your-access-token',
  userId: '@user:server.com',
});

const room = client.getRoom(roomId);

if (room) {
  // Like a comment
  await room.likeComment(commentId);
  console.log('Comment liked successfully');
}
```

### Unlike a Comment

```typescript
// Unlike a comment
await room.unlikeComment(commentId);
console.log('Comment unliked successfully');
```

### Reply to Comment

```typescript
// Reply to a comment
await room.comment({
  content: 'I agree with your point!',
  post_id: postId,
  parent_comment_id: commentId,    // Parent comment ID
  reply_to_comment_id: commentId,  // The comment you're replying to
});
```

### Reply to a Reply (Nested)

```typescript
// Reply to a nested comment
await room.comment({
  content: 'Thanks for clarifying!',
  post_id: postId,
  parent_comment_id: topLevelCommentId,  // Original top-level comment
  reply_to_comment_id: replyCommentId,   // The reply you're replying to
});
```

### Toggle Comment Like

```typescript
async function toggleCommentLike(
  room: Room,
  commentId: string,
  isLiked: boolean
) {
  try {
    if (isLiked) {
      await room.unlikeComment(commentId);
      return false;
    } else {
      await room.likeComment(commentId);
      return true;
    }
  } catch (error) {
    console.error('Failed to toggle comment like:', error);
    throw error;
  }
}
```

## React Package (@xhub-chat/react)

### Comment with Like & Reply

```tsx
import { useRoom } from '@xhub-chat/react';
import { useState } from 'react';

function CommentItem({ 
  comment, 
  roomId, 
  postId,
  onReplyAdded 
}: Props) {
  const room = useRoom(roomId);
  const [isLiked, setIsLiked] = useState(comment.is_liked);
  const [likesCount, setLikesCount] = useState(comment.likes_count);
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleLike = async () => {
    if (!room) return;

    try {
      if (isLiked) {
        await room.unlikeComment(comment.id);
        setIsLiked(false);
        setLikesCount(prev => prev - 1);
      } else {
        await room.likeComment(comment.id);
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  return (
    <div className="comment">
      <div className="comment-content">
        <strong>{comment.author.name}</strong>
        <p>{comment.content}</p>
      </div>

      <div className="comment-actions">
        <button onClick={handleLike}>
          {isLiked ? '❤️' : '🤍'} {likesCount}
        </button>
        <button onClick={() => setShowReplyForm(!showReplyForm)}>
          Reply
        </button>
      </div>

      {showReplyForm && (
        <ReplyForm
          roomId={roomId}
          postId={postId}
          commentId={comment.id}
          onReplyAdded={() => {
            setShowReplyForm(false);
            onReplyAdded();
          }}
          onCancel={() => setShowReplyForm(false)}
        />
      )}

      {/* Show nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="replies">
          {comment.replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              roomId={roomId}
              postId={postId}
              onReplyAdded={onReplyAdded}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

### Reply Form Component

```tsx
import { useRoom } from '@xhub-chat/react';
import { useState } from 'react';

function ReplyForm({ 
  roomId, 
  postId, 
  commentId,
  onReplyAdded,
  onCancel 
}: Props) {
  const room = useRoom(roomId);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!room || !content.trim()) return;

    setLoading(true);
    try {
      await room.comment({
        content: content.trim(),
        post_id: postId,
        parent_comment_id: commentId,
        reply_to_comment_id: commentId,
      });

      setContent('');
      onReplyAdded();
    } catch (error) {
      console.error('Failed to post reply:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="reply-form">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a reply..."
        rows={2}
        disabled={loading}
        autoFocus
      />
      <div className="form-actions">
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" disabled={loading || !content.trim()}>
          {loading ? 'Posting...' : 'Reply'}
        </button>
      </div>
    </form>
  );
}
```

### Complete Comment with All Features

```tsx
import { useRoom } from '@xhub-chat/react';
import { useState } from 'react';

function EnhancedComment({ 
  comment, 
  roomId, 
  postId,
  level = 0,  // Nesting level
  onUpdate 
}: Props) {
  const room = useRoom(roomId);
  const [isLiked, setIsLiked] = useState(comment.is_liked);
  const [likesCount, setLikesCount] = useState(comment.likes_count);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const handleLike = async () => {
    if (!room || likeLoading) return;

    setLikeLoading(true);
    const wasLiked = isLiked;

    // Optimistic update
    setIsLiked(!wasLiked);
    setLikesCount(prev => wasLiked ? prev - 1 : prev + 1);

    try {
      if (wasLiked) {
        await room.unlikeComment(comment.id);
      } else {
        await room.likeComment(comment.id);
      }
    } catch (error) {
      // Rollback on error
      setIsLiked(wasLiked);
      setLikesCount(prev => wasLiked ? prev + 1 : prev - 1);
      console.error('Failed to toggle like:', error);
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <div 
      className="comment" 
      style={{ marginLeft: `${level * 20}px` }}
    >
      <div className="comment-header">
        <img 
          src={comment.author.avatar} 
          alt={comment.author.name}
          className="avatar"
        />
        <div>
          <strong>{comment.author.name}</strong>
          <time>{new Date(comment.created_at).toLocaleString()}</time>
        </div>
      </div>

      <div className="comment-content">
        <p>{comment.content}</p>
      </div>

      <div className="comment-actions">
        <button 
          onClick={handleLike}
          disabled={likeLoading}
          className={isLiked ? 'liked' : ''}
        >
          {isLiked ? '❤️' : '🤍'} {likesCount}
        </button>
        
        {level < 3 && ( // Limit nesting to 3 levels
          <button onClick={() => setShowReplyForm(!showReplyForm)}>
            💬 Reply
          </button>
        )}
      </div>

      {showReplyForm && (
        <ReplyForm
          roomId={roomId}
          postId={postId}
          commentId={comment.id}
          onReplyAdded={() => {
            setShowReplyForm(false);
            onUpdate();
          }}
          onCancel={() => setShowReplyForm(false)}
        />
      )}

      {/* Nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="replies">
          {comment.replies.map(reply => (
            <EnhancedComment
              key={reply.id}
              comment={reply}
              roomId={roomId}
              postId={postId}
              level={level + 1}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

### Custom Hook for Comment Actions

```tsx
import { useRoom } from '@xhub-chat/react';
import { useState, useCallback } from 'react';

function useCommentActions(commentId: string, roomId: string) {
  const room = useRoom(roomId);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const toggleLike = useCallback(async () => {
    if (!room || loading) return;

    setLoading(true);
    const wasLiked = isLiked;

    // Optimistic update
    setIsLiked(!wasLiked);
    setLikesCount(prev => wasLiked ? prev - 1 : prev + 1);

    try {
      if (wasLiked) {
        await room.unlikeComment(commentId);
      } else {
        await room.likeComment(commentId);
      }
    } catch (error) {
      // Rollback
      setIsLiked(wasLiked);
      setLikesCount(prev => wasLiked ? prev + 1 : prev - 1);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [room, commentId, isLiked, loading]);

  const reply = useCallback(async (content: string, postId: string) => {
    if (!room) return;

    await room.comment({
      content,
      post_id: postId,
      parent_comment_id: commentId,
      reply_to_comment_id: commentId,
    });
  }, [room, commentId]);

  return {
    isLiked,
    likesCount,
    loading,
    toggleLike,
    reply,
    setIsLiked,
    setLikesCount,
  };
}
```

## API Reference

### Room Methods

```typescript
// Like a comment
likeComment(commentId: string): Promise<HttpResponse<unknown>>

// Unlike a comment
unlikeComment(commentId: string): Promise<HttpResponse<unknown>>

// Reply to a comment
comment(params: {
  content: string;
  post_id: string;
  parent_comment_id?: string;
  reply_to_comment_id?: string;
}): Promise<HttpResponse<unknown>>
```

### Comment Interface

```typescript
interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  post_id: string;
  parent_comment_id?: string;
  reply_to_comment_id?: string;
  replies?: Comment[];
  likes_count: number;
  is_liked: boolean;
  created_at: string;
  updated_at: string;
}
```

## Best Practices

### 1. Optimistic Updates

Always update UI immediately for better UX, then rollback if the request fails:

```tsx
// Update UI first
setIsLiked(true);

try {
  await room.likeComment(id);
} catch (error) {
  // Rollback on error
  setIsLiked(false);
}
```

### 2. Limit Nesting Depth

Prevent infinite nesting by limiting reply depth:

```tsx
{level < 3 && (
  <button onClick={handleReply}>Reply</button>
)}
```

### 3. Loading States

Show loading indicators during actions:

```tsx
<button disabled={loading}>
  {loading ? 'Posting...' : 'Reply'}
</button>
```

[Back to Features](/docs/features/)
