import type { CompanyModels } from "./types";
import { createMockCompanyModels } from "./mock/mockCompanyModels";

let models: CompanyModels = createMockCompanyModels();

export function getCompanyModels(): CompanyModels {
  return models;
}

export function replaceCompanyModels(next: CompanyModels): CompanyModels {
  models = next;
  return models;
}

export function resetCompanyModels(): CompanyModels {
  models = createMockCompanyModels();
  return models;
}

export function updateCompanyModels(updater: (current: CompanyModels) => CompanyModels): CompanyModels {
  models = updater(models);
  return models;
}
