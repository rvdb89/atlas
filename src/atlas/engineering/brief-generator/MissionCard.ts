export type MissionTemplateId =
  | "engineering"
  | "brain"
  | "studio"
  | "infrastructure"
  | "ai"
  | "voice"
  | "publishing";

export type MissionCard = {
  mission: string;
  title: string;
  goal: string;
  focus: string[];
  constraints: string[];
  success: string;
  templateId: MissionTemplateId;
};

export type MissionCardParseResult = {
  ok: boolean;
  card?: MissionCard;
  message?: string;
};

const FIELD_ALIASES: Record<string, keyof Omit<MissionCard, "templateId">> = {
  mission: "mission",
  title: "title",
  goal: "goal",
  focus: "focus",
  constraints: "constraints",
  success: "success",
};

function splitLines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function inferTemplateId(missionId: string): MissionTemplateId {
  const prefix = missionId.split("-")[0]?.toUpperCase() ?? "";

  if (prefix === "BRAIN") return "brain";
  if (prefix === "STUDIO") return "studio";
  if (prefix === "INFRA" || prefix === "INF") return "infrastructure";
  if (prefix === "AI") return "ai";
  if (prefix === "VOICE") return "voice";
  if (prefix === "PUB" || prefix === "PUBLISHING") return "publishing";
  return "engineering";
}

function parseListBlock(lines: string[], startIndex: number): { values: string[]; nextIndex: number } {
  const values: string[] = [];
  let index = startIndex;

  while (index < lines.length) {
    const line = lines[index];
    const fieldMatch = line.match(/^([A-Za-z ]+):$/);
    if (fieldMatch) break;
    values.push(line.replace(/^[-•]\s*/, "").trim());
    index += 1;
  }

  return { values, nextIndex: index };
}

function scalarValue(value: string | string[] | undefined): string {
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value)) return value.find((entry) => entry.trim().length > 0)?.trim() ?? "";
  return "";
}

function listValue(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) return value.filter((entry) => entry.trim().length > 0);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

export function parseMissionCard(source: string): MissionCardParseResult {
  const lines = splitLines(source);
  const fields: Partial<Record<keyof Omit<MissionCard, "templateId">, string | string[]>> = {};
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const match = line.match(/^([A-Za-z ]+):\s*(.*)$/);

    if (!match) {
      index += 1;
      continue;
    }

    const rawKey = match[1].trim().toLowerCase();
    const key = FIELD_ALIASES[rawKey];
    if (!key) {
      index += 1;
      continue;
    }

    const inlineValue = match[2].trim();
    if (inlineValue) {
      fields[key] = inlineValue;
      index += 1;
      continue;
    }

    const list = parseListBlock(lines, index + 1);
    fields[key] = list.values;
    index = list.nextIndex;
  }

  const mission = scalarValue(fields.mission);
  const title = scalarValue(fields.title);
  const goal = scalarValue(fields.goal);

  if (!mission || !title || !goal) {
    return {
      ok: false,
      message: "Mission card must include Mission, Title, and Goal fields.",
    };
  }

  const focus = listValue(fields.focus);
  const constraints = listValue(fields.constraints);
  const success = scalarValue(fields.success) || "Mission completed successfully.";

  return {
    ok: true,
    card: {
      mission,
      title,
      goal,
      focus,
      constraints,
      success,
      templateId: inferTemplateId(mission),
    },
  };
}

export const EXAMPLE_MISSION_CARD = `Mission:
BRAIN-004

Title:
Decision Engine

Goal:
Atlas leert beslissingen nemen.

Focus:
Decision Engine
Decision Policies
Decision Registry

Constraints:
Geen breaking changes

Success:
Decision Engine volledig operationeel.`;

export const CURRENT_ENGINEERING_MISSION_CARD = `Mission:
ENG-002

Title:
Mission Brief Generator

Goal:
Atlas genereert zelfstandig complete Architecture Briefs vanuit compacte Mission Cards.

Focus:
Brief Generator
Mission Card parser
Brief templates
Markdown output

Constraints:
Geen breaking changes
Geen AI of Claude API
Alles lokal en rule-based

Success:
Mission Brief Generator volledig operationeel.`;
