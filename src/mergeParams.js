import { isNotPriorityParam } from "./isNotPriorityParam.js";
import { copyKey } from './copyKey.js';
import { isPriorityParam } from "./isPriorityParam.js";
import { priorityKeyTarget } from "./priorityKeyTarget.js";

export const mergeParams = (source) => {

  const keys = Object.keys(source);

  if (keys.length === 0) return;

  const target = keys
    .filter(isNotPriorityParam)
    .reduce(copyKey(source), {});

  return keys.filter(isPriorityParam)
    .reduce(
      copyKey(source, priorityKeyTarget),
      target
    );

}

