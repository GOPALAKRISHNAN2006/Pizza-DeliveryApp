/**
 * Client-side in-memory & session storage API caching with TTL
 */

const memoryCache = new Map();

export const cachedApiCall = async (key, fetcher, ttlMs = 3 * 60 * 1000) => {
  const cached = memoryCache.get(key);
  const now = Date.now();

  if (cached && now - cached.timestamp < ttlMs) {
    return cached.data;
  }

  try {
    const data = await fetcher();
    memoryCache.set(key, { data, timestamp: now });
    return data;
  } catch (err) {
    // If request fails but stale cache exists, return stale cache as fallback
    if (cached) {
      console.warn(`[apiCache] Network request failed for ${key}, using stale cache.`);
      return cached.data;
    }
    throw err;
  }
};

export const clearApiCache = (keyPrefix) => {
  if (!keyPrefix) {
    memoryCache.clear();
    return;
  }
  for (const key of memoryCache.keys()) {
    if (key.startsWith(keyPrefix)) {
      memoryCache.delete(key);
    }
  }
};
