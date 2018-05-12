const babel = require('rollup-plugin-babel');
const fs = require('fs');
const path = require('path');
const babelRc = JSON.parse(fs.readFileSync('.babelrc','utf8'));

export default {
    entry: 'src/index.js',
    plugins: [
        babel({
            babelrc: true,
            exclude: 'node_modules/**'
        })
    ],
    format: 'cjs',
    sourceMap: false,
    external: [ 'bignumber.js', 'extend', 'qrcode' ]
};
