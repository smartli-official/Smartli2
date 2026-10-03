import CryptoJS from 'crypto-js';

export const CACHE_KEY_PREFIX = 'smartli_ai_cache_';

export function generateCacheKey(input: string, requestType: string): string {
  const hash = CryptoJS.SHA256(input + requestType).toString();
  return `${CACHE_KEY_PREFIX}${hash}`;
}

export function getCachedResponse(input: string, requestType: string): string | null {
  const key = generateCacheKey(input, requestType);
  return sessionStorage.getItem(key);
}

export function setCachedResponse(input: string, requestType: string, response: string): void {
  const key = generateCacheKey(input, requestType);
  sessionStorage.setItem(key, response);
}

export function clearAICache(): void {
  Object.keys(sessionStorage)
    .filter(key => key.startsWith(CACHE_KEY_PREFIX))
    .forEach(key => sessionStorage.removeItem(key));
}
