const gulp = require('gulp');
const babel = require('gulp-babel');
const cleanCSS = require('gulp-clean-css');
const through2 = require('through2');
const htmlmin = require('gulp-htmlmin');
const fs = require('fs');
const connect = require('gulp-connect');

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
                file.contents = Buffer.from(file.contents.toString().match(/<body .*?>([\s\S]*)<\/body>/)[1]);
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
        .pipe(gulp.dest("dev"))
        .pipe(connect.reload());
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
        .pipe(gulp.dest("dev"))
        .pipe(connect.reload());
}

function devHtml() {
    let skillIcon = fs.readFileSync('./src/skillIcon.txt', 'utf-8');
    let servantData = fs.readFileSync('./src/servantData.txt', 'utf-8');
    let data = fs.readFileSync('./src/data.txt', 'utf-8');
    let rule = fs.readFileSync('./src/rule.json', 'utf-8');
    return gulp.src('./src/index.html')
        .pipe(through2.obj(function (file, _, cb) {
            if (file.isBuffer()) {
                file.contents = Buffer.from(file.contents.toString()
                    .replace('</body>', '</div></div></div>')
                    .replace(`<body class="mediawiki ltr sitedir-ltr mw-hide-empty-elt skin-vector action-view">`,
                        `<body class="mediawiki ltr sitedir-ltr mw-hide-empty-elt skin-vector action-view"><div id="content" class="mw-body" role="main"><div id="bodyContent" class="mw-body-content"><div id="mw-content-text" lang="zh-CN" dir="ltr" class="mw-content-ltr"><div class="mw-parser-output">`)
                    .replace('<!--{$skillIcon}-->', skillIcon)
                    .replace('<!--{$servantData|regex_replace:"/\\[\\[SMW::[a-z]+\\]\\]/":""}-->', servantData)
                    .replace('[<!--{$data}-->]', data)
                    .replace('<!--{$rule}-->', rule)
                );
            }
            cb(null, file);
        }))
        .pipe(gulp.dest("dev"))
        .pipe(connect.reload());
}

gulp.task('watch', function () {
    connect.server({
        livereload: true,
        port: 8888
    });
    gulp.watch('src/*.js', {ignoreInitial: false}, devJavaScript);
    gulp.watch('src/*.css', {ignoreInitial: false}, devCss);
    gulp.watch('src/*.html', {ignoreInitial: false}, devHtml);
    gulp.watch('src/*.txt', {ignoreInitial: false}, devHtml);
});

exports.build = gulp.parallel(buildJavaScript, buildCss, buildHtml);
