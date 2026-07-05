import { Stack } from "expo-router";

import { StudioOsProvider } from "@/atlas/studio/os/StudioOsContext";
import StudioOsShell from "@/atlas/studio/os/layout/StudioOsShell";

export default function StudioLayout() {
  return (
    <StudioOsProvider>
      <StudioOsShell>
        <Stack screenOptions={{ headerShown: false }} />
      </StudioOsShell>
    </StudioOsProvider>
  );
}
