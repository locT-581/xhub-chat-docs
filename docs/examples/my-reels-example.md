---
sidebar_position: 5
title: My Reels Example
description: Complete example of managing user's own reels
tags: [examples, reels, my-reels, react]
---

# 👤 My Reels - Complete Example

A complete example showing how to build a user's reels management page with filtering, sorting, and pagination.

## Demo Preview

This example demonstrates:
- ✅ Display user's own reels in a grid
- ✅ Filter by approval status (approved/pending/rejected)
- ✅ Filter by privacy level
- ✅ Sort by different fields
- ✅ Pagination with "Load More"
- ✅ Loading and error states
- ✅ Empty state handling

## Full Implementation

### 1. Setup Provider

```tsx
// App.tsx
import { XHubChatProvider } from '@xhub-chat/react';
import MyReelsPage from './MyReelsPage';

function App() {
  return (
    <XHubChatProvider
      clientOptions={{
        baseUrl: 'https://your-server.com',
        accessToken: 'your-access-token',
        userId: '@user:server.com',
      }}
    >
      <MyReelsPage />
    </XHubChatProvider>
  );
}

export default App;
```

### 2. Main Component

```tsx
// MyReelsPage.tsx
import { useMyReels } from '@xhub-chat/react';
import { useState } from 'react';
import type { MyReelsFilter } from '@xhub-chat/core';
import './MyReelsPage.css';

function MyReelsPage() {
  const [localFilters, setLocalFilters] = useState<MyReelsFilter>({
    approving_status: undefined,
    sort: 'created_at',
    sorted: 'desc',
  });

  const {
    reels,
    loading,
    error,
    hasMore,
    loadMore,
    reload,
    setFilters,
  } = useMyReels({
    initialFilters: localFilters,
    limit: 12,
  });

  const handleApplyFilters = () => {
    setFilters(localFilters);
  };

  const handleRefresh = () => {
    reload(localFilters);
  };

  return (
    <div className="my-reels-page">
      <header className="page-header">
        <h1>My Reels</h1>
        <button onClick={handleRefresh} className="btn-refresh">
          🔄 Refresh
        </button>
      </header>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Status:</label>
          <select
            value={localFilters.approving_status || ''}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                approving_status: e.target.value as any || undefined,
              })
            }
          >
            <option value="">All</option>
            <option value="approved">✅ Approved</option>
            <option value="pending">⏳ Pending</option>
            <option value="rejected">❌ Rejected</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sort:</label>
          <select
            value={localFilters.sorted || 'desc'}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                sorted: e.target.value as 'asc' | 'desc',
              })
            }
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>

        <button onClick={handleApplyFilters} className="btn-apply">
          Apply Filters
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="error-state">
          <p>❌ Error: {error.message}</p>
          <button onClick={handleRefresh}>Try Again</button>
        </div>
      )}

      {/* Reels Grid */}
      <div className="reels-grid">
        {reels.map((reel) => (
          <div key={reel.id} className="reel-card">
            {/* Thumbnail */}
            <div className="reel-thumbnail">
              {reel.thumbnail?.url ? (
                <img src={reel.thumbnail.url} alt={reel.title} />
              ) : (
                <div className="thumbnail-placeholder">
                  🎬 No Thumbnail
                </div>
              )}
              
              {/* Status Badge */}
              <div className={`status-badge status-${reel.approving_status}`}>
                {reel.approving_status === 'approved' && '✅'}
                {reel.approving_status === 'pending' && '⏳'}
                {reel.approving_status === 'rejected' && '❌'}
                {reel.approving_status}
              </div>
            </div>

            {/* Info */}
            <div className="reel-info">
              <h3 className="reel-title">{reel.title || 'Untitled'}</h3>
              
              {/* Stats */}
              <div className="reel-stats">
                <span>❤️ {reel.likes.toLocaleString()}</span>
                <span>👁️ {reel.views.toLocaleString()}</span>
                <span>💬 {reel.total_comments.toLocaleString()}</span>
              </div>

              {/* Date */}
              <div className="reel-date">
                {new Date(reel.created_at).toLocaleDateString()}
              </div>
            </div>

            {/* Actions */}
            <div className="reel-actions">
              <button className="btn-edit">Edit</button>
              <button className="btn-delete">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading reels...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && reels.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h2>No Reels Found</h2>
          <p>You haven't created any reels yet.</p>
          <button className="btn-create">Create Your First Reel</button>
        </div>
      )}

      {/* Load More */}
      {hasMore && !loading && (
        <div className="load-more-section">
          <button onClick={loadMore} className="btn-load-more">
            Load More Reels
          </button>
        </div>
      )}

      {/* Summary */}
      <div className="summary">
        Showing {reels.length} reel{reels.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}

export default MyReelsPage;
```

### 3. Styling

```css
/* MyReelsPage.css */
.my-reels-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 32px;
  font-weight: bold;
}

.btn-refresh {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  cursor: pointer;
}

/* Filters */
.filters-section {
  display: flex;
  gap: 16px;
  margin-bottom: 30px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-weight: 500;
}

.filter-group select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
}

.btn-apply {
  padding: 8px 16px;
  background: #0066ff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

/* Reels Grid */
.reels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.reel-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  transition: transform 0.2s, box-shadow 0.2s;
}

.reel-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.reel-thumbnail {
  position: relative;
  width: 100%;
  aspect-ratio: 9 / 16;
  background: #f0f0f0;
  overflow: hidden;
}

.reel-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: #ccc;
}

.status-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
  background: rgba(0, 0, 0, 0.7);
  color: white;
}

.status-approved { background: rgba(34, 197, 94, 0.9); }
.status-pending { background: rgba(251, 191, 36, 0.9); }
.status-rejected { background: rgba(239, 68, 68, 0.9); }

.reel-info {
  padding: 12px;
}

.reel-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.reel-stats {
  display: flex;
  gap: 12px;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.reel-date {
  font-size: 12px;
  color: #999;
}

.reel-actions {
  display: flex;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid #e0e0e0;
}

.reel-actions button {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 14px;
}

.btn-edit:hover {
  background: #f0f0f0;
}

.btn-delete:hover {
  background: #fee;
  border-color: #fcc;
  color: #c00;
}

/* States */
.error-state,
.empty-state,
.loading-state {
  text-align: center;
  padding: 60px 20px;
}

.error-state {
  color: #c00;
}

.loading-state .spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #0066ff;
  border-radius: 50%;
  margin: 0 auto 16px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state .empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.btn-create {
  margin-top: 16px;
  padding: 12px 24px;
  background: #0066ff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}

/* Load More */
.load-more-section {
  text-align: center;
  margin-bottom: 20px;
}

.btn-load-more {
  padding: 12px 48px;
  background: #0066ff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
}

.btn-load-more:hover {
  background: #0052cc;
}

/* Summary */
.summary {
  text-align: center;
  color: #666;
  font-size: 14px;
  padding: 20px;
}
```

## Features Breakdown

### Filter Controls

```tsx
// Quick filter buttons
function QuickFilters({ onFilterChange }) {
  return (
    <div className="quick-filters">
      <button onClick={() => onFilterChange({ approving_status: 'approved' })}>
        ✅ Published
      </button>
      <button onClick={() => onFilterChange({ approving_status: 'pending' })}>
        ⏳ Pending
      </button>
      <button onClick={() => onFilterChange({ approving_status: 'rejected' })}>
        ❌ Rejected
      </button>
      <button onClick={() => onFilterChange({})}>
        All
      </button>
    </div>
  );
}
```

### Infinite Scroll

```tsx
import { useEffect, useRef } from 'react';

function MyReelsInfiniteScroll() {
  const { reels, hasMore, loadMore, loading } = useMyReels();
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

  return (
    <div>
      <div className="reels-grid">
        {reels.map(reel => (
          <ReelCard key={reel.id} reel={reel} />
        ))}
      </div>
      <div ref={observerTarget} />
    </div>
  );
}
```

### Analytics Dashboard

```tsx
function ReelAnalytics() {
  const { reels } = useMyReels({
    initialFilters: { approving_status: 'approved' },
  });

  const stats = {
    totalReels: reels.length,
    totalViews: reels.reduce((sum, r) => sum + r.views, 0),
    totalLikes: reels.reduce((sum, r) => sum + r.likes, 0),
    totalComments: reels.reduce((sum, r) => sum + r.total_comments, 0),
    avgViewsPerReel: reels.length > 0 
      ? Math.round(reels.reduce((sum, r) => sum + r.views, 0) / reels.length)
      : 0,
  };

  return (
    <div className="analytics">
      <StatCard label="Total Reels" value={stats.totalReels} icon="🎬" />
      <StatCard label="Total Views" value={stats.totalViews.toLocaleString()} icon="👁️" />
      <StatCard label="Total Likes" value={stats.totalLikes.toLocaleString()} icon="❤️" />
      <StatCard label="Avg Views" value={stats.avgViewsPerReel.toLocaleString()} icon="📊" />
    </div>
  );
}
```

## Key Takeaways

1. **Auto-load on mount** - Set `autoLoad: true` (default) for immediate data
2. **Use filters** - Combine multiple filters for precise results
3. **Handle loading states** - Show spinners during data fetch
4. **Implement pagination** - Use `hasMore` and `loadMore` for better UX
5. **Error handling** - Always handle errors gracefully
6. **Local state** - Keep filter state locally before applying

## Related Documentation

- [My Reels Guide](/docs/features/reels/my-reels) - Complete feature guide
- [useMyReels Hook](/docs/api/hooks#usemyreels) - Hook API reference
- [fetchMyReels](/docs/packages/core/api#fetchmyreels) - Core method
- [Reels Features](/docs/features/reels/) - All reels features

## Next Steps

- Add edit functionality for reels
- Implement delete with confirmation
- Add analytics tracking
- Create upload/create reel flow
