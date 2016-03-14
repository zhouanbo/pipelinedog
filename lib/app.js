var React = require('react');
var ReactDOM = require('react-dom');
var remote = require('remote');
var dialog = remote.require('dialog');

var Util = require('./lib/util');
var FileOperation = require('./lib/fileOperation');
var HeaderPanel = require('./lib/headerPanel');
var ToolPanel = require('./lib/toolPanel');
var CodePanel = require('./lib/codePanel');
var MapPanel = require('./lib/mapPanel');
var FilePanel = require('./lib/filePanel');
var WelcomeScreen = require('./lib/welcomeScreen');

var MainComponent = React.createClass({
  displayName: 'MainComponent',


  getInitialState: function () {
    return {
      workDir: "",
      tools: [[{
        id: 0,
        name: "New Step",
        description: "A new step you just created",
        code: "#Insert Code Here",
        haveloop: false,
        loop: "",
        havecondition: false,
        condition: "",
        upstream: [],
        output: []
      }]],
      lastId: 0,
      files: [{ name: "call.vcf", type: "imported", path: "./call.vcf" }, { name: "result.bed", type: "predicted", path: "/home/me/result.bed" }],
      action: "map",
      currentTool: 0
    };
  },

  openProject: function () {
    FileOperation.openProject(this);
  },
  saveProject: function () {
    FileOperation.saveProject(this);
  },
  importFile: function () {
    FileOperation.importFile(this);
  },
  newProject: function () {
    FileOperation.newProject(this);
  },

  runCode: function (e) {
    console.log("4 clicked");
  },

  exportCode: function () {
    console.log("5 clicked");
  },

  mapCode: function () {
    this.state.action = this.state.action == "map" ? "code" : "map";
    this.setState(this.state);
  },

  addTool: function (e) {
    this.state.lastId++;
    var hierarchy = e.target.getAttribute("tabIndex");
    if (e.target.getAttribute("name") == "bottomplus") {
      hierarchy++;
    }
    if (!this.state.tools[hierarchy]) {
      this.state.tools[hierarchy] = [];
    };
    this.state.tools[hierarchy].push({ id: this.state.lastId, name: "New Step", description: "A new step you just created", code: "#Insert Code Here", upstream: [], downstream: [] });
    this.setState(this.state);
  },

  linkTool: function (e) {
    console.log(e.target.toString());
  },

  toolClick: function (e) {
    this.state.currentTool = e.target.getAttribute("name");
    this.state.action = "code";
    this.setState(this.state);
  },

  inputChange: function (e) {
    if (e.target.getAttribute("name") == "name") {
      Util.filterByProperty(this.state.tools, "id", this.state.currentTool)[0].name = e.target.value;
      this.setState(this.state);
    }
    if (e.target.getAttribute("name") == "description") {
      Util.filterByProperty(this.state.tools, "id", this.state.currentTool)[0].description = e.target.value;
      this.setState(this.state);
    }
    if (e.target.getAttribute("name") == "loop") {
      Util.filterByProperty(this.state.tools, "id", this.state.currentTool)[0].loop = e.target.value;
      this.setState(this.state);
    }
    if (e.target.getAttribute("name") == "condition") {
      Util.filterByProperty(this.state.tools, "id", this.state.currentTool)[0].condition = e.target.value;
      this.setState(this.state);
    }
    if (e.target.getAttribute("name") == "conditioncheck") {
      Util.filterByProperty(this.state.tools, "id", this.state.currentTool)[0].havecondition = e.target.checked;
      this.setState(this.state);
    }
    if (e.target.getAttribute("name") == "loopcheck") {
      Util.filterByProperty(this.state.tools, "id", this.state.currentTool)[0].haveloop = e.target.checked;
      this.setState(this.state);
    }
  },

  editorChange: function (v) {
    Util.filterByProperty(this.state.tools, "id", this.state.currentTool)[0].code = v;
    this.setState(this.state);
    console.log(Util.filterByProperty(this.state.tools, "id", this.state.currentTool)[0].code);
  },

  render: function () {
    return this.state.workDir !== "" ? React.createElement(
      'div',
      { className: 'window' },
      React.createElement(HeaderPanel, {
        openProject: this.openProject,
        saveProject: this.saveProject,
        importFile: this.importFile,
        mapCode: this.mapCode,
        exportCode: this.exportCode,
        runCode: this.runCode
      }),
      React.createElement(
        'div',
        { className: 'window-content' },
        React.createElement(
          'div',
          { className: 'pane-group' },
          React.createElement(ToolPanel, {
            currentTool: this.state.currentTool,
            tools: this.state.tools,
            toolClick: this.toolClick
          }),
          this.state.action === "map" ? React.createElement(MapPanel, {
            addTool: this.addTool,
            linkTool: this.linkTool,
            tools: this.state.tools
          }) : React.createElement(CodePanel, {
            currentTool: this.state.currentTool,
            tools: this.state.tools,
            inputChange: this.inputChange,
            editorChange: this.editorChange
          }),
          React.createElement(FilePanel, {
            files: this.state.files
          })
        )
      )
    ) : React.createElement(
      'div',
      { className: 'window welcomescreen' },
      React.createElement(WelcomeScreen, {
        openProject: this.openProject,
        newProject: this.newProject
      })
    );
  }
});

ReactDOM.render(React.createElement(MainComponent, null), document.getElementById('content'));