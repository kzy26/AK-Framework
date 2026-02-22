# Cache Strategy Skill

> Redis Caching Patterns & Optimization

## Capability

This skill provides knowledge of:
- Cache-aside, write-through, and write-behind patterns
- Redis data structures for different use cases
- TTL strategies for different data types
- Cache invalidation patterns
- Performance monitoring

## Caching Decision Matrix

### When to Cache:
```
- Frequently read, infrequently written data
- Expensive database queries
- External API responses
- Session data
- Computed results (aggregations, reports)
```

### When NOT to Cache:
```
- Constantly changing data
- Security-sensitive data (without encryption)
- Data with complex invalidation requirements
- Write-heavy operations
- Small, fast queries (overhead not worth it)
```

## TTL Strategy Table

| Data Type | TTL | Pattern |
|-----------|-----|---------|
| Session tokens | 24h (86400s) | Cache-aside |
| User profiles | 15min (900s) | Write-through |
| List/pagination | 5min (300s) | Cache-aside |
| Static config | 1h (3600s) | Cache-aside |
| Dashboard stats | 2min (120s) | Cache-aside |
| Search results | 5min (300s) | Cache-aside |
| Rate limit counters | 1min (60s) | Atomic increment |

## Redis Data Structures

### String (Most Common)
```
Use for: Simple key-value, JSON objects, counters
Commands: GET, SET, INCR, EXPIRE
```

### Hash
```
Use for: Object fields that update independently
Commands: HGET, HSET, HGETALL, HDEL
Example: user:{id} -> { name, email, role }
```

### Set
```
Use for: Unique collections, tags, memberships
Commands: SADD, SREM, SMEMBERS, SISMEMBER
Example: user:{id}:roles -> { "admin", "editor" }
```

### Sorted Set
```
Use for: Rankings, leaderboards, time-based data
Commands: ZADD, ZRANGE, ZRANK, ZRANGEBYSCORE
Example: leaderboard:monthly -> { score: userId }
```

### List
```
Use for: Queues, recent items, activity feeds
Commands: LPUSH, RPOP, LRANGE, LTRIM
Example: user:{id}:notifications -> [notification1, ...]
```

## Key Naming Convention

```
Format: {service}:{entity}:{id}:{qualifier}

Examples:
  user:profile:usr_abc123
  user:list:page:1:limit:20
  product:detail:prod_xyz789
  session:token:sess_abc123
  rate:limit:ip:192.168.1.1
  stats:dashboard:daily:2024-01-15
```

## Cache Invalidation Patterns

### 1. Time-Based (TTL)
```
Simplest approach - cache expires after TTL
Good for: Dashboard stats, search results
```

### 2. Event-Based
```typescript
// On data change, invalidate related caches
async function onUserUpdated(userId: string) {
  await Promise.all([
    redis.del(`user:profile:${userId}`),
    invalidatePattern(`user:list:*`),
  ])
}
```

### 3. Tag-Based
```typescript
// Tag cache entries and invalidate by tag
async function setWithTags(key: string, value: string, tags: string[], ttl: number) {
  await redis.set(key, value, "EX", ttl)
  for (const tag of tags) {
    await redis.sadd(`tag:${tag}`, key)
  }
}

async function invalidateTag(tag: string) {
  const keys = await redis.smembers(`tag:${tag}`)
  if (keys.length > 0) {
    await redis.del(...keys)
  }
  await redis.del(`tag:${tag}`)
}
```

## Connection Management

```typescript
import Redis from "ioredis"

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || "0"),
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  retryStrategy(times) {
    if (times > 10) return null // Stop retrying
    return Math.min(times * 100, 3000)
  },
})

redis.on("error", (err) => {
  console.error("Redis connection error:", err)
})

redis.on("connect", () => {
  console.log("Redis connected")
})
```

## Performance Tips

```
1. Pipeline multiple commands when possible
2. Use SCAN instead of KEYS in production
3. Keep values under 100KB
4. Monitor memory usage with INFO memory
5. Use connection pooling for high-concurrency
6. Compress large JSON values
7. Use MGET/MSET for batch operations
```
