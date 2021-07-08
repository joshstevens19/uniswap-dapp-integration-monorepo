const fs = require('fs');
const nodeSass = require('node-sass');

const result = nodeSass.renderSync({
  file: './uniswap.scss',
  outputStyle: 'compressed',
});

fs.writeFileSync('./uniswap.css', result.css);
