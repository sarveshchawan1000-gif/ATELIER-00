/**
 * Responsive Image Pipeline Utility
 * Authority: PRD v2.0 §3.4, §9.1
 * Enforces 4:5 aspect ratio dimensions to eliminate Cumulative Layout Shift (CLS <= 0.1).
 */

export interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: string;
}

export function getImageDimensions(targetWidth: number = 800): ImageDimensions {
  const height = Math.round(targetWidth * 1.25); // 4:5 aspect ratio
  return {
    width: targetWidth,
    height: height,
    aspectRatio: '4/5',
  };
}

export function getOptimizedImageUrl(url: string, width: number = 800, format: 'webp' | 'avif' = 'webp'): string {
  if (url.includes('unsplash.com')) {
    return `${url}&w=${width}&fm=${format}&q=80`;
  }
  return url;
}
