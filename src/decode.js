export const decode = (value, encoding = '') => {
  if ((value ?? '') === '') return value;
  if (encoding === '') return value;
  switch (encoding.toLowerCase()) {
    case 'utf8':
    case 'utf16':
    case 'utf32':
    case 'utf-8':
    case 'utf-16':
    case 'utf-32':
      try {
        return decodeURIComponent(value);
      } catch (e) {
        // URI malformed
        return false;
      }
    default:
      // unknown encoding
      return false;
  }
}