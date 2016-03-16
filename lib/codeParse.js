var Util = require('./util');

CodeParse = {
  initCode: function () {
    return `{
  "name": "New Step",
  "description": "A new step you just created"
}`;
  },

  syncEditorToState: function (app) {
    code = Util.filterByProperty(app.state.tools, "id", app.state.currentTool).code;
    var codeobj = {};
    try {
      codeobj = JSON.parse(code);
    } catch (e) {
      console.log('JSON not valid.');
      Util.filterByProperty(app.state.tools, "id", app.state.currentTool).valid = false;
      app.setState(app.state);
      return;
    }
    Util.filterByProperty(app.state.tools, "id", app.state.currentTool).valid = true;
    Util.filterByProperty(app.state.tools, "id", app.state.currentTool).codeobj = codeobj;
    Util.filterByProperty(app.state.tools, "id", app.state.currentTool).name = codeobj.name;
    Util.filterByProperty(app.state.tools, "id", app.state.currentTool).description = codeobj.description;
    app.setState(app.state);
  },

  syncStateToEditor: function (app) {
    code = Util.filterByProperty(app.state.tools, "id", app.state.currentTool).code;
    var codeobj = {};
    try {
      codeobj = JSON.parse(code);
    } catch (e) {
      console.log('JSON not valid.');
      return;
    }
    codeobj.name = Util.filterByProperty(app.state.tools, "id", app.state.currentTool).name;
    codeobj.description = Util.filterByProperty(app.state.tools, "id", app.state.currentTool).description;
    Util.filterByProperty(app.state.tools, "id", app.state.currentTool).codeobj = codeobj;
    Util.filterByProperty(app.state.tools, "id", app.state.currentTool).code = JSON.stringify(codeobj, null, "  ");
  }

};

module.exports = CodeParse;