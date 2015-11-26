var gulp = require('gulp');
var fs = require("fs");

var ClosureCompiler = require("closure-js");

var testSrc = ["./src/**/*.js", "./test/**/*.js", "./bower_components/closure-library/closure/goog/**/*.js"];

gulp.task("test", ["test-content", "test-page", "test-manifest"]);

gulp.task('test-content', function() {
  return gulp.src(testSrc)
    .pipe(ClosureCompiler.stream("content.js", {
      compilationLevel: ClosureCompiler.CompilationLevels.SIMPLE_OPTIMIZATIONS,
      entryPoint: "pl.test.content",
      onlyClosureDependencies: true
    }, "./bower_components/closure-compiler/compiler.jar"))
    .pipe(gulp.dest("./dist"));
});

gulp.task('test-page', function() {
  return gulp.src(testSrc)
    .pipe(ClosureCompiler.stream("page.js", {
      compilationLevel: ClosureCompiler.CompilationLevels.SIMPLE_OPTIMIZATIONS,
      entryPoint: "pl.test.page",
      onlyClosureDependencies: true
    }, "./bower_components/closure-compiler/compiler.jar"))
    .pipe(gulp.dest("./dist"));
});

gulp.task('test-manifest', function() {
  var opt = {
    "manifest_version": 2,
    "name": "Port Library Test",
    "version": "1.0.0",
    "content_scripts": [
      {
        "matches": ["https://www.youtube.com/*"],
        "js": ["content.js"]
      }
    ],
    "web_accessible_resources": [
      "page.js"
    ]
  };
  fs.writeFileSync("./dist/manifest.json", JSON.stringify(opt));
});
