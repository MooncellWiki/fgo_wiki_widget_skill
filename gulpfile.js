const gulp = require('gulp');
const babel = require('gulp-babel');
const cleanCSS = require('gulp-clean-css');
const through2 = require('through2');
function buildjs(){
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
function buildcss(){
    return gulp.src('skill.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest("dest"));
}
exports.default = gulp.parallel(buildjs, buildcss);