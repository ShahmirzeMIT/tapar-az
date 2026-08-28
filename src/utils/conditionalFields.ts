import type { FieldCondition, FieldSchema, ListingAttributes } from '@/types';

/**
 * Evaluates whether a field should be visible given the current form values.
 * This is the core of the "Conditional Field Engine" described in PRD §6.
 */
export function isFieldVisible(field: FieldSchema, values: ListingAttributes): boolean {
  if (!field.showIf) return true;
  return evaluateCondition(field.showIf, values);
}

function evaluateCondition(condition: FieldCondition, values: ListingAttributes): boolean {
  const current = values[condition.field];

  if (condition.equals !== undefined) {
    return current === condition.equals;
  }
  if (condition.notEquals !== undefined) {
    return current !== condition.notEquals;
  }
  if (condition.in !== undefined) {
    if (current === undefined) return false;
    return condition.in.includes(current as string | number);
  }
  return true;
}

/** Returns only the fields that should currently render, in schema order. */
export function visibleFields(fields: FieldSchema[], values: ListingAttributes): FieldSchema[] {
  return fields.filter((f) => isFieldVisible(f, values));
}

/**
 * Strips out attribute values for fields that are currently hidden, so stale
 * data from a previous branch (e.g. battery capacity after switching away
 * from "electric") never gets submitted.
 */
export function pruneHiddenValues(fields: FieldSchema[], values: ListingAttributes): ListingAttributes {
  const visible = new Set(visibleFields(fields, values).map((f) => f.name));
  const result: ListingAttributes = {};
  for (const [key, val] of Object.entries(values)) {
    if (visible.has(key)) result[key] = val;
  }
  return result;
}
