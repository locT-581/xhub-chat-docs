---
sidebar_position: 3
title: Comments
description: Comment vào bài post
tags: [posts, comments]
---

# 💬 Comments on Posts

Thêm comment vào bài post và xem danh sách comments.

## Core Package (@xhub-chat/core)

### Get Comments

```typescript
import { createClient } from '@xhub-chat/core';

const client = createClient({
  baseUrl: 'https://your-server.com',
  accessToken: 'your-access-token',
  userId: '@user:server.com',
});

const room = client.getRoom(roomId);

if (room) {
  // Get comments for a post
  const response = await room.getCommentsOfPost(postId);
  
  console.log('Comments:', {
    comments: response.data.comments,
    total: response.data.total_count,
    page: response.data.page,
    pageSize: response.data.page_size,
  });

  response.data.comments.forEach(comment => {
    console.log(`${comment.author.name}: ${comment.content}`);
  });
}
```

### Add Comment

```typescript
// Add a top-level comment
await room.comment({
  content: 'Great post!',
  post_id: postId,
});

console.log('Comment added successfully');
```

### Reply to Comment

```typescript
// Reply to a comment
await room.comment({
  content: 'Thanks for your feedback!',
  post_id: postId,
  parent_comment_id: commentId, // ID of parent comment
  reply_to_comment_id: commentId, // ID of comment being replied to
});
```

### Nested Comments Example

```typescript
async function addNestedComment(
  room: Room,
  postId: string,
  content: string,
  parentCommentId?: string,
  replyToCommentId?: string,
) {
  return await room.comment({
    content,
    post_id: postId,
    parent_comment_id: parentCommentId,
    reply_to_comment_id: replyToCommentId,
  });
}

// Top-level comment
await addNestedComment(room, postId, 'Nice post!');

// Reply to comment
await addNestedComment(
  room, 
  postId, 
  'Thank you!', 
  commentId,  // parent
  commentId   // reply to
);
```

## React Package (@xhub-chat/react)

### Comments List Component

```tsx
import { useRoom } from '@xhub-chat/react';
import { useState, useEffect } from 'react';

function CommentsList({ roomId, postId }: Props) {
  const room = useRoom(roomId);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!room) return;

    room.getCommentsOfPost(postId)
      .then(response => setComments(response.data.comments))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [room, postId]);

  if (loading) return <div>Loading comments...</div>;

  return (
    <div className="comments-list">
      <h3>{comments.length} Comments</h3>
      {comments.map(comment => (
        <CommentItem 
          key={comment.id} 
          comment={comment}
          roomId={roomId}
          postId={postId}
        />
      ))}
    </div>
  );
}

function CommentItem({ comment, roomId, postId }: Props) {
  return (
    <div className="comment">
      <div className="comment-header">
        <strong>{comment.author.name}</strong>
        <time>{new Date(comment.created_at).toLocaleString()}</time>
      </div>
      <p>{comment.content}</p>
      
      {/* Nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="replies">
          {comment.replies.map(reply => (
            <CommentItem 
              key={reply.id} 
              comment={reply}
              roomId={roomId}
              postId={postId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

### Add Comment Form

```tsx
import { useRoom } from '@xhub-chat/react';
import { useState } from 'react';

function AddCommentForm({ 
  roomId, 
  postId,
  parentCommentId,
  onCommentAdded 
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
        parent_comment_id: parentCommentId,
        reply_to_comment_id: parentCommentId,
      });

      setContent('');
      onCommentAdded?.();
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={parentCommentId ? 'Write a reply...' : 'Write a comment...'}
        rows={3}
        disabled={loading}
      />
      <button type="submit" disabled={loading || !content.trim()}>
        {loading ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  );
}
```

### Complete Comments Section

```tsx
import { useRoom } from '@xhub-chat/react';
import { useState, useEffect, useCallback } from 'react';

function CommentsSection({ roomId, postId }: Props) {
  const room = useRoom(roomId);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    if (!room) return;

    try {
      const response = await room.getCommentsOfPost(postId);
      setComments(response.data.comments);
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setLoading(false);
    }
  }, [room, postId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleCommentAdded = () => {
    loadComments();
    setReplyTo(null);
  };

  if (loading) return <div>Loading comments...</div>;

  return (
    <div className="comments-section">
      <h3>{comments.length} Comments</h3>

      <AddCommentForm
        roomId={roomId}
        postId={postId}
        onCommentAdded={handleCommentAdded}
      />

      <div className="comments-list">
        {comments.map(comment => (
          <Comment
            key={comment.id}
            comment={comment}
            roomId={roomId}
            postId={postId}
            onReply={(id) => setReplyTo(id)}
            onCommentAdded={handleCommentAdded}
          />
        ))}
      </div>

      {replyTo && (
        <div className="reply-form-modal">
          <button onClick={() => setReplyTo(null)}>Cancel</button>
          <AddCommentForm
            roomId={roomId}
            postId={postId}
            parentCommentId={replyTo}
            onCommentAdded={handleCommentAdded}
          />
        </div>
      )}
    </div>
  );
}

function Comment({ 
  comment, 
  roomId, 
  postId, 
  onReply,
  onCommentAdded 
}: Props) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  return (
    <div className="comment">
      <div className="comment-content">
        <strong>{comment.author.name}</strong>
        <p>{comment.content}</p>
        <button onClick={() => setShowReplyForm(!showReplyForm)}>
          Reply
        </button>
      </div>

      {showReplyForm && (
        <AddCommentForm
          roomId={roomId}
          postId={postId}
          parentCommentId={comment.id}
          onCommentAdded={() => {
            setShowReplyForm(false);
            onCommentAdded();
          }}
        />
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="replies">
          {comment.replies.map(reply => (
            <Comment
              key={reply.id}
              comment={reply}
              roomId={roomId}
              postId={postId}
              onReply={onReply}
              onCommentAdded={onCommentAdded}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

## API Reference

### Room Methods

```typescript
// Get comments for a post
getCommentsOfPost(postId: string): Promise<HttpResponse<{
  comments: Comment[];
  total_count: number;
  page: number;
  page_size: number;
}>>

// Add a comment
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
  created_at: string;
  updated_at: string;
  likes_count: number;
  is_liked: boolean;
}
```

[Back to Features](/docs/features/)
