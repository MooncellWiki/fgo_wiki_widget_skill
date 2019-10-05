const gulp = require('gulp');
const babel = require('gulp-babel');
const cleanCSS = require('gulp-clean-css');
const through2 = require('through2');
const htmlmin = require('gulp-htmlmin');
function buildJavaScript(){
    return gulp.src('skill.js')
        .pipe(through2.obj(function(file, _, cb) {
            if (file.isBuffer()) {
                //console.log(file.contents);
                file.contents =Buffer.from(file.contents.toString().replace(/import .*? from .*?;/g,''));
            }
            cb(null, file);
        }))
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(gulp.dest("dest"));
}
function buildCss(){
    return gulp.src('skill.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest("dest"));
}
function buildHtml(){
    return gulp.src('skill.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest("dest"));
}
exports.default = gulp.parallel(buildJavaScript, buildCss,buildHtml);