module.exports = (api) => {
  api.cache(true);

  return {
    presets: [['@babel/preset-env', { modules: 'commonjs' }]],
    plugins: [
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      ['@babel/plugin-proposal-class-properties']
    ],
    env: {
      test: {
        presets: [['@babel/preset-env', { modules: 'commonjs' }]],
      },
      cover: {
        plugins: ['istanbul']
      }
    }
  };
}
