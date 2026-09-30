import React, { useState, useEffect, useRef } from "react";

/**
 * Helper to get optimized URL for Unsplash or local images
 */
export const getOptimizedImageUrl = (url, { width, quality = 75 } = {}) => {
  if (!url || typeof url !== "string") return "";

  // If local ingredient image ending in .jpg, try webp preferentially
  if (url.startsWith("/images/ingredients/") && url.endsWith(".jpg")) {
    return url.replace(/\.jpg$/, ".webp");
  }

  // If Unsplash image, inject optimal optimization query params
  if (url.includes("images.unsplash.com")) {
    try {
      const urlObj = new URL(url);
      if (width) urlObj.searchParams.set("w", String(width));
      urlObj.searchParams.set("auto", "format");
      urlObj.searchParams.set("fit", "crop");
      urlObj.searchParams.set("q", String(quality));
      return urlObj.toString();
    } catch {
      return url;
    }
  }

  return url;
};

/**
 * High-performance Optimized Image Component
 * - Lazy loads with native `loading="lazy"` and async decoding
 * - WebP automatic fallback to original JPG/PNG
 * - Smooth skeleton shimmer & fade-in transition
 * - Zero Layout Shift (CLS) with aspect ratio/dimensions container
 * - Graceful error handling
 */
const OptimizedImage = ({
  src,
  alt = "Oasis Pizza Item",
  className = "",
  style = {},
  containerStyle = {},
  width,
  height,
  aspectRatio,
  objectFit = "cover",
  fallbackText,
  fallbackEmoji,
  priority = false, // If true, eager loads (e.g. hero image)
  sizes,
  onError: customOnError
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(!src);
  const [currentSrc, setCurrentSrc] = useState(() => (src ? getOptimizedImageUrl(src, { width }) : ""));
  const imgRef = useRef(null);

  useEffect(() => {
    if (!src) {
      setError(true);
      return;
    }

    setLoaded(false);
    setError(false);

    // Get WebP / optimized URL
    const optimized = getOptimizedImageUrl(src, { width });
    setCurrentSrc(optimized);
  }, [src, width]);

  // Handle fallback if WebP fails to load, try original src
  const handleError = (e) => {
    if (currentSrc !== src && src) {
      // Fallback to original JPG/PNG
      setCurrentSrc(src);
    } else {
      setError(true);
      if (customOnError) customOnError(e);
    }
  };

  // If error occurred and fallback emoji or text is provided
  if (error || !src) {
    return (
      <div
        className={`image-fallback-container ${className}`}
        style={{
          width: width ? `${width}px` : "100%",
          height: height ? `${height}px` : "100%",
          aspectRatio: aspectRatio || undefined,
          background: "rgba(255, 255, 255, 0.04)",
          borderRadius: containerStyle?.borderRadius || style?.borderRadius || "8px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#94a3b8",
          userSelect: "none",
          ...containerStyle
        }}
      >
        <span style={{ fontSize: "2rem", filter: "grayscale(30%)" }}>
          {fallbackEmoji || "🍕"}
        </span>
        {fallbackText && (
          <span style={{ fontSize: "0.75rem", marginTop: "4px", color: "#64748b" }}>
            {fallbackText}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`optimized-image-wrapper ${className}`}
      style={{
        position: "relative",
        overflow: "hidden",
        width: width ? `${width}px` : "100%",
        height: height ? `${height}px` : "100%",
        aspectRatio: aspectRatio || undefined,
        borderRadius: containerStyle?.borderRadius || style?.borderRadius || "8px",
        background: "rgba(0, 0, 0, 0.2)",
        ...containerStyle
      }}
    >
      {/* Skeleton Shimmer Placeholder */}
      {!loaded && (
        <div
          className="skeleton-pulse"
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 100%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
            zIndex: 1
          }}
        />
      )}

      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        sizes={sizes}
        onLoad={() => setLoaded(true)}
        onError={handleError}
        style={{
          width: "100%",
          height: "100%",
          objectFit: objectFit,
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.35s ease, transform 0.35s ease",
          display: "block",
          ...style
        }}
      />

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};

export default OptimizedImage;
