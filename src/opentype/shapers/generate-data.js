//
// This script generates a UnicodeTrie containing shaping data derived
// from Unicode properties (currently just for the Arabic shaper).
//
import codepoints from 'codepoints';
import fs from 'fs';
import UnicodeTrieBuilder from 'unicode-trie/builder';
import zlib from 'zlib';

let ShapingClasses = {
  Non_Joining: 0,
  Left_Joining: 1,
  Right_Joining: 2,
  Dual_Joining: 3,
  Join_Causing: 3,
  ALAPH: 4,
  'DALATH RISH': 5,
  Transparent: 6
};

let trie = new UnicodeTrieBuilder;
for (let i = 0; i < codepoints.length; i++) {
  let codepoint = codepoints[i];
  if (codepoint) {
    if (codepoint.joiningGroup === 'ALAPH' || codepoint.joiningGroup === 'DALATH RISH') {
      trie.set(codepoint.code, ShapingClasses[codepoint.joiningGroup] + 1);

    } else if (codepoint.joiningType) {
      trie.set(codepoint.code, ShapingClasses[codepoint.joiningType] + 1);
    }
  }
}

// Trie is serialized suboptimally as JSON so it can be loaded via require,
// allowing unicode-properties to work in the browser
const filePath = __dirname + '/trie.json';
const jsonBase64DeflatedTrie = JSON.stringify(zlib.deflateSync(Buffer.from(trie.toBuffer())).toString('base64'));
fs.writeFileSync(filePath, jsonBase64DeflatedTrie);
