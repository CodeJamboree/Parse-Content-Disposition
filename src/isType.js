export const isType = name => [
  'attachment',
  'inline',
  'form-data'
].includes(name);