var Util = require('./util');

CodeParse = {
  initCode: function() {
    return (
`{
  "name": "New Step",
  "description": "A new step you just created"
}`);
  },

  syncEditorToState: function(app) {
    code = Util.filterByProperty(app.state.tools, "id", app.state.currentTool)[0].code;
    var codeobj = {};
    try{
      codeobj = JSON.parse(code);
    }catch(e){
      console.log('JSON not valid.');
      Util.filterByProperty(app.state.tools, "id", app.state.currentTool)[0].valid = false;
      app.setState(app.state);
      return;
    }
    Util.filterByProperty(app.state.tools, "id", app.state.currentTool)[0].valid = true;
    Util.filterByProperty(app.state.tools, "id", app.state.currentTool)[0].name = codeobj.name;
    Util.filterByProperty(app.state.tools, "id", app.state.currentTool)[0].description = codeobj.description;
    app.setState(app.state);
  },

  syncStateToEditor: function(app) {
    code = Util.filterByProperty(app.state.tools, "id", app.state.currentTool)[0].code;
    var codeobj = {};
    try{
      codeobj = JSON.parse(code);
    }catch(e){
      console.log('JSON not valid.');
      return;
    }
    codeobj.name = Util.filterByProperty(app.state.tools, "id", app.state.currentTool)[0].name;
    codeobj.description = Util.filterByProperty(app.state.tools, "id", app.state.currentTool)[0].description;
    Util.filterByProperty(app.state.tools, "id", app.state.currentTool)[0].code = JSON.stringify(codeobj, null, "  ");
  },

};

module.exports = CodeParse;
