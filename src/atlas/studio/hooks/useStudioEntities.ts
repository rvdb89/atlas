import { useMemo, useState } from "react";

import { studioDataService } from "../services/studioDataService";

export function useStudioEntities() {
  const [search, setSearch] = useState("");
  const [entityType, setEntityType] = useState<string | undefined>();
  const [status, setStatus] = useState<string | undefined>();
  const [domain, setDomain] = useState<string | undefined>();

  const entities = useMemo(
    () =>
      studioDataService.listEntities({
        search,
        entityType,
        status,
        domain,
        sortBy: "updatedAt",
      }),
    [search, entityType, status, domain],
  );

  const entityTypes = useMemo(
    () => [...new Set(entities.map((entity) => entity.entityType))].sort(),
    [entities],
  );

  const domains = useMemo(
    () => [...new Set(entities.map((entity) => entity.domain))].sort(),
    [entities],
  );

  return {
    entities,
    search,
    setSearch,
    entityType,
    setEntityType,
    status,
    setStatus,
    domain,
    setDomain,
    entityTypes,
    domains,
  };
}
