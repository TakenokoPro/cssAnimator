'use strivt'

// ディレクトリ
var path = {
  'rootPath': 'src', // 例）'htdocs/images'
  'htmlPath': 'src/html', // 例）'htdocs/images'
  'sassPath': 'src/sass', // 例）'htdocs/scss'
  'jsPath': 'src/js', // 例）'htdocs/javascripts'
  'imgPath': 'src/img', // 例）'htdocs/images'
  'libPath': 'src/libs', // 例）'htdocs/lib'

  'rootBuildPath': 'docs',
  'htmlBuildPath': 'docs/html', // 例）'htdocs/images'
  'cssBuildPath': 'docs/css', // 例）'htdocs/stylesheets'
  'jsBuildPath': 'docs/js', // 例）'htdocs/stylesheets'
  'imgBuildPath': 'docs/img', // 例）'htdocs/stylesheets'
  'libBuildPath': 'docs/libs', // 例）'htdocs/stylesheets'
}

// 使用パッケージ
var gulp = require('gulp');
var browserify = require('browserify');
var babelify   = require('babelify');
var source = require('vinyl-source-stream');
var sass = require('gulp-sass'); // Sassコンパイル
var postcss = require('gulp-postcss');
var cssnext = require('postcss-cssnext');//ベンダープレフィックス
var webserver = require('gulp-webserver'); // ローカルサーバ起動
var imagemin = require('gulp-imagemin'); // 画像圧縮
var pngquant = require('imagemin-pngquant'); // 画像圧縮
var plumber = require('gulp-plumber'); // コンパイルエラーが出てもwatchを止めない
var eslint = require('gulp-eslint'); //eslint処理

//ローカルサーバー(モック非連動)
gulp.task('webserver', function(){
  gulp.src('docs') // ルート・ディレクトリ
    .pipe(webserver({
      fallback: 'index.html',
      livereload: true,
      directoryListing: false,
      open: true,
      port: 8000,
    }));
});

// ライブラリをパイプ
gulp.task('pipe', function(){
  gulp.src(path.libPath + '/**')
  .pipe(gulp.dest(path.libBuildPath + '/'));
});

// htmlをコンパイル
gulp.task('html', function(){
  gulp.src(path.rootPath + '/index.html')
  .pipe(gulp.dest(path.rootBuildPath + '/'));
  gulp.src(path.htmlPath + '/**/*.html')
  .pipe(gulp.dest(path.htmlBuildPath + '/'));
});

// jsをコンパイル
gulp.task('js', function(){
  browserify({
    entries: [path.jsPath + '/app.js']
  })
  .transform(babelify, {presets: ['es2015']})
  .bundle()
  .pipe(source('main.js'))
  .pipe(gulp.dest(path.jsBuildPath + '/'));
});

gulp.task('eslint', function(){
  return gulp.src([path.jsPath + '/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

// Sassをコンパイルし、ベンダープレフィックスを付与
gulp.task('scss', function() {
  var processors = [
      cssnext()
  ];
  return gulp.src(path.sassPath + '/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(gulp.dest(path.cssBuildPath + '/'))
});


// 画像圧縮
gulp.task('imagemin', function(){
  gulp.src(path.imgPath + '/**')
    .pipe(plumber())
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    }))
    .pipe(gulp.dest(path.imgBuildPath));
});

// ファイル変更監視
gulp.task('watch', function() {
  gulp.watch(path.libPath + '/**', ['pipe']);
  gulp.watch(path.rootPath + '/**/*.html', ['html']);
  gulp.watch(path.sassPath + '/**/*.scss', ['scss']);
  gulp.watch(path.jsPath + '/**/*.js',['js']);
  gulp.watch(path.imgPath + '/**/*',['imagemin']);
});

// タスク実行
gulp.task('default', ['webserver','pipe','html','js','imagemin','scss','eslint','watch']); // デフォルト実行