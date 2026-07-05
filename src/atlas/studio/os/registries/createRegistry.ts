export type Registry<T extends { id: string }> = {
  register: (item: T) => void;
  unregister: (id: string) => void;
  list: () => T[];
  get: (id: string) => T | undefined;
};

export function createRegistry<T extends { id: string }>(): Registry<T> {
  const items = new Map<string, T>();

  return {
    register(item) {
      items.set(item.id, item);
    },
    unregister(id) {
      items.delete(id);
    },
    list() {
      return [...items.values()];
    },
    get(id) {
      return items.get(id);
    },
  };
}
