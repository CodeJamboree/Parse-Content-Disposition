import { isType } from './isType.js';
import { parseParam } from './parseParam.js';
import { mergeParams } from './mergeParams.js';

const paramPattern = /([a-z][-a-z]*\*?)\s*(=\s*(([^'"\s]+)'')?("([^"]+)"|'([^']+)'|[^;\s"']+))?/ig;

export const parseDisposition = value => {
  if (typeof value !== 'string') return;

  value = value.trim();

  if (value === '') return;

  if (isType(value)) return { type: value };

  return mergeParams(
    Array.from(
      value.matchAll(paramPattern)
    ).reduce(parseParam, {})
  );
}

