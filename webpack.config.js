const { readFileSync } = require('fs');

let version;
let name = 'esdk-obs-browserjs';

try {
  const res = JSON.parse(readFileSync('./package.json', { encoding: 'utf-8'}));
  version = res.version;
  name = res.name;
} catch (error) {
  console.log('missing file: package.json')
}

module.exports = {
  mode: "production",
  entry: {
    [`${name}-without-polyfill`]: "./index.js",
    [`${name}`]: ["@babel/polyfill", "./index.js"]
  },
  output: {
    filename: `[name].${version}.min.js`,
    library: {
      name: 'ObsClient',
      type: 'umd',
      export: 'default',
    }
  },
  target: ["web", "es5"],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        use: ["babel-loader?cacheDirectory=true"],
      },
    ],
  }
};
