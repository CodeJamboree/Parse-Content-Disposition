import { decode } from "./decode.js";

const inlineEncoding = /\*([^'\s]+)''(.+)$/i;

export const decodeInline = value => {
  if ((value ?? '') === '') return value;
  const [, encoding, encoded] = value.match(inlineEncoding) ?? [];
  return decode(encoded ?? value, encoding);
}