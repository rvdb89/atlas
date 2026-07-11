export const V2 = {
  bg: "#030508",
  bgElevated: "#0a0e14",
  bgGlass: "rgba(12, 18, 28, 0.78)",
  bgGlassHover: "rgba(18, 26, 38, 0.88)",
  sidebar: "#060a10",
  sidebarActive: "rgba(56, 189, 248, 0.12)",
  border: "rgba(255, 255, 255, 0.07)",
  borderGlow: "rgba(56, 189, 248, 0.25)",
  text: "#f0f4f8",
  textMuted: "#8b9cb3",
  textDim: "#5a6a7e",
  accent: "#38bdf8",
  accentSoft: "rgba(56, 189, 248, 0.15)",
  accentGlow: "rgba(56, 189, 248, 0.35)",
  success: "#34d399",
  successSoft: "rgba(52, 211, 153, 0.15)",
  warning: "#fbbf24",
  warningSoft: "rgba(251, 191, 36, 0.15)",
  danger: "#f87171",
  dangerSoft: "rgba(248, 113, 113, 0.15)",
  purple: "#a78bfa",
  purpleSoft: "rgba(167, 139, 250, 0.15)",
  heartCore: "#38bdf8",
  heartGlow: "rgba(56, 189, 248, 0.5)",
  heartRing: "rgba(167, 139, 250, 0.4)",
  radius: 14,
  radiusSm: 10,
  radiusLg: 20,
  sidebarWidth: 232,
  commandWidth: 300,
  /** @deprecated use bgGlass */
  panel: "rgba(12, 18, 28, 0.78)",
  /** @deprecated use border */
  panelBorder: "rgba(255, 255, 255, 0.07)",
  /** @deprecated use textDim */
  textSoft: "#5a6a7e",
  /** @deprecated use purple */
  violet: "#a78bfa",
  /** @deprecated use accent */
  gold: "#38bdf8",
} as const;

export type V2Tone = "accent" | "success" | "warning" | "danger" | "purple" | "neutral";

export function toneColor(tone: V2Tone): string {
  switch (tone) {
    case "success":
      return V2.success;
    case "warning":
      return V2.warning;
    case "danger":
      return V2.danger;
    case "purple":
      return V2.purple;
    case "accent":
      return V2.accent;
    default:
      return V2.textMuted;
  }
}

export function toneSoft(tone: V2Tone): string {
  switch (tone) {
    case "success":
      return V2.successSoft;
    case "warning":
      return V2.warningSoft;
    case "danger":
      return V2.dangerSoft;
    case "purple":
      return V2.purpleSoft;
    case "accent":
      return V2.accentSoft;
    default:
      return "rgba(255,255,255,0.06)";
  }
}

export function healthTone(score: number): V2Tone {
  if (score >= 80) return "success";
  if (score >= 60) return "warning";
  return "danger";
}

export function urgencyTone(urgency: string): V2Tone {
  const u = urgency.toLowerCase();
  if (u.includes("high") || u.includes("hoog") || u.includes("critical")) return "danger";
  if (u.includes("medium") || u.includes("normaal")) return "warning";
  return "neutral";
}

export function timeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 5) return "Good night Robbert";
  if (hour < 12) return "Good morning Robbert";
  if (hour < 18) return "Good afternoon Robbert";
  return "Good evening Robbert";
}
