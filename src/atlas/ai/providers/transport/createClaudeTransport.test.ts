import { test } from "node:test";
import assert from "node:assert/strict";

import { isRetryableClaudeError } from "./createClaudeTransport";
import { ClaudeApiError } from "../errors/ClaudeApiError";

/**
 * EXEC-003 · Regression coverage for the BRAIN-010 fix.
 *
 * The real incident (CONTENT-007, technieken): 17 of 22 live Claude calls failed and were
 * silently swapped for mock content, because every failure — retryable or not — fell back to
 * mock on the very first attempt. isRetryableClaudeError() is the exact decision point that
 * now separates "worth a real retry" (rate limit, transient overload, timeout) from "no point
 * retrying" (missing key, invalid response, non-retryable HTTP error). This file pins that
 * behaviour down so a future edit can't quietly widen or narrow it without a test noticing.
 */

test("isRetryableClaudeError: true for rate limit (429)", () => {
  assert.equal(isRetryableClaudeError(new ClaudeApiError("HTTP_ERROR", "rate limited", 429)), true);
});

test("isRetryableClaudeError: true for overloaded (529) and unavailable (503)", () => {
  assert.equal(isRetryableClaudeError(new ClaudeApiError("HTTP_ERROR", "overloaded", 529)), true);
  assert.equal(isRetryableClaudeError(new ClaudeApiError("HTTP_ERROR", "unavailable", 503)), true);
});

test("isRetryableClaudeError: true for TIMEOUT regardless of status code", () => {
  assert.equal(isRetryableClaudeError(new ClaudeApiError("TIMEOUT", "timed out")), true);
});

test("isRetryableClaudeError: false for a non-retryable HTTP status (e.g. 400)", () => {
  assert.equal(isRetryableClaudeError(new ClaudeApiError("HTTP_ERROR", "bad request", 400)), false);
});

test("isRetryableClaudeError: false for HTTP_ERROR with no status code at all", () => {
  assert.equal(isRetryableClaudeError(new ClaudeApiError("HTTP_ERROR", "unknown http failure")), false);
});

test("isRetryableClaudeError: false for non-retryable error codes (key/response/provider)", () => {
  assert.equal(isRetryableClaudeError(new ClaudeApiError("MISSING_API_KEY", "no key")), false);
  assert.equal(isRetryableClaudeError(new ClaudeApiError("INVALID_RESPONSE", "bad shape")), false);
  assert.equal(isRetryableClaudeError(new ClaudeApiError("PROVIDER_UNAVAILABLE", "down")), false);
});

test("isRetryableClaudeError: false for a plain (non-ClaudeApiError) error or non-error value", () => {
  assert.equal(isRetryableClaudeError(new Error("some other failure")), false);
  assert.equal(isRetryableClaudeError("just a string"), false);
  assert.equal(isRetryableClaudeError(undefined), false);
});
