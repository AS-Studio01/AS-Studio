/**
 * Vercel Speed Insights
 * Tracks web vitals and performance metrics
 */
import { injectSpeedInsights } from '@vercel/speed-insights';

// Initialize Speed Insights
injectSpeedInsights({
  debug: false,
  sampleRate: 1
});
