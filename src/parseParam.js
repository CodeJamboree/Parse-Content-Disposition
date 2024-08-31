import { parseDate } from './parseDate.js';
import { parseNumber } from './parseNumber.js';
import { decode } from './decode.js';
import { decodeInline } from './decodeInline.js';
import { isType } from './isType.js';

export const parseParam = (parsed, match = []) => {
  let [, name, , , encoding = '', value, doubleQuoted, singleQuoted] = match;
  const rawValue = doubleQuoted ?? singleQuoted ?? value;
  const decoded = encoding === '' ? decodeInline(rawValue) : decode(rawValue, encoding);
  if (decoded === false) return parsed;
  switch (name) {
    case 'size':
      const num = parseNumber(decoded);
      if (num !== false) parsed[name] = num;
      break;
    case 'creation-date':
    case 'modification-date':
    case 'read-date':
      const date = parseDate(decoded);
      if (date !== false) parsed[name] = date;
      break;
    default:
      if (isType(name)) {
        parsed.type = name;
      } else if (decoded === undefined) {
        parsed[name] = true;
      } else if (name.endsWith('-date')) {
        const date = parseDate(decoded);
        parsed[name] = date ? date : decoded;
      } else {
        parsed[name] = decoded;
      }
      break;
  }
  return parsed;
}
