'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var remote = require('electron').remote;
var ipcRenderer = require('electron').ipcRenderer;

var dialog = remote.dialog;

var Menu = remote.Menu;
var path = require('path');
var GitHubApi = require("github");
var open = require("open");

var Util = require('./dist/util');
var Menus = require('./dist/menus');
var CodeParse = require('./dist/codeParse');
var FileOperation = require('./dist/fileOperation');
var HeaderPanel = require('./dist/headerPanel');
var ToolPanel = require('./dist/toolPanel');
var CodePanel = require('./dist/codePanel');
var MapPanel = require('./dist/mapPanel');
var FilePanel = require('./dist/filePanel');
var WelcomeScreen = require('./dist/welcomeScreen');
var Police = require('./dist/police');

var MainComponent = React.createClass({
  displayName: 'MainComponent',


  getInitialState: function getInitialState() {
    return {
      workDir: "",
      lastSaved: "",
      tools: [[this.getNewTool(0)]],
      lastId: 0,
      files: [],
      action: "map",
      showingParsed: false,
      currentTool: 0,
      chose: false,
      choosing: 0,
      command: ""
    };
  },

  getNewTool: function getNewTool(index) {
    return {
      id: index,
      name: "New Step",
      description: "A new step you just created",
      code: CodeParse.initCode(), //the JSON code
      codeobj: {}, //JSON object parsed from the code
      parsedOptions: {}, //LEASH converted options of the tool
      looping: false, //if the command is to run as a loop, or the values to loop
      expressions: [], //direct LEASH parsing result
      options: [], //keys for options
      parsedCommand: "", //the command to finally run
      valid: true, //if the JSON is valid
      output_files: [] //the array of predicted output files path
    };
  },

  componentDidMount: function componentDidMount() {
    var app = this;
    var template = {};
    //App menu
    if (process.platform == 'darwin') {
      template = Menus.macMenu(app);
    } else {
      template = Menus.winMenu(app);
    }
    var menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  },

  //File operations
  openProject: function openProject() {
    FileOperation.openProject(this);
  },
  saveProject: function saveProject() {
    FileOperation.saveProject(this);
  },
  saveAsProject: function saveAsProject() {
    FileOperation.saveAsProject(this);
  },
  importFile: function importFile() {
    FileOperation.importFile(this);
  },
  newProject: function newProject() {
    FileOperation.newProject(this);
  },
  openFile: function openFile(filepath) {
    FileOperation.openFile(filepath);
  },
  deleteFile: function deleteFile(index) {
    dialog.showMessageBox({
      type: "warning",
      buttons: ["Delete", "Cancel"],
      title: "Deletion Warning",
      message: "Are you sure to delete " + this.state.files[index].name + "?"
    }, function (r) {
      if (Number(r) === 0) {
        this.state.files.splice(index, 1);
        this.setState(this.state);
      }
    }.bind(this));
  },

  runCode: function runCode() {
    if (CodeParse.generateCommand(this)) {
      ipcRenderer.send('createRun', this.state.workDir, this.state.command);
    }
  },

  exportCode: function exportCode() {
    if (CodeParse.generateCommand(this)) {
      FileOperation.exportCommand(this);
    }
  },

  insertFile: function insertFile(path) {
    if (!this.state.showingParsed) {
      this.refs.codePanel.refs.ace.editor.insert('"' + path + '"');
      this.refs.codePanel.refs.ace.editor.focus();
    }
  },

  //Mapping workflow
  mapCode: function mapCode() {
    this.state.action = this.state.action == "map" ? "code" : "map";
    this.setState(this.state);
  },
  addTool: function addTool(e) {
    this.state.lastId++;
    var hierarchy = e.target.getAttribute("tabIndex");
    if (e.target.getAttribute("name") == "bottomplus") {
      hierarchy++;
    }
    if (!this.state.tools[hierarchy]) {
      this.state.tools[hierarchy] = [];
    }
    this.state.tools[hierarchy].push(this.getNewTool(this.state.lastId));
    this.setState(this.state);
  },
  deleteTool: function deleteTool(chose, toolid) {
    var id = toolid;
    if (chose) {
      if (this.state.tools[0].length === 1 && this.state.tools.length === 1) {
        dialog.showErrorBox("Deletion Error", "Cannot delete the last node.");
      } else {
        dialog.showMessageBox({
          type: "warning",
          buttons: ["Delete", "Cancel"],
          title: "Deletion Warning",
          message: "Are you sure to delete " + Util.filterByProperty(this.state.tools, "id", this.state.currentTool).name + "?"
        }, function (r) {
          if (Number(r) === 0) {
            Util.deleteById(this.state.tools, id);
            for (var i = 0; i < this.state.tools.length; i++) {
              if (this.state.tools[i].length == 0) {
                this.state.tools.splice(i, 1);
              }
            }
            this.state.chose = false;
            if (this.state.currentTool == id) {
              this.state.currentTool = 0;
              this.state.choosing = 0;
            }
            this.setState(this.state);
          } else {
            return;
          }
        }.bind(this));
      }
    }
  },
  onNodeClick: function onNodeClick(id) {
    if (this.state.chose && this.state.choosing == id) {
      //unselect node
      this.state.chose = false;
    } else if (!this.state.chose) {
      //select node
      this.state.chose = true;
      this.state.choosing = id;
    } else if (this.state.chose && this.state.choosing != id) {
      //select another node
      this.state.choosing = id;
    }
    this.setState(this.state);
  },

  //Tool defining
  toolClick: function toolClick(id) {
    this.state.currentTool = id;
    this.state.action = "code";
    this.state.showingParsed = false;
    CodeParse.syncEditorToState(this); //validate JSON
    this.setState(this.state);
  },
  inputChange: function inputChange(e) {
    if (e.target.getAttribute("name") == "name") {
      Util.filterByProperty(this.state.tools, "id", this.state.currentTool).name = e.target.value;
      Util.filterByProperty(this.state.tools, "id", this.state.currentTool).codeobj.name = e.target.value;
      CodeParse.syncStateToEditor(this);
      this.setState(this.state);
    }
    if (e.target.getAttribute("name") == "description") {
      Util.filterByProperty(this.state.tools, "id", this.state.currentTool).description = e.target.value;
      Util.filterByProperty(this.state.tools, "id", this.state.currentTool).codeobj.description = e.target.value;
      CodeParse.syncStateToEditor(this);
      this.setState(this.state);
    }
  },
  editorChange: function editorChange(v) {
    Util.filterByProperty(this.state.tools, "id", this.state.currentTool).code = v;
    CodeParse.syncEditorToState(this);
    this.setState(this.state);
  },

  //Code parsing
  parseCode: function parseCode() {
    if (!Police.checkToolDefinition(this)) {
      this.refs.codePanel.refs.ace.editor.focus();
      return;
    }
    this.state.showingParsed = true;
    CodeParse.parseToolCommand(this);
    FileOperation.newParse(this);
    this.setState(this.state);
    console.log('showingParsed: ' + this.state.showingParsed);
  },
  editCode: function editCode() {
    this.state.showingParsed = false;
    CodeParse.syncStateToEditor(this);
    this.setState(this.state);
    console.log('showingParsed: ' + this.state.showingParsed);
  },
  exportTool: function exportTool() {
    FileOperation.exportTool(this);
  },
  exportProject: function exportProject() {
    var json = Util.arrayToJSON(this.state.tools);
    FileOperation.exportProject(this, json);
  },
  importTool: function importTool() {
    FileOperation.importTool(this);
    CodeParse.syncEditorToState(this);
    CodeParse.syncStateToEditor(this);
    this.setState(this.state);
  },
  shareTool: function shareTool() {
    if (!Police.checkToolDefinition(this)) {
      this.refs.codePanel.refs.ace.editor.focus();
      return;
    }
    dialog.showMessageBox({
      type: "warning",
      buttons: ["Confirm", "Cancel"],
      title: "Gist creating confirmation",
      message: "This will upload your code as a public gist snippet."
    }, function (r) {
      if (Number(r) === 0) {
        var tool = Util.filterByProperty(this.state.tools, "id", this.state.currentTool);
        var file = {};
        file[tool.name + ".json"] = {
          "content": tool.code
        };
        var github = new GitHubApi({
          version: "3.0.0",
          protocol: "https",
          host: "api.github.com",
          timeout: 5000
        });
        github.gists.create({
          description: tool.description,
          public: true,
          files: file
        }, function (err, res) {
          if (err) {
            console.log(err);
          } else {
            open(res.html_url);
          }
        }.bind(this));
      }
    }.bind(this));
  },
  parseAll: function parseAll() {
    if (CodeParse.generateCommand(this)) {
      dialog.showMessageBox({
        type: "info",
        buttons: ["OK"],
        title: "Parse Success",
        message: "All tools successfully parsed."
      });
    }
  },

  render: function render() {
    return this.state.workDir !== "" ? React.createElement(
      'div',
      { className: 'window' },
      React.createElement(HeaderPanel, {
        newProject: this.newProject,
        openProject: this.openProject,
        saveProject: this.saveProject,
        saveAsProject: this.saveAsProject,
        importFile: this.importFile,
        mapCode: this.mapCode,
        parseAll: this.parseAll,
        exportProject: this.exportProject,
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
            tools: this.state.tools,
            deleteTool: this.deleteTool,
            onNodeClick: this.onNodeClick,
            toolClick: this.toolClick,
            chose: this.state.chose,
            choosing: this.state.choosing
          }) : React.createElement(CodePanel, {
            currentTool: this.state.currentTool,
            tools: this.state.tools,
            showingParsed: this.state.showingParsed,
            inputChange: this.inputChange,
            editorChange: this.editorChange,
            parseCode: this.parseCode,
            editCode: this.editCode,
            exportTool: this.exportTool,
            importTool: this.importTool,
            shareTool: this.shareTool,
            ref: 'codePanel'
          }),
          React.createElement(FilePanel, {
            files: this.state.files,
            insertFile: this.insertFile,
            openFile: this.openFile,
            deleteFile: this.deleteFile
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