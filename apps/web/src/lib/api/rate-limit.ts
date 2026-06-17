const windowMs = 60000; // 1 minute
const maxRequests = 10;
let requestTimestamps: number[] = [];

export function canSendMessage(): boolean {
  const now = Date.now();
  requestTimestamps = requestTimestamps.filter(t => now - t < windowMs);
  if (requestTimestamps.length >= maxRequests) {
    return false;
  }
  requestTimestamps.push(now);
  return true;
}

export function getRemainingMessages(): number {
  const now = Date.now();
  requestTimestamps = requestTimestamps.filter(t => now - t < windowMs);
  return Math.max(0, maxRequests - requestTimestamps.length);
}
