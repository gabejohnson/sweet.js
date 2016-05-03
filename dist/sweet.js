"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.expand = expand;
exports.parse = parse;
exports.compile = compile;

var _shiftReader = require("./shift-reader");

var _shiftReader2 = _interopRequireDefault(_shiftReader);

var _immutable = require("immutable");

var _syntax = require("./syntax");

var _syntax2 = _interopRequireDefault(_syntax);

var _env = require("./env");

var _env2 = _interopRequireDefault(_env);

var _shiftReducer = require("shift-reducer");

var _shiftReducer2 = _interopRequireDefault(_shiftReducer);

var _parseReducer = require("./parse-reducer");

var _parseReducer2 = _interopRequireDefault(_parseReducer);

var _shiftCodegen = require("shift-codegen");

var _shiftCodegen2 = _interopRequireDefault(_shiftCodegen);

var _scope = require("./scope");

var _bindingMap = require("./binding-map.js");

var _bindingMap2 = _interopRequireDefault(_bindingMap);

var _terms = require("./terms");

var _terms2 = _interopRequireDefault(_terms);

var _modules = require("./modules");

var _shiftSpidermonkeyConverter = require("shift-spidermonkey-converter");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function expand(source_661) {
  var options_662 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var bindings_663 = new _bindingMap2.default();
  var reader_664 = new _shiftReader2.default(source_661);
  var modules_665 = new _modules.Modules({ cwd: options_662.cwd, filename: options_662.filename, transform: options_662.transform ? options_662.transform : function (x_667) {
      return { code: x_667 };
    }, moduleResolver: options_662.moduleResolver, moduleLoader: options_662.moduleLoader, bindings: bindings_663 });
  var compiledMod_666 = modules_665.compile(reader_664.read(), options_662.filename);
  return new _terms2.default("Module", { directives: (0, _immutable.List)(), items: compiledMod_666.body }).gen();
}
function parse(source_668) {
  var options_669 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return (0, _shiftReducer2.default)(new _parseReducer2.default({ phase: 0 }), expand(source_668, options_669));
}
function compile(source_670) {
  var options_671 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var ast_672 = parse(source_670, options_671);
  return options_671.transform && !options_671.noBabel ? options_671.transform((0, _shiftSpidermonkeyConverter.toSpiderMonkey)(ast_672), { babelrc: true, filename: options_671.filename }) : { code: (0, _shiftCodegen2.default)(ast_672, new _shiftCodegen.FormattedCodeGen()) };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3N3ZWV0L3N3ZWV0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O1FBWWdCLE0sR0FBQSxNO1FBU0EsSyxHQUFBLEs7UUFHQSxPLEdBQUEsTzs7QUF4QmhCOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUNPLFNBQVMsTUFBVCxDQUFnQixVQUFoQixFQUE4QztBQUFBLE1BQWxCLFdBQWtCLHlEQUFKLEVBQUk7O0FBQ25ELE1BQUksZUFBZSwwQkFBbkI7QUFDQSxNQUFJLGFBQWEsMEJBQVcsVUFBWCxDQUFqQjtBQUNBLE1BQUksY0FBYyxxQkFBWSxFQUFDLEtBQUssWUFBWSxHQUFsQixFQUF1QixVQUFVLFlBQVksUUFBN0MsRUFBdUQsV0FBVyxZQUFZLFNBQVosR0FBd0IsWUFBWSxTQUFwQyxHQUFnRCxVQUFVLEtBQVYsRUFBaUI7QUFDL0osYUFBTyxFQUFDLE1BQU0sS0FBUCxFQUFQO0FBQ0QsS0FGNkIsRUFFM0IsZ0JBQWdCLFlBQVksY0FGRCxFQUVpQixjQUFjLFlBQVksWUFGM0MsRUFFeUQsVUFBVSxZQUZuRSxFQUFaLENBQWxCO0FBR0EsTUFBSSxrQkFBa0IsWUFBWSxPQUFaLENBQW9CLFdBQVcsSUFBWCxFQUFwQixFQUF1QyxZQUFZLFFBQW5ELENBQXRCO0FBQ0EsU0FBTyxvQkFBUyxRQUFULEVBQW1CLEVBQUMsWUFBWSxzQkFBYixFQUFxQixPQUFPLGdCQUFnQixJQUE1QyxFQUFuQixFQUFzRSxHQUF0RSxFQUFQO0FBQ0Q7QUFDTSxTQUFTLEtBQVQsQ0FBZSxVQUFmLEVBQTZDO0FBQUEsTUFBbEIsV0FBa0IseURBQUosRUFBSTs7QUFDbEQsU0FBTyw0QkFBTywyQkFBaUIsRUFBQyxPQUFPLENBQVIsRUFBakIsQ0FBUCxFQUFxQyxPQUFPLFVBQVAsRUFBbUIsV0FBbkIsQ0FBckMsQ0FBUDtBQUNEO0FBQ00sU0FBUyxPQUFULENBQWlCLFVBQWpCLEVBQStDO0FBQUEsTUFBbEIsV0FBa0IseURBQUosRUFBSTs7QUFDcEQsTUFBSSxVQUFVLE1BQU0sVUFBTixFQUFrQixXQUFsQixDQUFkO0FBQ0EsU0FBTyxZQUFZLFNBQVosSUFBeUIsQ0FBQyxZQUFZLE9BQXRDLEdBQWdELFlBQVksU0FBWixDQUFzQixnREFBUSxPQUFSLENBQXRCLEVBQXdDLEVBQUMsU0FBUyxJQUFWLEVBQWdCLFVBQVUsWUFBWSxRQUF0QyxFQUF4QyxDQUFoRCxHQUEySSxFQUFDLE1BQU0sNEJBQVEsT0FBUixFQUFpQixvQ0FBakIsQ0FBUCxFQUFsSjtBQUNEIiwiZmlsZSI6InN3ZWV0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWRlciBmcm9tIFwiLi9zaGlmdC1yZWFkZXJcIjtcbmltcG9ydCB7TGlzdH0gZnJvbSBcImltbXV0YWJsZVwiO1xuaW1wb3J0IFN5bnRheCBmcm9tIFwiLi9zeW50YXhcIjtcbmltcG9ydCBFbnYgZnJvbSBcIi4vZW52XCI7XG5pbXBvcnQgcmVkdWNlIGZyb20gXCJzaGlmdC1yZWR1Y2VyXCI7XG5pbXBvcnQgUGFyc2VSZWR1Y2VyIGZyb20gXCIuL3BhcnNlLXJlZHVjZXJcIjtcbmltcG9ydCBjb2RlZ2VuLCB7Rm9ybWF0dGVkQ29kZUdlbn0gZnJvbSBcInNoaWZ0LWNvZGVnZW5cIjtcbmltcG9ydCB7U2NvcGUsIGZyZXNoU2NvcGV9IGZyb20gXCIuL3Njb3BlXCI7XG5pbXBvcnQgQmluZGluZ01hcCBmcm9tIFwiLi9iaW5kaW5nLW1hcC5qc1wiO1xuaW1wb3J0IFRlcm0gZnJvbSBcIi4vdGVybXNcIjtcbmltcG9ydCB7TW9kdWxlc30gZnJvbSBcIi4vbW9kdWxlc1wiO1xuaW1wb3J0IHt0b1NwaWRlck1vbmtleSBhcyB0b0JhYmVsfSBmcm9tIFwic2hpZnQtc3BpZGVybW9ua2V5LWNvbnZlcnRlclwiO1xuZXhwb3J0IGZ1bmN0aW9uIGV4cGFuZChzb3VyY2VfNjYxLCBvcHRpb25zXzY2MiA9IHt9KSB7XG4gIGxldCBiaW5kaW5nc182NjMgPSBuZXcgQmluZGluZ01hcDtcbiAgbGV0IHJlYWRlcl82NjQgPSBuZXcgUmVhZGVyKHNvdXJjZV82NjEpO1xuICBsZXQgbW9kdWxlc182NjUgPSBuZXcgTW9kdWxlcyh7Y3dkOiBvcHRpb25zXzY2Mi5jd2QsIGZpbGVuYW1lOiBvcHRpb25zXzY2Mi5maWxlbmFtZSwgdHJhbnNmb3JtOiBvcHRpb25zXzY2Mi50cmFuc2Zvcm0gPyBvcHRpb25zXzY2Mi50cmFuc2Zvcm0gOiBmdW5jdGlvbiAoeF82NjcpIHtcbiAgICByZXR1cm4ge2NvZGU6IHhfNjY3fTtcbiAgfSwgbW9kdWxlUmVzb2x2ZXI6IG9wdGlvbnNfNjYyLm1vZHVsZVJlc29sdmVyLCBtb2R1bGVMb2FkZXI6IG9wdGlvbnNfNjYyLm1vZHVsZUxvYWRlciwgYmluZGluZ3M6IGJpbmRpbmdzXzY2M30pO1xuICBsZXQgY29tcGlsZWRNb2RfNjY2ID0gbW9kdWxlc182NjUuY29tcGlsZShyZWFkZXJfNjY0LnJlYWQoKSwgb3B0aW9uc182NjIuZmlsZW5hbWUpO1xuICByZXR1cm4gbmV3IFRlcm0oXCJNb2R1bGVcIiwge2RpcmVjdGl2ZXM6IExpc3QoKSwgaXRlbXM6IGNvbXBpbGVkTW9kXzY2Ni5ib2R5fSkuZ2VuKCk7XG59XG5leHBvcnQgZnVuY3Rpb24gcGFyc2Uoc291cmNlXzY2OCwgb3B0aW9uc182NjkgPSB7fSkge1xuICByZXR1cm4gcmVkdWNlKG5ldyBQYXJzZVJlZHVjZXIoe3BoYXNlOiAwfSksIGV4cGFuZChzb3VyY2VfNjY4LCBvcHRpb25zXzY2OSkpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGUoc291cmNlXzY3MCwgb3B0aW9uc182NzEgPSB7fSkge1xuICBsZXQgYXN0XzY3MiA9IHBhcnNlKHNvdXJjZV82NzAsIG9wdGlvbnNfNjcxKTtcbiAgcmV0dXJuIG9wdGlvbnNfNjcxLnRyYW5zZm9ybSAmJiAhb3B0aW9uc182NzEubm9CYWJlbCA/IG9wdGlvbnNfNjcxLnRyYW5zZm9ybSh0b0JhYmVsKGFzdF82NzIpLCB7YmFiZWxyYzogdHJ1ZSwgZmlsZW5hbWU6IG9wdGlvbnNfNjcxLmZpbGVuYW1lfSkgOiB7Y29kZTogY29kZWdlbihhc3RfNjcyLCBuZXcgRm9ybWF0dGVkQ29kZUdlbil9O1xufVxuIl19