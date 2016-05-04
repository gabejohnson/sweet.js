#!/usr/bin/env node
// usage: ./ast-benchmark.js <filepath>
var fs = require('fs'),
    parse = require('shift-parser').parseModule,
    babel = require('babel-core'),
    toBabel = require('shift-spidermonkey-converter').toSpiderMonkey,
    cg = require('../shift-codegen-js/dist'),
    codeGen = cg.default,
    FormattedCodeGen = cg.FormattedCodeGen;

var filename = process.argv[2];
var code = fs.readFileSync(filename, 'utf-8');
var parsed = parse(code);
var config = {
  babelrc: true,
  filename: filename,
  compact: false
};
// codegen and pass through babel.transform
var start = process.hrtime();
babel.transform(codeGen(parsed, new FormattedCodeGen()), config);
var end = process.hrtime(start);
console.log("time for codegen: "+end[0]+"s, "+end[1]/1000000+"ms");

// shift->babel transform and babel.transformFromAst
start = process.hrtime();
babel.transformFromAst(toBabel(parsed), config);
end = process.hrtime(start);
console.log("time for conversion: "+end[0]+"s, "+end[1]/1000000+"ms");
