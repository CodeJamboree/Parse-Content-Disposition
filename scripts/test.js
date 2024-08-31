import parseDisposition from "../src/index.js";

const excess = 10;

const main = () => {
  const tests = [
    inlineFilename,
    attachmentSpaceFileName,
    formDataNameSpacedWithSingleQuote,
    priorityParamOverwritesNormalParam,

    decodePriorityParam,
    unknownEncodingExcluded,
    decodeQuotedPriorityParam,
    doNotDecodeWithoutEncodingFlag,
    decodeInline,

    duplicateParams,
    duplicateParamsWithPriority,

    creationDate,
    modificationDate,
    modificationDateInvalid,
    readDate,
    customDate,
    customDateInvalid,

    size,
    sizeInvalid,

    noValidParams,
    unknownNameWithoutValue,

    parseUndefined,
    parseNumber,
    parseObject,
    parseFunction,
    parseBoolean,
    parseEmptyString,
  ];
  const passed = tests.filter(runTest).length;
  const total = tests.length;
  const failed = total - passed;
  if (failed === 0) {
    console.info('All', passed, 'of', total, 'tests passed.');
  } else {
    console.error(passed, 'of', total, 'passed.', failed, 'failed.');
  }
  console.log('done');
}

const runTest = (test, i, a) => {
  const { name } = test;
  try {
    test();
    if (i < excess) {
      console.info(`pass: ${name}`);
    } else if (i === excess) {
      console.info('pass: ...');
    }
    return true;
  } catch (e) {
    console.error(`fail: ${name} ${e}`);
    return false;
  }
}

const inlineFilename = () => {
  const header = `inline filename=file.jpg`;
  const actual = parseDisposition(header);
  expectEqual(actual, { type: 'inline', filename: 'file.jpg' });
}
const attachmentSpaceFileName = () => {
  const header = `attachment; filename="fi le.jpg"`;
  const actual = parseDisposition(header);
  expectEqual(actual, { type: 'attachment', filename: 'fi le.jpg' });
}
const formDataNameSpacedWithSingleQuote = () => {
  const header = `form-data; name = 'field name'`;
  const actual = parseDisposition(header);
  expectEqual(actual, { type: 'form-data', name: 'field name' });
}
const priorityParamOverwritesNormalParam = () => {
  const header = `filename=a.txt filename*=b.txt`;
  const actual = parseDisposition(header);
  expectEqual(actual, { filename: 'b.txt' });
}
const unknownEncodingExcluded = () => {
  const header = `attachment; filename*=base64''8J+SqS5qcGc=`;
  const actual = parseDisposition(header);
  expectEqual(actual, { type: 'attachment' });
}
const decodePriorityParam = () => {
  const header = `filename*=UTF-8''%F0%9F%92%A9.jpg`;
  const actual = parseDisposition(header);
  expectEqual(actual, { filename: '\u{1F4a9}.jpg' });
}
const decodeQuotedPriorityParam = () => {
  const header = `filename*=UTF-8''"%F0%9F%92%A9.jpg"`;
  const actual = parseDisposition(header);
  expectEqual(actual, { filename: '\u{1F4a9}.jpg' });
}
const decodeInline = () => {
  const header = `filename="file.txt*UTF-8''%F0%9F%92%A9.jpg"`;
  const actual = parseDisposition(header);
  expectEqual(actual, { filename: '\u{1F4a9}.jpg' });
}
const doNotDecodeWithoutEncodingFlag = () => {
  const header = `filename=%F0%9F%92%A9.txt;`;
  const actual = parseDisposition(header);
  expectEqual(actual, { filename: '%F0%9F%92%A9.txt' });
}
const duplicateParams = () => {
  const header = `name=1 name=2`;
  const actual = parseDisposition(header);
  expectEqual(actual, { name: '2' });
}
const duplicateParamsWithPriority = () => {
  const header = `name*=1 name*=2 name=3 name=4`;
  const actual = parseDisposition(header);
  expectEqual(actual, { name: '2' });
}

const creationDate = () => {
  let iso8601 = '2024-08-30T23:51:22.818Z';
  const name = 'creation-date';
  const header = `${name}="${iso8601}"`;
  const actual = parseDisposition(header);
  expectEqual(actual, { [name]: new Date(iso8601) });
  if (!(actual[name] instanceof Date)) {
    throw new Error(`Date expected for ${name}. Got ${typeof actual[name]}.`);
  }
}
const modificationDate = () => {
  let iso8601 = '2024-08-30T23:51:22.818Z';
  const name = 'modification-date';
  const header = `${name}="${iso8601}"`;
  const actual = parseDisposition(header);
  expectEqual(actual, { [name]: new Date(iso8601) });
  if (!(actual[name] instanceof Date)) {
    throw new Error(`Date expected for ${name}. Got ${typeof actual[name]}.`);
  }
}
const modificationDateInvalid = () => {
  let invalidDate = 'this is not a date';
  const name = 'modification-date';
  const header = `attachment; ${name}="${invalidDate}"`;
  const actual = parseDisposition(header);
  expectEqual(actual, { type: 'attachment' });
}
const readDate = () => {
  let iso8601 = '2024-08-30T23:51:22.818Z';
  const name = 'read-date';
  const header = `${name}="${iso8601}"`;
  const actual = parseDisposition(header);
  expectEqual(actual, { [name]: new Date(iso8601) });
  if (!(actual[name] instanceof Date)) {
    throw new Error(`Date expected for ${name}. Got ${typeof actual[name]}.`);
  }
}

const size = () => {
  const header = `size="34234234"`;
  const actual = parseDisposition(header);
  expectEqual(actual, { size: 34234234 });
  if (typeof actual.size !== 'number') {
    throw new Error(`Number expected for size. Got ${typeof actual.size}.`);
  }
}
const sizeInvalid = () => {
  const header = `attachment; size="not a number"`;
  const actual = parseDisposition(header);
  expectEqual(actual, { type: 'attachment' });
}

const noValidParams = () => {
  const header = `size="not a number" creation-date="not a date" modification-date='not a date' read-date=invalid`;
  const actual = parseDisposition(header);
  expectEqual(actual, undefined);
}

const customDate = () => {
  let iso8601 = '2024-08-30T23:51:22.818Z';
  const name = 'custom-date';
  const header = `${name}="${iso8601}"`;
  const actual = parseDisposition(header);
  expectEqual(actual, { [name]: new Date(iso8601) });
  if (!(actual[name] instanceof Date)) {
    throw new Error(`Date expected for ${name}. Got ${typeof actual[name]}.`);
  }
}
const customDateInvalid = () => {
  let invalidDate = 'this is not a date';
  const name = 'custom-date';
  const header = `attachment; ${name}="${invalidDate}"`;
  const actual = parseDisposition(header);
  expectEqual(actual, { type: 'attachment', [name]: invalidDate });
}
const parseEmptyString = () => {
  expectEqual(parseDisposition(''), undefined);
}
const parseUndefined = () => {
  expectEqual(parseDisposition(undefined), undefined);
}
const parseNumber = () => {
  expectEqual(parseDisposition(1), undefined);
}
const parseObject = () => {
  expectEqual(parseDisposition({ type: 'attachment' }), undefined);
}
const parseFunction = () => {
  expectEqual(parseDisposition(() => { }), undefined);
}
const parseBoolean = () => {
  expectEqual(parseDisposition(true), undefined);
}

const unknownNameWithoutValue = () => {
  const header = `the example is the test!`;
  const actual = parseDisposition(header);
  expectEqual(actual, {
    the: true,
    example: true,
    is: true,
    test: true
  });
}

const expectEqual = (actualValue, expectedValue) => {
  const actual = JSON.stringify(actualValue, null, '  ');
  const expected = JSON.stringify(expectedValue, null, '  ');
  if (actual !== expected) {
    throw new Error(`Expected ${expected}. Received ${actual}`)
  }
}
main();
