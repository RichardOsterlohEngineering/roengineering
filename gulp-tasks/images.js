'use strict';

const imagemin = require('gulp-imagemin');

// Returns a WriteableStream to process images
function minify() {
  return imagemin({
    progressive: true,
    interlaced: true
  });
}

module.exports = {
  minify
};
