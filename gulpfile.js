const gulp = require('gulp');
const babel = require('gulp-babel');
const cleanCSS = require('gulp-clean-css');
const through2 = require('through2');
const htmlmin = require('gulp-htmlmin');

function buildJavaScript() {
    return gulp.src('skill.js')
        .pipe(through2.obj(function (file, _, cb) {
            if (file.isBuffer()) {
                file.contents = Buffer.from(file.contents.toString().replace(/import .*? from .*?;/g, ''));
            }
            cb(null, file);
        }))
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(gulp.dest("dest"));
}

function buildCss() {
    return gulp.src('skill.css')
        .pipe(through2.obj(function (file, _, cb) {
            if (file.isBuffer()) {
                let lines = file.contents.toString().split('\n');
                let temp = '';
                for (let i = 0; i < lines.length; i++) {
                    if (!lines[i].startsWith(' ') && !lines[i].startsWith('}') && lines[i].indexOf('{') !== -1 && lines[i].indexOf('.skin-minerva') === -1) {
                        temp += '.widget ';
                    }
                    temp += lines[i] + '\n';
                }
                file.contents = Buffer.from(temp);
            }
            cb(null, file);
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest("dest"));
}

function buildHtml() {
    return gulp.src('skill.html')
        .pipe(through2.obj(function (file, _, cb) {
            if (file.isBuffer()) {
                file.contents = Buffer.from(file.contents.toString().match(/<body>([\s\S]*)<\/body>/)[1]);
            }
            cb(null, file);
        }))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest("dest"));
}

exports.default = gulp.parallel(buildJavaScript, buildCss, buildHtml);