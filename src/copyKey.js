export const copyKey = (source, targetKey = sourceKey => sourceKey) => {
  return (target, sourceKey) => {
    const key = targetKey(sourceKey);
    target[key] = source[sourceKey];
    return target;
  }
}