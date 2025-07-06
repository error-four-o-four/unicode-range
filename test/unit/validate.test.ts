import { describe, it, expect } from 'vitest';

import {
  validCasesParse,
  invalidCases,
  type ValidParseCase,
} from '../cases.js';

import { isValidUnicodeRange } from '../../src/validate.js';

describe('validate', () => {
  it('isValidUnicodeRange is a function', () => {
    expect(isValidUnicodeRange).toBeTypeOf('function');
  });

  it('returns a boolean', () => {
    const result = isValidUnicodeRange('U+9');
    expect(result).toBeDefined();
    expect(result).toBe(true);
  });

  it(`accepts a string '${validCasesParse['single codepoint'][0].value}'`, () => {
    expect(() => isValidUnicodeRange(validCasesParse['single codepoint'][0].value)).not.toThrow();
  });

  it(`accepts a string with multiple values '${validCasesParse['multiple values'][0].value}'`, () => {
    expect(() => isValidUnicodeRange(validCasesParse['multiple values'][0].value)).not.toThrow();
  });

  it(`accepts an array of strings '${String(validCasesParse['arrays of strings '][0].value)}'`, () => {
    expect(() => isValidUnicodeRange(validCasesParse['arrays of strings '][0].value)).not.toThrow();
  });

  describe(`returns 'true' for valid values`, () => {
    for (const [caseName, caseValues] of Object.entries(validCasesParse)) {
      describe(caseName, () => {
        it.for<ValidParseCase>(caseValues)(`$value`, ({ value: value }) => {
          expect(isValidUnicodeRange(value)).toBe(true);
        });
      });
    }
  });

  describe(`returns 'false' for invalid values`, () => {
    for (const [caseName, caseValues] of Object.entries(invalidCases)) {
      describe(caseName, () => {
        it.for(caseValues)(`$0`, (value) => {
          expect(isValidUnicodeRange(value)).toBe(false);
        });
      });
    }
  });
});
