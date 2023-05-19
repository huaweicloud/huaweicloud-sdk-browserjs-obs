const FileManagerPlugin = require ('filemanager-webpack-plugin');
const { readFileSync } = require('fs');
const { version: _version, zipPackageName = 'huaweicloud-obs-sdk-browserjs', isRelease = 'false', cidBuildTime = Date.now() } = process.env

let version;
let name = 'esdk-obs-browserjs';

try {
  const res = JSON.parse(readFileSync('./package.json', { encoding: 'utf-8'}));
  version = res.version;
  name = res.name;
} catch (error) {
  console.log('missing file: package.json')
}

version = _version ? _version : version;

let zipFileName = zipPackageName;
if (version) {
  zipFileName += `_${version}`;
}
if (isRelease.toLowerCase() === 'false') {
  zipFileName += `-${cidBuildTime}`;
}
zipFileName += '.tar.gz';

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
  },
  plugins: [
    new FileManagerPlugin({
      events: {
        onEnd: {
          archive: [
            { 
              source: '../source',
              destination: `${zipFileName}`,
              format: 'tar',
              options: {
                globOptions: {
                  dot: true,
                  ignore: ['package-lock.json', 'node_modules', 'node_modules/**/*']
                }
              }
            },
          ],
        },
      },
    }),
  ]
};
