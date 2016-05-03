"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Modules = exports.Module = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _immutable = require("immutable");

var _env = require("./env");

var _env2 = _interopRequireDefault(_env);

var _store = require("./store");

var _store2 = _interopRequireDefault(_store);

var _shiftReader = require("./shift-reader");

var _shiftReader2 = _interopRequireDefault(_shiftReader);

var _ramda = require("ramda");

var _ = _interopRequireWildcard(_ramda);

var _tokenExpander = require("./token-expander.js");

var _tokenExpander2 = _interopRequireDefault(_tokenExpander);

var _bindingMap = require("./binding-map.js");

var _bindingMap2 = _interopRequireDefault(_bindingMap);

var _terms = require("./terms");

var _terms2 = _interopRequireDefault(_terms);

var _loadSyntax = require("./load-syntax");

var _compiler = require("./compiler");

var _compiler2 = _interopRequireDefault(_compiler);

var _transforms = require("./transforms");

var _scope = require("./scope");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Module = exports.Module = function Module(moduleSpecifier_394, importEntries_395, exportEntries_396, body_397) {
  _classCallCheck(this, Module);

  this.moduleSpecifier = moduleSpecifier_394;
  this.importEntries = importEntries_395;
  this.exportEntries = exportEntries_396;
  this.body = body_397;
};

var pragmaRegep_393 = /^\s*#\w*/;

var Modules = exports.Modules = function () {
  function Modules(context_398) {
    _classCallCheck(this, Modules);

    this.compiledModules = new Map();
    this.context = context_398;
    this.context.modules = this;
  }

  _createClass(Modules, [{
    key: "load",
    value: function load(path_399) {
      var mod_400 = this.context.moduleLoader(path_399);
      if (!pragmaRegep_393.test(mod_400)) {
        return (0, _immutable.List)();
      }
      var reader_401 = new _shiftReader2.default(mod_400);
      return reader_401.read().slice(3);
    }
  }, {
    key: "compile",
    value: function compile(stxl_402, path_403) {
      var _this = this;

      if (stxl_402.get(0) && stxl_402.get(0).isIdentifier() && stxl_402.get(0).val() === "#") {
        stxl_402 = stxl_402.slice(3);
      }
      var scope_404 = (0, _scope.freshScope)("top");
      var compiler_405 = new _compiler2.default(0, new _env2.default(), new _store2.default(), _.merge(this.context, { currentScope: [scope_404] }));
      var terms_406 = compiler_405.compile(stxl_402.map(function (s_409) {
        return s_409.addScope(scope_404, _this.context.bindings, 0);
      }));
      var importEntries_407 = [];
      var exportEntries_408 = [];
      terms_406.forEach(function (t_410) {
        _.cond([[_terms.isImport, function (t_411) {
          return importEntries_407.push(t_411);
        }], [_terms.isExport, function (t_412) {
          return exportEntries_408.push(t_412);
        }]])(t_410);
      });
      return new Module(path_403, (0, _immutable.List)(importEntries_407), (0, _immutable.List)(exportEntries_408), terms_406);
    }
  }, {
    key: "loadAndCompile",
    value: function loadAndCompile(rawPath_413) {
      var path_414 = this.context.moduleResolver(rawPath_413, this.context.cwd);
      if (!this.compiledModules.has(path_414)) {
        this.compiledModules.set(path_414, this.compile(this.load(path_414), path_414));
      }
      return this.compiledModules.get(path_414);
    }
  }, {
    key: "visit",
    value: function visit(mod_415, phase_416, store_417) {
      var _this2 = this;

      mod_415.body.forEach(function (term_418) {
        if ((0, _terms.isSyntaxDeclarationStatement)(term_418) || (0, _terms.isExportSyntax)(term_418)) {
          term_418.declaration.declarators.forEach(function (_ref) {
            var binding = _ref.binding;
            var init = _ref.init;

            var val_419 = (0, _loadSyntax.evalCompiletimeValue)(init.gen(), _.merge(_this2.context, { store: store_417, phase: phase_416 + 1 }));
            store_417.set(mod_415.moduleSpecifier + ":" + binding.name.val() + ":" + phase_416, new _transforms.CompiletimeTransform(val_419));
            store_417.set(binding.name.resolve(phase_416), new _transforms.CompiletimeTransform(val_419));
          });
        }
      });
      return store_417;
    }
  }, {
    key: "invoke",
    value: function invoke(mod_420, phase_421, store_422) {
      var body_423 = mod_420.body.map(function (term_425) {
        return term_425.gen();
      });
      var exportsObj_424 = (0, _loadSyntax.evalRuntimeValues)(body_423, _.merge(this.context, { store: store_422, phase: phase_421 }));
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.keys(exportsObj_424)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var key = _step.value;

          store_422.set(mod_420.moduleSpecifier + ":" + key + ":" + phase_421, new _transforms.CompiletimeTransform(exportsObj_424[key]));
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return store_422;
    }
  }]);

  return Modules;
}();
//# sourceMappingURL=data:application/json;base64,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LGlCQUFpQixtQ0FBa0IsUUFBbEIsRUFBNEIsRUFBRSxLQUFGLENBQVEsS0FBSyxPQUFiLEVBQXNCLEVBQUMsT0FBTyxTQUFSLEVBQW1CLE9BQU8sU0FBMUIsRUFBdEIsQ0FBNUIsQ0FBckI7QUFGb0M7QUFBQTtBQUFBOztBQUFBO0FBR3BDLDZCQUFnQixPQUFPLElBQVAsQ0FBWSxjQUFaLENBQWhCLDhIQUE2QztBQUFBLGNBQXBDLEdBQW9DOztBQUMzQyxvQkFBVSxHQUFWLENBQWMsUUFBUSxlQUFSLEdBQTBCLEdBQTFCLEdBQWdDLEdBQWhDLEdBQXNDLEdBQXRDLEdBQTRDLFNBQTFELEVBQXFFLHFDQUF5QixlQUFlLEdBQWYsQ0FBekIsQ0FBckU7QUFDRDtBQUxtQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQU1wQyxhQUFPLFNBQVA7QUFDRCIsImZpbGUiOiJtb2R1bGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtMaXN0fSBmcm9tIFwiaW1tdXRhYmxlXCI7XG5pbXBvcnQgRW52IGZyb20gXCIuL2VudlwiO1xuaW1wb3J0IFN0b3JlIGZyb20gXCIuL3N0b3JlXCI7XG5pbXBvcnQgUmVhZGVyIGZyb20gXCIuL3NoaWZ0LXJlYWRlclwiO1xuaW1wb3J0ICAqIGFzIF8gZnJvbSBcInJhbWRhXCI7XG5pbXBvcnQgVG9rZW5FeHBhbmRlciBmcm9tIFwiLi90b2tlbi1leHBhbmRlci5qc1wiO1xuaW1wb3J0IEJpbmRpbmdNYXAgZnJvbSBcIi4vYmluZGluZy1tYXAuanNcIjtcbmltcG9ydCBUZXJtLCB7aXNFT0YsIGlzQmluZGluZ0lkZW50aWZpZXIsIGlzRnVuY3Rpb25EZWNsYXJhdGlvbiwgaXNGdW5jdGlvbkV4cHJlc3Npb24sIGlzRnVuY3Rpb25UZXJtLCBpc0Z1bmN0aW9uV2l0aE5hbWUsIGlzU3ludGF4RGVjbGFyYXRpb24sIGlzU3ludGF4cmVjRGVjbGFyYXRpb24sIGlzVmFyaWFibGVEZWNsYXJhdGlvbiwgaXNWYXJpYWJsZURlY2xhcmF0aW9uU3RhdGVtZW50LCBpc0ltcG9ydCwgaXNFeHBvcnQsIGlzRXhwb3J0U3ludGF4LCBpc1N5bnRheERlY2xhcmF0aW9uU3RhdGVtZW50fSBmcm9tIFwiLi90ZXJtc1wiO1xuaW1wb3J0IHtldmFsQ29tcGlsZXRpbWVWYWx1ZSwgZXZhbFJ1bnRpbWVWYWx1ZXN9IGZyb20gXCIuL2xvYWQtc3ludGF4XCI7XG5pbXBvcnQgQ29tcGlsZXIgZnJvbSBcIi4vY29tcGlsZXJcIjtcbmltcG9ydCB7VmFyQmluZGluZ1RyYW5zZm9ybSwgQ29tcGlsZXRpbWVUcmFuc2Zvcm19IGZyb20gXCIuL3RyYW5zZm9ybXNcIjtcbmltcG9ydCB7U2NvcGUsIGZyZXNoU2NvcGV9IGZyb20gXCIuL3Njb3BlXCI7XG5leHBvcnQgY2xhc3MgTW9kdWxlIHtcbiAgY29uc3RydWN0b3IobW9kdWxlU3BlY2lmaWVyXzM5NCwgaW1wb3J0RW50cmllc18zOTUsIGV4cG9ydEVudHJpZXNfMzk2LCBib2R5XzM5Nykge1xuICAgIHRoaXMubW9kdWxlU3BlY2lmaWVyID0gbW9kdWxlU3BlY2lmaWVyXzM5NDtcbiAgICB0aGlzLmltcG9ydEVudHJpZXMgPSBpbXBvcnRFbnRyaWVzXzM5NTtcbiAgICB0aGlzLmV4cG9ydEVudHJpZXMgPSBleHBvcnRFbnRyaWVzXzM5NjtcbiAgICB0aGlzLmJvZHkgPSBib2R5XzM5NztcbiAgfVxufVxuY29uc3QgcHJhZ21hUmVnZXBfMzkzID0gL15cXHMqI1xcdyovO1xuZXhwb3J0IGNsYXNzIE1vZHVsZXMge1xuICBjb25zdHJ1Y3Rvcihjb250ZXh0XzM5OCkge1xuICAgIHRoaXMuY29tcGlsZWRNb2R1bGVzID0gbmV3IE1hcDtcbiAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0XzM5ODtcbiAgICB0aGlzLmNvbnRleHQubW9kdWxlcyA9IHRoaXM7XG4gIH1cbiAgbG9hZChwYXRoXzM5OSkge1xuICAgIGxldCBtb2RfNDAwID0gdGhpcy5jb250ZXh0Lm1vZHVsZUxvYWRlcihwYXRoXzM5OSk7XG4gICAgaWYgKCFwcmFnbWFSZWdlcF8zOTMudGVzdChtb2RfNDAwKSkge1xuICAgICAgcmV0dXJuIExpc3QoKTtcbiAgICB9XG4gICAgbGV0IHJlYWRlcl80MDEgPSBuZXcgUmVhZGVyKG1vZF80MDApO1xuICAgIHJldHVybiByZWFkZXJfNDAxLnJlYWQoKS5zbGljZSgzKTtcbiAgfVxuICBjb21waWxlKHN0eGxfNDAyLCBwYXRoXzQwMykge1xuICAgIGlmIChzdHhsXzQwMi5nZXQoMCkgJiYgc3R4bF80MDIuZ2V0KDApLmlzSWRlbnRpZmllcigpICYmIHN0eGxfNDAyLmdldCgwKS52YWwoKSA9PT0gXCIjXCIpIHtcbiAgICAgIHN0eGxfNDAyID0gc3R4bF80MDIuc2xpY2UoMyk7XG4gICAgfVxuICAgIGxldCBzY29wZV80MDQgPSBmcmVzaFNjb3BlKFwidG9wXCIpO1xuICAgIGxldCBjb21waWxlcl80MDUgPSBuZXcgQ29tcGlsZXIoMCwgbmV3IEVudiwgbmV3IFN0b3JlLCBfLm1lcmdlKHRoaXMuY29udGV4dCwge2N1cnJlbnRTY29wZTogW3Njb3BlXzQwNF19KSk7XG4gICAgbGV0IHRlcm1zXzQwNiA9IGNvbXBpbGVyXzQwNS5jb21waWxlKHN0eGxfNDAyLm1hcChzXzQwOSA9PiBzXzQwOS5hZGRTY29wZShzY29wZV80MDQsIHRoaXMuY29udGV4dC5iaW5kaW5ncywgMCkpKTtcbiAgICBsZXQgaW1wb3J0RW50cmllc180MDcgPSBbXTtcbiAgICBsZXQgZXhwb3J0RW50cmllc180MDggPSBbXTtcbiAgICB0ZXJtc180MDYuZm9yRWFjaCh0XzQxMCA9PiB7XG4gICAgICBfLmNvbmQoW1tpc0ltcG9ydCwgdF80MTEgPT4gaW1wb3J0RW50cmllc180MDcucHVzaCh0XzQxMSldLCBbaXNFeHBvcnQsIHRfNDEyID0+IGV4cG9ydEVudHJpZXNfNDA4LnB1c2godF80MTIpXV0pKHRfNDEwKTtcbiAgICB9KTtcbiAgICByZXR1cm4gbmV3IE1vZHVsZShwYXRoXzQwMywgTGlzdChpbXBvcnRFbnRyaWVzXzQwNyksIExpc3QoZXhwb3J0RW50cmllc180MDgpLCB0ZXJtc180MDYpO1xuICB9XG4gIGxvYWRBbmRDb21waWxlKHJhd1BhdGhfNDEzKSB7XG4gICAgbGV0IHBhdGhfNDE0ID0gdGhpcy5jb250ZXh0Lm1vZHVsZVJlc29sdmVyKHJhd1BhdGhfNDEzLCB0aGlzLmNvbnRleHQuY3dkKTtcbiAgICBpZiAoIXRoaXMuY29tcGlsZWRNb2R1bGVzLmhhcyhwYXRoXzQxNCkpIHtcbiAgICAgIHRoaXMuY29tcGlsZWRNb2R1bGVzLnNldChwYXRoXzQxNCwgdGhpcy5jb21waWxlKHRoaXMubG9hZChwYXRoXzQxNCksIHBhdGhfNDE0KSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNvbXBpbGVkTW9kdWxlcy5nZXQocGF0aF80MTQpO1xuICB9XG4gIHZpc2l0KG1vZF80MTUsIHBoYXNlXzQxNiwgc3RvcmVfNDE3KSB7XG4gICAgbW9kXzQxNS5ib2R5LmZvckVhY2godGVybV80MTggPT4ge1xuICAgICAgaWYgKGlzU3ludGF4RGVjbGFyYXRpb25TdGF0ZW1lbnQodGVybV80MTgpIHx8IGlzRXhwb3J0U3ludGF4KHRlcm1fNDE4KSkge1xuICAgICAgICB0ZXJtXzQxOC5kZWNsYXJhdGlvbi5kZWNsYXJhdG9ycy5mb3JFYWNoKCh7YmluZGluZywgaW5pdH0pID0+IHtcbiAgICAgICAgICBsZXQgdmFsXzQxOSA9IGV2YWxDb21waWxldGltZVZhbHVlKGluaXQuZ2VuKCksIF8ubWVyZ2UodGhpcy5jb250ZXh0LCB7c3RvcmU6IHN0b3JlXzQxNywgcGhhc2U6IHBoYXNlXzQxNiArIDF9KSk7XG4gICAgICAgICAgc3RvcmVfNDE3LnNldChtb2RfNDE1Lm1vZHVsZVNwZWNpZmllciArIFwiOlwiICsgYmluZGluZy5uYW1lLnZhbCgpICsgXCI6XCIgKyBwaGFzZV80MTYsIG5ldyBDb21waWxldGltZVRyYW5zZm9ybSh2YWxfNDE5KSk7XG4gICAgICAgICAgc3RvcmVfNDE3LnNldChiaW5kaW5nLm5hbWUucmVzb2x2ZShwaGFzZV80MTYpLCBuZXcgQ29tcGlsZXRpbWVUcmFuc2Zvcm0odmFsXzQxOSkpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gc3RvcmVfNDE3O1xuICB9XG4gIGludm9rZShtb2RfNDIwLCBwaGFzZV80MjEsIHN0b3JlXzQyMikge1xuICAgIGxldCBib2R5XzQyMyA9IG1vZF80MjAuYm9keS5tYXAodGVybV80MjUgPT4gdGVybV80MjUuZ2VuKCkpO1xuICAgIGxldCBleHBvcnRzT2JqXzQyNCA9IGV2YWxSdW50aW1lVmFsdWVzKGJvZHlfNDIzLCBfLm1lcmdlKHRoaXMuY29udGV4dCwge3N0b3JlOiBzdG9yZV80MjIsIHBoYXNlOiBwaGFzZV80MjF9KSk7XG4gICAgZm9yIChsZXQga2V5IG9mIE9iamVjdC5rZXlzKGV4cG9ydHNPYmpfNDI0KSkge1xuICAgICAgc3RvcmVfNDIyLnNldChtb2RfNDIwLm1vZHVsZVNwZWNpZmllciArIFwiOlwiICsga2V5ICsgXCI6XCIgKyBwaGFzZV80MjEsIG5ldyBDb21waWxldGltZVRyYW5zZm9ybShleHBvcnRzT2JqXzQyNFtrZXldKSk7XG4gICAgfVxuICAgIHJldHVybiBzdG9yZV80MjI7XG4gIH1cbn1cbiJdfQ==