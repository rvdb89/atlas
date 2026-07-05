import type { ComponentType, ReactNode } from "react";

export type StudioOsCommandContext = {
  navigate: (route: string) => void;
  closePalette: () => void;
  openSearch: () => void;
  refresh: () => void;
};

export type StudioOsCommand = {
  id: string;
  label: string;
  group: string;
  keywords?: string[];
  shortcut?: string;
  run: (ctx: StudioOsCommandContext) => void;
};

export type StudioOsSearchResult = {
  id: string;
  title: string;
  subtitle?: string;
  group: string;
  route?: string;
  action?: (ctx: StudioOsCommandContext) => void;
};

export type StudioOsSearchProvider = {
  id: string;
  label: string;
  search: (query: string) => StudioOsSearchResult[];
};

export type StudioOsQuickAction = {
  id: string;
  label: string;
  emoji: string;
  run: (ctx: StudioOsCommandContext) => void;
};

export type StudioOsActivityItem = {
  id: string;
  kind:
    | "workflow-started"
    | "workflow-completed"
    | "entity-created"
    | "knowledge-generated"
    | "draft-published"
    | "provider-changed";
  title: string;
  message: string;
  occurredAt: string;
};

export type StudioOsActivityProvider = {
  id: string;
  label: string;
  list: () => StudioOsActivityItem[];
};

export type MissionControlWidgetProps = {
  compact?: boolean;
};

export type MissionControlWidget = {
  id: string;
  title: string;
  order: number;
  span: "full" | "half";
  component: ComponentType<MissionControlWidgetProps>;
};

export type InspectorPanelDefinition = {
  id: string;
  title: string;
  order: number;
  matchRoute: (pathname: string) => boolean;
  render: () => ReactNode;
};

export type StudioOsStatusSnapshot = {
  atlasVersion: string;
  branch: string;
  claude: "live" | "mock" | "offline";
  environment: string;
  currentModule: string;
  memoryMb: number | null;
  health: string;
};
