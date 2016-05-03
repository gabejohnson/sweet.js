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
  var bAst_673 = (0, _shiftSpidermonkeyConverter.toSpiderMonkey)(ast_672);
  return options_671.transform && !options_671.noBabel ? options_671.transform(bAst_673, { babelrc: true, filename: options_671.filename }) : { code: gen };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3N3ZWV0L3N3ZWV0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O1FBWWdCLE0sR0FBQSxNO1FBU0EsSyxHQUFBLEs7UUFHQSxPLEdBQUEsTzs7QUF4QmhCOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUNPLFNBQVMsTUFBVCxDQUFnQixVQUFoQixFQUE4QztBQUFBLE1BQWxCLFdBQWtCLHlEQUFKLEVBQUk7O0FBQ25ELE1BQUksZUFBZSwwQkFBbkI7QUFDQSxNQUFJLGFBQWEsMEJBQVcsVUFBWCxDQUFqQjtBQUNBLE1BQUksY0FBYyxxQkFBWSxFQUFDLEtBQUssWUFBWSxHQUFsQixFQUF1QixVQUFVLFlBQVksUUFBN0MsRUFBdUQsV0FBVyxZQUFZLFNBQVosR0FBd0IsWUFBWSxTQUFwQyxHQUFnRCxVQUFVLEtBQVYsRUFBaUI7QUFDL0osYUFBTyxFQUFDLE1BQU0sS0FBUCxFQUFQO0FBQ0QsS0FGNkIsRUFFM0IsZ0JBQWdCLFlBQVksY0FGRCxFQUVpQixjQUFjLFlBQVksWUFGM0MsRUFFeUQsVUFBVSxZQUZuRSxFQUFaLENBQWxCO0FBR0EsTUFBSSxrQkFBa0IsWUFBWSxPQUFaLENBQW9CLFdBQVcsSUFBWCxFQUFwQixFQUF1QyxZQUFZLFFBQW5ELENBQXRCO0FBQ0EsU0FBTyxvQkFBUyxRQUFULEVBQW1CLEVBQUMsWUFBWSxzQkFBYixFQUFxQixPQUFPLGdCQUFnQixJQUE1QyxFQUFuQixFQUFzRSxHQUF0RSxFQUFQO0FBQ0Q7QUFDTSxTQUFTLEtBQVQsQ0FBZSxVQUFmLEVBQTZDO0FBQUEsTUFBbEIsV0FBa0IseURBQUosRUFBSTs7QUFDbEQsU0FBTyw0QkFBTywyQkFBaUIsRUFBQyxPQUFPLENBQVIsRUFBakIsQ0FBUCxFQUFxQyxPQUFPLFVBQVAsRUFBbUIsV0FBbkIsQ0FBckMsQ0FBUDtBQUNEO0FBQ00sU0FBUyxPQUFULENBQWlCLFVBQWpCLEVBQStDO0FBQUEsTUFBbEIsV0FBa0IseURBQUosRUFBSTs7QUFDcEQsTUFBSSxVQUFVLE1BQU0sVUFBTixFQUFrQixXQUFsQixDQUFkO0FBQ0EsTUFBSSxXQUFXLGdEQUFRLE9BQVIsQ0FBZjtBQUNBLFNBQU8sWUFBWSxTQUFaLElBQXlCLENBQUMsWUFBWSxPQUF0QyxHQUFnRCxZQUFZLFNBQVosQ0FBc0IsUUFBdEIsRUFBZ0MsRUFBQyxTQUFTLElBQVYsRUFBZ0IsVUFBVSxZQUFZLFFBQXRDLEVBQWhDLENBQWhELEdBQW1JLEVBQUMsTUFBTSxHQUFQLEVBQTFJO0FBQ0QiLCJmaWxlIjoic3dlZXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhZGVyIGZyb20gXCIuL3NoaWZ0LXJlYWRlclwiO1xuaW1wb3J0IHtMaXN0fSBmcm9tIFwiaW1tdXRhYmxlXCI7XG5pbXBvcnQgU3ludGF4IGZyb20gXCIuL3N5bnRheFwiO1xuaW1wb3J0IEVudiBmcm9tIFwiLi9lbnZcIjtcbmltcG9ydCByZWR1Y2UgZnJvbSBcInNoaWZ0LXJlZHVjZXJcIjtcbmltcG9ydCBQYXJzZVJlZHVjZXIgZnJvbSBcIi4vcGFyc2UtcmVkdWNlclwiO1xuaW1wb3J0IGNvZGVnZW4sIHtGb3JtYXR0ZWRDb2RlR2VufSBmcm9tIFwic2hpZnQtY29kZWdlblwiO1xuaW1wb3J0IHtTY29wZSwgZnJlc2hTY29wZX0gZnJvbSBcIi4vc2NvcGVcIjtcbmltcG9ydCBCaW5kaW5nTWFwIGZyb20gXCIuL2JpbmRpbmctbWFwLmpzXCI7XG5pbXBvcnQgVGVybSBmcm9tIFwiLi90ZXJtc1wiO1xuaW1wb3J0IHtNb2R1bGVzfSBmcm9tIFwiLi9tb2R1bGVzXCI7XG5pbXBvcnQge3RvU3BpZGVyTW9ua2V5IGFzIHRvQmFiZWx9IGZyb20gXCJzaGlmdC1zcGlkZXJtb25rZXktY29udmVydGVyXCI7XG5leHBvcnQgZnVuY3Rpb24gZXhwYW5kKHNvdXJjZV82NjEsIG9wdGlvbnNfNjYyID0ge30pIHtcbiAgbGV0IGJpbmRpbmdzXzY2MyA9IG5ldyBCaW5kaW5nTWFwO1xuICBsZXQgcmVhZGVyXzY2NCA9IG5ldyBSZWFkZXIoc291cmNlXzY2MSk7XG4gIGxldCBtb2R1bGVzXzY2NSA9IG5ldyBNb2R1bGVzKHtjd2Q6IG9wdGlvbnNfNjYyLmN3ZCwgZmlsZW5hbWU6IG9wdGlvbnNfNjYyLmZpbGVuYW1lLCB0cmFuc2Zvcm06IG9wdGlvbnNfNjYyLnRyYW5zZm9ybSA/IG9wdGlvbnNfNjYyLnRyYW5zZm9ybSA6IGZ1bmN0aW9uICh4XzY2Nykge1xuICAgIHJldHVybiB7Y29kZTogeF82Njd9O1xuICB9LCBtb2R1bGVSZXNvbHZlcjogb3B0aW9uc182NjIubW9kdWxlUmVzb2x2ZXIsIG1vZHVsZUxvYWRlcjogb3B0aW9uc182NjIubW9kdWxlTG9hZGVyLCBiaW5kaW5nczogYmluZGluZ3NfNjYzfSk7XG4gIGxldCBjb21waWxlZE1vZF82NjYgPSBtb2R1bGVzXzY2NS5jb21waWxlKHJlYWRlcl82NjQucmVhZCgpLCBvcHRpb25zXzY2Mi5maWxlbmFtZSk7XG4gIHJldHVybiBuZXcgVGVybShcIk1vZHVsZVwiLCB7ZGlyZWN0aXZlczogTGlzdCgpLCBpdGVtczogY29tcGlsZWRNb2RfNjY2LmJvZHl9KS5nZW4oKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZShzb3VyY2VfNjY4LCBvcHRpb25zXzY2OSA9IHt9KSB7XG4gIHJldHVybiByZWR1Y2UobmV3IFBhcnNlUmVkdWNlcih7cGhhc2U6IDB9KSwgZXhwYW5kKHNvdXJjZV82NjgsIG9wdGlvbnNfNjY5KSk7XG59XG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZShzb3VyY2VfNjcwLCBvcHRpb25zXzY3MSA9IHt9KSB7XG4gIGxldCBhc3RfNjcyID0gcGFyc2Uoc291cmNlXzY3MCwgb3B0aW9uc182NzEpO1xuICBsZXQgYkFzdF82NzMgPSB0b0JhYmVsKGFzdF82NzIpO1xuICByZXR1cm4gb3B0aW9uc182NzEudHJhbnNmb3JtICYmICFvcHRpb25zXzY3MS5ub0JhYmVsID8gb3B0aW9uc182NzEudHJhbnNmb3JtKGJBc3RfNjczLCB7YmFiZWxyYzogdHJ1ZSwgZmlsZW5hbWU6IG9wdGlvbnNfNjcxLmZpbGVuYW1lfSkgOiB7Y29kZTogZ2VufTtcbn1cbiJdfQ==