// https://github.com/shelljs/shelljs#command-reference
// https://devhints.io/shelljs
// https://github.com/shelljs/shelljs/wiki/The-make-utility
require('shelljs/make');

config.fatal = true;
config.verbose = true;

const { execFileSync } = require('child_process');

const packageJson = require('./package.json');

target.all = () => {
  target.clean();
  exec('babel src --out-dir lib -D')
  target.generateTrieJson();
};

target.generateTrieJson = () => {
  env.MODULE_TYPE = 'commonjs';
  exec('node lib/opentype/shapers/generate-data.js');
  exec('node lib/opentype/shapers/gen-use.js');
  exec('node lib/opentype/shapers/gen-indic.js');
};

target.clean = () => {
  rm('-rf', 'lib');
};

/* =============================== Release ================================== */

target.release = () => {
  target.all();
  const tag = `v${packageJson.version}`;
  console.log('Releasing version', tag);
  execFileSync('git', ['tag', tag]);
  execFileSync('git', ['push', '--tags']);

  execFileSync('yarn', ['publish'], { stdio: 'inherit' });
  console.log('🎉   Release of', tag, 'complete! 🎉');
};
