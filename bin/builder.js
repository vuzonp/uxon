var path = require('path');
var Builder = require('systemjs-builder');

// var opts = {};

var opts = {
  minify: true,
  sourceMaps: true,
  globalDefs: {
    // DEBUG: true,
  },
};

var resolve = function() {
  console.log('Build complete');
};

var reject = function(err) {
  console.log('Build error');
  console.log(err);
};

var builder = new Builder(
  path.resolve(__dirname, '../lib'),
  path.resolve(__dirname, '../config.js')
);

builder.bundle('core.js', 'dist/uxon.js', opts).then(resolve, reject);
builder.buildStatic('core.js', 'dist/uxon-standalone.js', opts).then(resolve, reject);
