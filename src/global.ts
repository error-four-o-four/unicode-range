import parser from './index.js';

declare global {
  var UnicodeRange: typeof parser;
}

globalThis.UnicodeRange = parser;

export {};
