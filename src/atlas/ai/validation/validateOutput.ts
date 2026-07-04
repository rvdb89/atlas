import type { OutputSchema, ValidationIssue, ValidationResult } from "../types";

function issue(
  code: string,
  message: string,
  severity: ValidationIssue["severity"] = "error",
  field?: string,
): ValidationIssue {
  return { code, message, severity, field };
}

export function validateAiOutput(output: unknown, schema: OutputSchema): ValidationResult {
  const issues: ValidationIssue[] = [];

  if (output === null || output === undefined) {
    return { valid: false, issues: [issue("empty-output", "AI output is empty")] };
  }

  if (schema.json) {
    if (typeof output !== "object") {
      issues.push(issue("invalid-json", "Expected JSON object output"));
    } else if (schema.fields) {
      for (const field of schema.fields) {
        if (!field.required) continue;
        const record = output as Record<string, unknown>;
        const value = record[field.name];
        if (value === undefined || value === null || value === "") {
          issues.push(issue("missing-field", `Missing required field: ${field.name}`, "error", field.name));
        }
      }
    }
  }

  if (schema.kind === "markdown" || schema.kind === "text") {
    const text = typeof output === "string" ? output : JSON.stringify(output);
    if (!text.trim()) {
      issues.push(issue("empty-text", "Text output is empty"));
    }
    if (schema.minLength && text.trim().length < schema.minLength) {
      issues.push(
        issue("text-too-short", `Output shorter than minimum ${schema.minLength} characters`, "warning"),
      );
    }
  }

  if (typeof output === "string" && output.toLowerCase().includes("error:")) {
    issues.push(issue("provider-error", "Output contains provider error marker", "warning"));
  }

  return {
    valid: !issues.some((entry) => entry.severity === "error"),
    issues,
  };
}

export function validateTokenLimits(
  tokenUsage: { total: number } | undefined,
  maxTokens?: number,
): ValidationIssue[] {
  if (!tokenUsage || !maxTokens) return [];
  if (tokenUsage.total > maxTokens) {
    return [issue("token-limit", `Token usage ${tokenUsage.total} exceeds limit ${maxTokens}`, "warning")];
  }
  return [];
}

export { buildCacheKey } from "../utils/hash";
