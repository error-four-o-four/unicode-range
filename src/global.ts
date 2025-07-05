import parser from './index.js';

declare global {
  var UnicodeParser: typeof parser;
}

globalThis.UnicodeParser = parser;

export {};
