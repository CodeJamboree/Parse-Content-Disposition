export const parseNumber = value => {
  if (value === '') return false;
  const isFloat = value.includes('.');
  try {
    const num = isFloat ? parseFloat(value) : parseInt(value, 10);
    return (isFinite(num) && !isNaN(num)) ? num : false;
  } catch (e) {
  }
  return false;
}