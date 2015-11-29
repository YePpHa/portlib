var fs = require("fs");
var path = require("path");
var gulp = require('gulp');
var gulpFile = require('gulp-file');
var through = require('through-gulp');
var ClosureCompiler = require("closure-js");

var closureCompilerPath = "./bower_components/closure-compiler/compiler.jar";
var testSrc = ["./src/client/**/*.js", "./test/**/*.js", "./bower_components/closure-library/closure/goog/**/*.js"];
var src = ["./src/client/**/*.js", "./bower_components/closure-library/closure/goog/**/*.js"];

var closureTmp = {};

/**
 * Replace the placeholder token.
 */
function replacePlaceholder(content) {
  return content.replace(/\$\{([^{}]+)\}/g, function(m0, m1){
    var tokens = m1.split(":");
    if (tokens[0] === "closure") {
      var entryPoint = tokens[1];
      if (closureTmp[entryPoint]) return JSON.stringify(closureTmp[entryPoint]);

      var cc = new ClosureCompiler(closureCompilerPath);
      cc.compilationLevel = ClosureCompiler.CompilationLevels.SIMPLE_OPTIMIZATIONS,
      cc.entryPoint = entryPoint;
      cc.onlyClosureDependencies = true;
      cc.files = testSrc;
      cc.outputWrapper = "(function(){%output%})();";

      return JSON.stringify((closureTmp[entryPoint] = cc.build().toString()));
    }

    return m0;
  });
  return content;
}

/** Userscript test extension */
gulp.task("userscript-test", function(){
  var meta = [];
  meta.push("// ==UserScript==");
  meta.push("// @name Port Library Example");
  meta.push("// @namespace https://github.com/YePpHa/portlib");
  meta.push("// @author Jeppe Rune Mortensen <jepperm@gmail.com>");
  meta.push("// @match https://www.youtube.com/*");
  meta.push("// @include https://www.youtube.com/*");
  meta.push("// ==/UserScript==");

  return gulp.src(testSrc)
    .pipe(through.map(function(file) {
      file.contents = new Buffer(replacePlaceholder(file.contents.toString()));
      return file;
    }))
    .pipe(ClosureCompiler.stream("content.user.js", {
      compilationLevel: ClosureCompiler.CompilationLevels.SIMPLE_OPTIMIZATIONS,
      entryPoint: "pl.test.userscript.content",
      onlyClosureDependencies: true,
      outputWrapper: "(function(){%output%})();"
    }, closureCompilerPath))
    .pipe(through.map(function(file) {
      file.contents = new Buffer(meta.join("\n") + "\n\n" + file.contents.toString());
      return file;
    }))
    .pipe(gulp.dest("./dist/userscript"));
});

/** Chrome test extension */
gulp.task("chrome-test", ["chrome-test-content", "chrome-test-page", "chrome-test-manifest"]);

gulp.task('chrome-test-content', function() {
  return gulp.src(testSrc)
    .pipe(ClosureCompiler.stream("content.js", {
      compilationLevel: ClosureCompiler.CompilationLevels.SIMPLE_OPTIMIZATIONS,
      entryPoint: "pl.test.chrome.content",
      onlyClosureDependencies: true
    }, closureCompilerPath))
    .pipe(gulp.dest("./dist/chrome"));
});

gulp.task('chrome-test-page', function() {
  return gulp.src(testSrc)
    .pipe(ClosureCompiler.stream("page.js", {
      compilationLevel: ClosureCompiler.CompilationLevels.SIMPLE_OPTIMIZATIONS,
      entryPoint: "pl.test.chrome.page",
      onlyClosureDependencies: true
    }, closureCompilerPath))
    .pipe(gulp.dest("./dist/chrome"));
});

gulp.task('chrome-test-manifest', function() {
  var opt = {
    "manifest_version": 2,
    "name": "Port Library Test",
    "version": "1.0.1",
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

  return gulpFile("manifest.json", JSON.stringify(opt))
    .pipe(gulp.dest("./dist/chrome"));
});

/** Building exports */
gulp.task('build-export', function(){
  var argv = require('yargs')
  .boolean('useNativePromise')
  .argv;

  return gulp.src(src)
    .pipe(ClosureCompiler.stream("lib.js", {
      compilationLevel: ClosureCompiler.CompilationLevels.ADVANCED_OPTIMIZATIONS,
      entryPoint: "pl.exports",
      onlyClosureDependencies: true,
      defines: {
        "pl.useNativePromise": argv.useNativePromise
      }
    }, closureCompilerPath))
    .pipe(through.map(function(file) {
      var contents = fs.readFileSync('./src/wrapper.js').toString()
                    .replace("%output%", file.contents.toString())
      file.contents = new Buffer(contents);
      return file;
    }))
    .pipe(gulp.dest("./dist"));
});
