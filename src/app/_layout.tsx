import { bootstrapAtlas } from "@/atlas/bootstrap";

bootstrapAtlas();

import { Stack } from "expo-router";
import { DeveloperOverlay } from "@/atlas/studio/developer";

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <DeveloperOverlay />
    </>
  );
}
