const gulp = require('gulp');
const babel = require('gulp-babel');
const cleanCSS = require('gulp-clean-css');
const through2 = require('through2');
const htmlmin = require('gulp-htmlmin');

function buildJavaScript() {
    return gulp.src('./src/index.js')
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
    return gulp.src('./src/index.css')
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
    return gulp.src('./src/index.html')
        .pipe(through2.obj(function (file, _, cb) {
            if (file.isBuffer()) {
                file.contents = Buffer.from(file.contents.toString().match(/<body>([\s\S]*)<\/body>/)[1]);
            }
            cb(null, file);
        }))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest("dest"));
}


function devJavaScript() {
    return gulp.src('./src/index.js')
        .pipe(through2.obj(function (file, _, cb) {
            if (file.isBuffer()) {
                file.contents = Buffer.from(file.contents.toString().replace(/import .*? from .*?;/g, ''));
            }
            cb(null, file);
        }))
        .pipe(gulp.dest("dev"));
}

function devCss() {
    return gulp.src('./src/index.css')
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
        .pipe(gulp.dest("dev"));
}

function devHtml() {
    return gulp.src('./src/index.html')
        .pipe(gulp.dest("dev"));
}

gulp.task('watch', function () {
    gulp.watch('src/*.js', devJavaScript);
    gulp.watch('src/*.css', devCss());
    gulp.watch('src/*.html', devHtml());
});

exports.build = gulp.parallel(buildJavaScript, buildCss, buildHtml);
