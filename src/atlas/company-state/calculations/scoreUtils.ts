import type { KpiStatus, KpiTrend } from "../types";

export function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function trendFromScore(score: number, threshold = 70): KpiTrend {
  if (score >= threshold + 5) return "up";
  if (score <= threshold - 5) return "down";
  return "flat";
}

export function statusFromScore(score: number): KpiStatus {
  if (score >= 80) return "healthy";
  if (score >= 60) return "attention";
  return "critical";
}

export function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function buildTimeGreeting(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return "Good morning Robbert";
  if (hour < 18) return "Good day Robbert";
  return "Good evening Robbert";
}
