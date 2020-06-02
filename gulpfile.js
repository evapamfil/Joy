const gulp = require("gulp"),
  htmlmin = require("gulp-htmlmin"),
  sass = require("gulp-sass"),
  postcss = require("gulp-postcss"),
  autoprefixer = require("autoprefixer"),
  cssnano = require("cssnano"),
  babel = require("gulp-babel"),
  uglify = require("gulp-uglify"),
  browserify = require('gulp-browserify'),
  rollup = require('rollup-stream'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  sourcemaps = require("gulp-sourcemaps"),
  cssvariables = require("postcss-css-variables"),
  browserSync = require("browser-sync").create();

let paths = {
  markup: {
    src: "src/*.html",
    dest: "src/bundle"
  },
  styles: {
    src: "src/styles/*.scss",
    dest: "src/bundle"
  },
  scripts: {
    src: "src/scripts/*.js",
    dest: "src/bundle"
  }
};

function markup() {
  return gulp
    .src(paths.markup.src)
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true
      })
    )
    .pipe(gulp.dest(paths.markup.dest))
    .pipe(browserSync.stream());
}

function style() {
  return gulp
    .src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .on("error", sass.logError)
    .pipe(postcss([autoprefixer(), cssnano(), cssvariables()]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

function script() {
  return gulp
    .src(paths.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ["@babel/preset-env"]
      })
    )
    .pipe(browserify())
    .pipe(sourcemaps.write())
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream());

}

// Add browsersync initialization at the start of the watch task
function watch() {
  browserSync.init({
    // You can tell browserSync to use this directory and serve it as a mini-server
    server: {
      baseDir: "./src"
    }
  });
  gulp.watch(paths.styles.src, style);
  gulp.watch(paths.scripts.src, script);

  gulp.watch("src/*.html").on("change", browserSync.reload);
}

// Don't forget to expose the task!
exports.watch = watch;

// Expose the task by exporting it
// This allows you to run it from the commandline using
// $ gulp style
exports.style = style;

/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
var build = gulp.parallel(markup, style, script, watch);

/*
 * You can still use `gulp.task` to expose tasks
 */
gulp.task("build", build);

/*
 * Define default task that can be called by just running `gulp` from cli
 */
gulp.task("default", build);
