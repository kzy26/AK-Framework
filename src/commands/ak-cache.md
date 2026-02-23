# /ak-cache - Cache Command

> **Command:** `/ak-cache [description]` | **Shortcut:** `/ak-c`
> **Agent:** Cache Engineer | **Skill:** cache-strategy

## Mission
วาง Redis caching strategy ที่มีประสิทธิภาพ
Cache-aside, write-through, invalidation, pipeline operations

## Key Naming Convention
```
{service}:{entity}:{id}
Example: app:user:uuid-123, app:merchant:list, session:user:uuid-456
```

## TTL Strategy
| Data Type | TTL | Pattern |
|-----------|-----|---------|
| Session | 24h | Write-through |
| User profile | 1h | Cache-aside |
| API response | 5min | Cache-aside |
| Config/Settings | 1h | Cache-aside |
| Rate limit | per window | Counter |
| Daily limits | until midnight | Counter |

## Critical Rules
1. ioredis client with connection pooling
2. Pipeline for batch operations
3. Proper TTL on ALL cached data
4. Cache invalidation on writes
5. Graceful degradation when Redis unavailable

$ARGUMENTS คือ caching strategy ที่ต้องการ
