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
    .src('css/scss/**/*.scss')
    .pipe(sass({outputStyle:'compressed'}))
    .pipe(autoprefixer({
        cascade:false
    }))
    .pipe(gulp.dest('css/'))
    // Serve para dar o hard reload no css
    .pipe(browserSync.stream());
}
// Função de compressão de js

// Tarefa do gulp para a função do scss
// gulp.task('sass',function(done){
//     compilerSass()
//     done()
// });

exports.compilerSass = compilerSass;

function gulpJS() {
    return gulp.src('js/main/*.js')
    .pipe(concat('main.js'))
    .pipe(babel({
        presets: ['@babel/env']
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
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/moment/min/moment.min.js',
            'js/plugins/*.js'
        ])
    .pipe(concat('plugins.js'))
    .pipe(gulp.dest('js/'))
    .pipe(browserSync.stream())
}

gulp.task('pluginjs',pluginJS);
exports.pluginJS = pluginJS; 

function browser() {
    browserSync.init({
        server:{
            baseDir: "./"
        }
    })
}
// Tarefa que faz o live reload na pag
// gulp.task('browser-sync',browser);
exports.browser = browser;

// Função de watch do gulp
function watch() {
    // injeta os arquivos css no sync
    gulp.watch('css/scss/**/*.scss',compilerSass)
    gulp.watch('js/plugins/**/*.js', pluginJS)
    gulp.watch('js/main/**/*.js', gulpJS)
    // Da o reload no html
    gulp.watch('*.html').on('change',browserSync.reload);
}

// Inicia a tarefa wath
// gulp.task('watch',watch);
exports.watch = watch;

// Tarefa padrão. Executa ao mesmo tempo as duas tarefas
// gulp.task('default',gulp.parallel('watch','browser-sync',compilerSass,'mainjs','pluginjs'));
exports.default = gulp.parallel(watch, browser, compilerSass, gulpJS, pluginJS)