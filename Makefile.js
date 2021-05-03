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

target.releaseNext = () => {
  const version = `${packageJson.version}@next`;
  console.log('Releasing version', version);

  target.all();

  execFileSync('yarn', ['publish', '--tag', 'next', '--access', 'public'], { stdio: 'inherit' });
};

target.releaseLatest = async () => {
  const currentBranch = exec('git rev-parse --abbrev-ref HEAD').stdout.trim();
  if (currentBranch !== 'master') {
    console.error('Must be on `master` branch to cut an @latest release.');
    return;
  }

  const version = `${packageJson.version}@latest`;
  console.log('Releasing version', version);

  target.all();

  execFileSync('yarn', ['publish', '--tag', 'latest', '--access', 'public'], { stdio: 'inherit' });
};
