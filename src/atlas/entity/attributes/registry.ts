import type { AttributeDefinition, AttributeRegistry } from "./types";

const attributes = new Map<string, AttributeDefinition>();

export const attributeRegistry: AttributeRegistry = {
  register(definition) {
    attributes.set(definition.key, definition);
  },

  get(key) {
    return attributes.get(key);
  },

  list(domain?: string) {
    const all = [...attributes.values()];
    return domain ? all.filter((entry) => !entry.domain || entry.domain === domain) : all;
  },

  validateKey(key, domain?) {
    const definition = attributes.get(key);
    if (!definition) return true;
    if (!domain) return true;
    return !definition.domain || definition.domain === domain;
  },
};

export function registerAttributeDefinition(definition: AttributeDefinition): void {
  attributeRegistry.register(definition);
}

export function getAttributeDefinition(key: string): AttributeDefinition | undefined {
  return attributeRegistry.get(key);
}

export function listAttributeDefinitions(domain?: string): AttributeDefinition[] {
  return attributeRegistry.list(domain);
}
