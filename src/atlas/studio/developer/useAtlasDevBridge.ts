import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Platform } from "react-native";
import { usePathname } from "expo-router";

import { collectAtlasDiagnostics } from "@/atlas/diagnostics";
import { isAnthropicConfigured } from "@/atlas/config/env";

import {
  ATLAS_DEV_API,
  ATLAS_ROUTE_LABELS,
  pushAtlasDevNotification,
  subscribeAtlasDevNotifications,
  type AtlasDevNotification,
} from "./devEvents";

type DevBridgeState = {
  fps: number;
  memoryMb: number | null;
  currentRoute: string;
  routeLabel: string;
  entityCount: number;
  workflowLabel: string;
  providerLabel: string;
  claudeStatus: "live" | "mock";
  notifications: AtlasDevNotification[];
  overlayOpen: boolean;
  setOverlayOpen: (open: boolean) => void;
  restartAtlas: () => Promise<void>;
};

export function useAtlasDevBridge(): DevBridgeState {
  const pathname = usePathname();
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [fps, setFps] = useState(60);
  const [memoryMb, setMemoryMb] = useState<number | null>(null);
  const [notifications, setNotifications] = useState<AtlasDevNotification[]>([]);
  const previousPath = useRef<string | null>(null);
  const previousClaude = useRef<boolean | null>(null);
  const previousEntityCount = useRef<number | null>(null);
  const previousWorkflowCount = useRef<number | null>(null);
  const previousIssueCount = useRef<number | null>(null);

  const diagnostics = useMemo(() => collectAtlasDiagnostics(), [pathname, overlayOpen]);

  const restartAtlas = useCallback(async () => {
    pushAtlasDevNotification({
      kind: "system",
      title: "Restarting Atlas",
      message: "Runtime restart requested",
    });

    await fetch(`${ATLAS_DEV_API}/atlas/restart`, { method: "POST" }).catch(() => undefined);

    if (Platform.OS === "web") {
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    }
  }, []);

  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      frame += 1;
      if (now - last >= 1000) {
        setFps(frame);
        frame = 0;
        last = now;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    const memory = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory;
    if (!memory) return;

    const timer = setInterval(() => {
      setMemoryMb(Math.round(memory.usedJSHeapSize / (1024 * 1024)));
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    return subscribeAtlasDevNotifications((notification) => {
      setNotifications((current) => [notification, ...current].slice(0, 6));
    });
  }, []);

  useEffect(() => {
    const routeLabel = ATLAS_ROUTE_LABELS[pathname] ?? pathname;
    if (previousPath.current && previousPath.current !== pathname) {
      pushAtlasDevNotification({
        kind: "route",
        title: "Route changed",
        message: routeLabel,
      });
    }
    previousPath.current = pathname;

    void fetch(`${ATLAS_DEV_API}/atlas/session/route`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, label: routeLabel }),
    }).catch(() => undefined);
  }, [pathname]);

  useEffect(() => {
    const claudeLive = isAnthropicConfigured();
    if (previousClaude.current === true && !claudeLive) {
      pushAtlasDevNotification({
        kind: "claude",
        title: "Claude disconnected",
        message: "Falling back to mock provider",
      });
    }
    previousClaude.current = claudeLive;
  }, [overlayOpen]);

  useEffect(() => {
    if (
      previousEntityCount.current !== null &&
      previousEntityCount.current !== diagnostics.entityCount
    ) {
      pushAtlasDevNotification({
        kind: "registry",
        title: "Registry changed",
        message: `Entities · ${diagnostics.entityCount}`,
      });
    }
    previousEntityCount.current = diagnostics.entityCount;

    if (
      previousWorkflowCount.current !== null &&
      previousWorkflowCount.current !== diagnostics.workflows.length
    ) {
      pushAtlasDevNotification({
        kind: "registry",
        title: "Workflow registry updated",
        message: `${diagnostics.workflows.length} workflows loaded`,
      });
    }
    previousWorkflowCount.current = diagnostics.workflows.length;

    if (
      previousIssueCount.current !== null &&
      previousIssueCount.current !== diagnostics.startupIssues.length &&
      diagnostics.startupIssues.length > 0
    ) {
      pushAtlasDevNotification({
        kind: "health",
        title: "Health warning",
        message: `${diagnostics.startupIssues.length} startup issue(s)`,
      });
    }
    previousIssueCount.current = diagnostics.startupIssues.length;
  }, [diagnostics]);

  useEffect(() => {
    if (Platform.OS !== "web") return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.ctrlKey || !event.shiftKey) return;

      if (event.key.toLowerCase() === "d") {
        event.preventDefault();
        setOverlayOpen((value) => !value);
      }

      if (event.key.toLowerCase() === "r") {
        event.preventDefault();
        void restartAtlas();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [restartAtlas]);

  const claudeProvider = diagnostics.liveProviders.find((provider) => provider.id === "claude");
  const workflow = diagnostics.workflows[0];

  return {
    fps,
    memoryMb,
    currentRoute: pathname,
    routeLabel: ATLAS_ROUTE_LABELS[pathname] ?? pathname,
    entityCount: diagnostics.entityCount,
    workflowLabel: workflow?.label ?? "None loaded",
    providerLabel: claudeProvider?.label ?? diagnostics.providers[0]?.label ?? "None",
    claudeStatus: isAnthropicConfigured() && claudeProvider?.transportMode === "live" ? "live" : "mock",
    notifications,
    overlayOpen,
    setOverlayOpen,
    restartAtlas,
  };
}
