// Adiciona todos os modulos instalados
const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
// Compila os arquivos sass e adiciona prefixos a ele
function compilerSass() {
    return gulp
    .src('src/css/scss/**/*.scss')
    .pipe(sass({outputStyle:'compressed'}))
    .pipe(autoprefixer({
        cascade:false
    }))
    .pipe(gulp.dest('css/'))
    // Serve para dar o hard reload no css
    .pipe(browserSync.stream());
}
// Função de compressão de js

exports.compilerSass = compilerSass;

function gulpJS() {
    return gulp.src('src/js/main/*.js')
    .pipe(concat('main.js'))
    .pipe(babel({
        presets: ['env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('js/'))
    .pipe(browserSync.stream())
}

// gulp.task('mainjs',gulpJS);
exports.gulpJS = gulpJS;

function pluginJS() {
    return gulp
    .src(
        [
            'src/js/plugins/*.js'
        ])
    .pipe(concat('plugins.js'))
    .pipe(gulp.dest('js/'))
    .pipe(browserSync.stream())
}

gulp.task('pluginjs',pluginJS);
exports.pluginJS = pluginJS; 

function browser() {
    browserSync.init({
        proxy:'localhost:8888/temadeteste'
    })
}

exports.browser = browser;

// Função de watch do gulp
function watch() {
    // injeta os arquivos css no sync
    gulp.watch('src/css/scss/**/*.scss',compilerSass)
    gulp.watch('src/js/plugins/**/*.js', pluginJS)
    gulp.watch('src/js/main/**/*.js', gulpJS).on('change',browserSync.reload);
    // para o PHP
    gulp.watch(['*.php','./**/*.php']).on('change',browserSync.reload);

}

// Inicia a tarefa wath

exports.watch = watch;

// Tarefa padrão. Executa ao mesmo tempo as duas tarefas
exports.default = gulp.parallel(watch, browser, compilerSass, gulpJS, pluginJS)