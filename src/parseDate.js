export const parseDate = (value) => {
  try {
    const parsed = new Date(value);
    if (parsed instanceof Date) {
      return isNaN(parsed) ? false : parsed;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}