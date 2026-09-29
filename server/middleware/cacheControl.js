/**
 * HTTP Cache-Control & Browser Caching Middleware for Express
 */

/**
 * Public Cache middleware with stale-while-revalidate support
 * @param {number} maxAgeSeconds - Browser cache duration in seconds
 * @param {number} swrSeconds - Stale-while-revalidate window in seconds
 */
export const publicCache = (maxAgeSeconds = 120, swrSeconds = 300) => {
  return (req, res, next) => {
    // Only apply caching to GET and HEAD requests
    if (req.method === "GET" || req.method === "HEAD") {
      res.set({
        "Cache-Control": `public, max-age=${maxAgeSeconds}, stale-while-revalidate=${swrSeconds}`,
        Vary: "Accept-Encoding"
      });
    }
    next();
  };
};

/**
 * No-Store / No-Cache middleware for sensitive or rapidly mutating data (auth, orders, admin mutations)
 */
export const noCache = () => {
  return (req, res, next) => {
    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
      Pragma: "no-cache",
      Expires: "0"
    });
    next();
  };
};

/**
 * Immutable cache middleware for static build assets and images
 * @param {number} days - Number of days to cache
 */
export const immutableCache = (days = 365) => {
  return (req, res, next) => {
    const maxAge = days * 24 * 60 * 60;
    res.set({
      "Cache-Control": `public, max-age=${maxAge}, immutable`,
      Vary: "Accept-Encoding"
    });
    next();
  };
};

export default {
  publicCache,
  noCache,
  immutableCache
};
