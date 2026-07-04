export type AttributeValueKind =
  | "string"
  | "number"
  | "boolean"
  | "enum"
  | "range"
  | "duration"
  | "temperature"
  | "weight"
  | "percentage"
  | "url"
  | "json";

export type AttributeDefinition = {
  key: string;
  label: string;
  kind: AttributeValueKind;
  unit?: string;
  description?: string;
  enumValues?: string[];
  min?: number;
  max?: number;
  domain?: string;
};

export type AttributeRegistry = {
  register(definition: AttributeDefinition): void;
  get(key: string): AttributeDefinition | undefined;
  list(domain?: string): AttributeDefinition[];
  validateKey(key: string, domain?: string): boolean;
};
