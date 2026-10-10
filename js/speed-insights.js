/**
 * Vercel Speed Insights initialization
 * Tracks web vitals and performance metrics
 */
import { injectSpeedInsights } from '@vercel/speed-insights';

// Initialize Speed Insights
injectSpeedInsights({
  debug: false, // Set to true for debug logging in development
});
