import { router } from "expo-router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Platform } from "react-native";

import { registerAtlasOsDefaults } from "./registries/registerDefaults";
import type { StudioOsCommandContext } from "./types";

type StudioOsContextValue = {
  paletteOpen: boolean;
  searchOpen: boolean;
  quickActionsOpen: boolean;
  refreshToken: number;
  openPalette: () => void;
  closePalette: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  toggleQuickActions: () => void;
  closeQuickActions: () => void;
  refresh: () => void;
  commandContext: StudioOsCommandContext;
};

const StudioOsContext = createContext<StudioOsContextValue | null>(null);

export function StudioOsProvider({ children }: { children: ReactNode }) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    registerAtlasOsDefaults();
  }, []);

  const refresh = useCallback(() => {
    setRefreshToken((value) => value + 1);
  }, []);

  const commandContext = useMemo<StudioOsCommandContext>(
    () => ({
      navigate: (route: string) => {
        router.push(route as never);
      },
      closePalette: () => {
        setPaletteOpen(false);
        setSearchOpen(false);
      },
      openSearch: () => {
        setPaletteOpen(true);
        setSearchOpen(true);
      },
      refresh,
    }),
    [refresh],
  );

  useEffect(() => {
    if (Platform.OS !== "web") return;

    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if ((event.metaKey || event.ctrlKey) && key === "k") {
        event.preventDefault();
        setPaletteOpen((value) => !value);
        setSearchOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const value = useMemo<StudioOsContextValue>(
    () => ({
      paletteOpen,
      searchOpen,
      quickActionsOpen,
      refreshToken,
      openPalette: () => {
        setPaletteOpen(true);
        setSearchOpen(false);
      },
      closePalette: () => {
        setPaletteOpen(false);
        setSearchOpen(false);
      },
      openSearch: () => {
        setPaletteOpen(true);
        setSearchOpen(true);
      },
      closeSearch: () => setSearchOpen(false),
      toggleQuickActions: () => setQuickActionsOpen((value) => !value),
      closeQuickActions: () => setQuickActionsOpen(false),
      refresh,
      commandContext,
    }),
    [paletteOpen, searchOpen, quickActionsOpen, refreshToken, refresh, commandContext],
  );

  return <StudioOsContext.Provider value={value}>{children}</StudioOsContext.Provider>;
}

export function useStudioOs(): StudioOsContextValue {
  const context = useContext(StudioOsContext);
  if (!context) {
    throw new Error("useStudioOs must be used within StudioOsProvider");
  }
  return context;
}

export function useOptionalStudioOs(): StudioOsContextValue | null {
  return useContext(StudioOsContext);
}
