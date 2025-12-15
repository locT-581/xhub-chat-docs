---
sidebar_position: 5
title: Trending Search
description: Display trending keywords for search suggestions
tags: [reels, search, trending, keywords, recommendation]
---

# 🔥 Trending Search

Display trending/popular search keywords from the AI recommendation system.

## Overview

The Trending Search feature provides:
- Popular search keywords ranked by relevance score
- Pagination support for large keyword lists
- Auto-refresh with stale-while-revalidate pattern
- Integration with search functionality

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

// Fetch trending keywords
const trending = await client.getTrendingKeywords({ limit: 10 });

console.log('Trending Keywords:');
trending.trending_keywords.forEach((item, index) => {
  console.log(`${index + 1}. ${item.keyword} (${(item.score * 100).toFixed(0)}%)`);
});
```

### Pagination

```typescript
// Initial load
const page1 = await client.getTrendingKeywords({ limit: 10 });

// Load more (if available)
if (page1.has_next) {
  const page2 = await client.getTrendingKeywords({
    cursor: page1.next_cursor,
    limit: 10,
  });
}
```

### Trending Keyword Structure

```typescript
interface TrendingKeyword {
  /** The trending keyword/search term */
  keyword: string;
  /** Relevance/popularity score (0-1, higher = more trending) */
  score: number;
  /** Optional reason explaining why this keyword is trending */
  reason: string;
}

interface TrendingKeywordsResponse {
  /** Whether more keywords are available */
  has_next: boolean;
  /** Pagination cursor for next page */
  next_cursor: string | null;
  /** Array of trending keyword entries */
  trending_keywords: TrendingKeyword[];
}
```

## React Package (@xhub-chat/react)

### Basic Usage

```tsx
import { useTrendingKeywords } from '@xhub-chat/react';

function TrendingSearchPanel() {
  const { keywords, loading, error } = useTrendingKeywords();

  if (loading && keywords.length === 0) {
    return <div>Loading trending keywords...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="trending-panel">
      <h3>🔥 Trending Searches</h3>
      <ul>
        {keywords.map((item, index) => (
          <li key={item.keyword}>
            <span className="rank">{index + 1}</span>
            <span className="keyword">{item.keyword}</span>
            <span className="score">{(item.score * 100).toFixed(0)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### With Search Integration

Combine trending keywords with reels search:

```tsx
import { useTrendingKeywords, useReelsSearch } from '@xhub-chat/react';

function SearchWithTrending() {
  const { keywords, loading } = useTrendingKeywords({ limit: 5 });
  const { search, results, searching } = useReelsSearch();
  const [query, setQuery] = useState('');

  const handleTrendingClick = (keyword: string) => {
    setQuery(keyword);
    search(keyword, 'text');
  };

  const handleSearch = () => {
    if (query.trim()) {
      search(query, 'text');
    }
  };

  return (
    <div className="search-page">
      {/* Search Input */}
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search reels..."
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch} disabled={searching}>
          {searching ? '🔍...' : '🔍'}
        </button>
      </div>

      {/* Trending Keywords (show when no search results) */}
      {!results && (
        <div className="trending-section">
          <h4>🔥 Trending</h4>
          <div className="trending-chips">
            {loading ? (
              <span>Loading...</span>
            ) : (
              keywords.map((item) => (
                <button
                  key={item.keyword}
                  className="chip"
                  onClick={() => handleTrendingClick(item.keyword)}
                >
                  {item.keyword}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Search Results */}
      {results && (
        <div className="search-results">
          <h4>Results for "{query}"</h4>
          {results.map((reel) => (
            <ReelCard key={reel.id} reel={reel} />
          ))}
        </div>
      )}
    </div>
  );
}
```

### Pagination (Load More)

```tsx
import { useTrendingKeywords } from '@xhub-chat/react';

function TrendingKeywordsList() {
  const {
    keywords,
    loading,
    fetching,
    hasMore,
    loadMore,
    refresh,
    refreshing,
  } = useTrendingKeywords({ limit: 10 });

  return (
    <div className="trending-list">
      <div className="header">
        <h3>🔥 Trending Keywords</h3>
        <button onClick={refresh} disabled={refreshing}>
          {refreshing ? '🔄...' : '🔄 Refresh'}
        </button>
      </div>

      {loading && keywords.length === 0 ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <ul>
            {keywords.map((item, index) => (
              <li key={item.keyword}>
                <span className="rank">#{index + 1}</span>
                <span className="keyword">{item.keyword}</span>
                <div className="score-bar">
                  <div 
                    className="fill" 
                    style={{ width: `${item.score * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>

          {hasMore && (
            <button 
              onClick={loadMore} 
              disabled={fetching}
              className="load-more"
            >
              {fetching ? 'Loading...' : 'Load More'}
            </button>
          )}
        </>
      )}
    </div>
  );
}
```

### Custom Refresh Interval

```tsx
import { useTrendingKeywords } from '@xhub-chat/react';
import { useEffect } from 'react';

function AutoRefreshTrending() {
  const { keywords, refresh } = useTrendingKeywords({
    limit: 10,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      refresh();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [refresh]);

  return (
    <div>
      {keywords.map((item) => (
        <span key={item.keyword}>{item.keyword}</span>
      ))}
    </div>
  );
}
```

### Loading States

The `useTrendingKeywords` hook provides 3 different loading states:

```tsx
function TrendingWithStates() {
  const {
    keywords,
    loading,      // true when initial loading
    fetching,     // true when loading more (pagination)
    refreshing,   // true when refreshing (keeps old data visible)
    error,
    loadMore,
    refresh,
    hasMore,
  } = useTrendingKeywords({ limit: 10 });

  return (
    <div>
      {/* Initial loading */}
      {loading && keywords.length === 0 && (
        <Spinner text="Loading trending..." />
      )}

      {/* Keywords list */}
      <ul>
        {keywords.map((item) => (
          <li key={item.keyword}>{item.keyword}</li>
        ))}
      </ul>

      {/* Load more indicator */}
      {fetching && <Spinner size="small" />}

      {/* Refresh indicator (overlay - doesn't hide content) */}
      {refreshing && (
        <div className="refresh-overlay">
          <Spinner text="Refreshing..." />
        </div>
      )}

      {/* Actions */}
      {hasMore && <button onClick={loadMore}>Load More</button>}
      <button onClick={refresh}>Refresh</button>
    </div>
  );
}
```

## API Reference

### Hook: `useTrendingKeywords`

```typescript
function useTrendingKeywords(
  options?: IUseTrendingKeywordsOptions
): IUseTrendingKeywords;

interface IUseTrendingKeywordsOptions {
  /** Number of keywords to load per page (default: 10) */
  limit?: number;
  /** Whether to auto-load trending keywords on mount (default: true) */
  autoLoad?: boolean;
  /** Stale time in milliseconds before auto-refresh (default: 5 minutes) */
  staleTime?: number;
}

interface IUseTrendingKeywords {
  /** Array of trending keywords */
  keywords: TrendingKeyword[];
  /** Whether currently loading keywords (initial load) */
  loading: boolean;
  /** Whether currently fetching more keywords (pagination) */
  fetching: boolean;
  /** Whether currently refreshing (keeps old data visible) */
  refreshing: boolean;
  /** Error if fetch failed */
  error: Error | null;
  /** Whether more keywords are available (pagination) */
  hasMore: boolean;
  /** Load more trending keywords (pagination) */
  loadMore: () => Promise<void>;
  /** Refresh the trending keywords list (reset pagination) */
  refresh: () => Promise<void>;
}
```

### Client Method

```typescript
// Core package method
client.getTrendingKeywords(params?: {
  cursor?: string;
  limit?: number;
}): Promise<TrendingKeywordsResponse>
```

## Best Practices

### 1. Combine with Search

```tsx
// ✅ Good: Show trending when search is empty
function SearchPage() {
  const { keywords } = useTrendingKeywords();
  const { results, query, search } = useReelsSearch();

  return (
    <div>
      {!query && <TrendingChips keywords={keywords} onSelect={search} />}
      {query && <SearchResults results={results} />}
    </div>
  );
}
```

### 2. Limit Initial Load

```tsx
// ✅ Good: Load only what you need
const { keywords } = useTrendingKeywords({ limit: 5 });

// ❌ Bad: Load too many
const { keywords } = useTrendingKeywords({ limit: 100 });
```

### 3. Handle Stale Data

```tsx
// ✅ Good: Use staleTime for SWR pattern
const { keywords, refresh } = useTrendingKeywords({
  staleTime: 5 * 60 * 1000, // Consider data stale after 5 min
});

// Data is served from cache immediately, refreshed in background if stale
```

### 4. Error Handling

```tsx
function TrendingSearch() {
  const { keywords, error, refresh } = useTrendingKeywords();

  if (error) {
    return (
      <div className="error">
        <p>Failed to load trending keywords</p>
        <button onClick={refresh}>Try Again</button>
      </div>
    );
  }

  return <TrendingList keywords={keywords} />;
}
```

## UI Examples

### Chip Style

```tsx
function TrendingChips({ keywords, onSelect }) {
  return (
    <div className="trending-chips">
      {keywords.map((item, index) => (
        <button
          key={item.keyword}
          className="chip"
          onClick={() => onSelect(item.keyword)}
        >
          <span className="hot-icon">🔥</span>
          <span className="rank">{index + 1}</span>
          <span className="text">{item.keyword}</span>
        </button>
      ))}
    </div>
  );
}
```

### List with Score Bars

```tsx
function TrendingList({ keywords }) {
  const maxScore = Math.max(...keywords.map(k => k.score));

  return (
    <div className="trending-list">
      {keywords.map((item, index) => (
        <div key={item.keyword} className="item">
          <span className="rank">#{index + 1}</span>
          <span className="keyword">{item.keyword}</span>
          <div className="score-bar">
            <div
              className="fill"
              style={{ width: `${(item.score / maxScore) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Animated Entry

```tsx
function AnimatedTrending({ keywords }) {
  return (
    <div className="trending-animated">
      {keywords.map((item, index) => (
        <div
          key={item.keyword}
          className="item"
          style={{
            animationDelay: `${index * 0.1}s`,
          }}
        >
          {item.keyword}
        </div>
      ))}
    </div>
  );
}
```

```css
.trending-animated .item {
  opacity: 0;
  animation: fadeInUp 0.3s ease forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

## Related

- [Reels Search](./reels-search) - Search reels by text/tag
- [Search History](./search-history) - User's search history
- [Reels Feed](./reels-feed) - Display reels list

[Back to Reels Features](/docs/features/reels/)

