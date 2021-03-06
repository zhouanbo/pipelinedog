var React = require('react');
var ReactDOM = require('react-dom');
var remote = require('electron').remote;
var ipcRenderer = require('electron').ipcRenderer;

var {dialog} = remote;
var Menu = remote.Menu;
var path = require('path');
var GitHubApi = require("github");
var open = require("open");

var Util = require('./dist/util');
var Menus = require('./dist/menus')
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

  getInitialState: function() {
    return {
      workDir: "",
      lastSaved: "",
      tools: [
        [this.getNewTool(0)]
      ],
      lastId: 0,
      files: [],
      action: "map",
      showingParsed: false,
      currentTool: 0,
      chose: false,
      choosing: 0,
      command: "",
    };
  },

  getNewTool: function(index) {
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

  componentDidMount: function() {
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
  openProject: function() {
    FileOperation.openProject(this);
  },
  saveProject: function() {
    FileOperation.saveProject(this);
  },
  saveAsProject: function() {
    FileOperation.saveAsProject(this);
  },
  importFile: function() {
    FileOperation.importFile(this);
  },
  newProject: function() {
    FileOperation.newProject(this);
  },
  openFile: function(filepath) {
    FileOperation.openFile(filepath);
  },
  deleteFile: function(index) {
    dialog.showMessageBox({
      type: "warning",
      buttons: ["Delete", "Cancel"],
      title: "Deletion Warning",
      message: "Are you sure to delete "+this.state.files[index].name+"?",
    }, function(r){
      if(Number(r) === 0) {
        this.state.files.splice(index, 1);
        this.setState(this.state);
      }
    }.bind(this));
  },

  runCode: function() {
    if(CodeParse.generateCommand(this)) {
      ipcRenderer.send('createRun', this.state.workDir, this.state.command);
    }
  },

  exportCode: function() {
    if(CodeParse.generateCommand(this)) {
      FileOperation.exportCommand(this);
    }
  },

  insertFile: function(path) {
    if(!this.state.showingParsed) {
      this.refs.codePanel.refs.ace.editor.insert('"'+path+'"');
      this.refs.codePanel.refs.ace.editor.focus();
    }
  },

  //Mapping workflow
  mapCode: function() {
    this.state.action = this.state.action == "map" ? "code" : "map";
    this.setState(this.state);
  },
  addTool: function(e) {
    this.state.lastId++;
    var hierarchy = e.target.getAttribute("tabIndex");
    if(e.target.getAttribute("name") == "bottomplus"){
      hierarchy++;
    }
    if(!this.state.tools[hierarchy]) {
      this.state.tools[hierarchy]=[];
    }
    this.state.tools[hierarchy].push(this.getNewTool(this.state.lastId));
    this.setState(this.state);
  },
  deleteTool: function(chose, toolid) {
    var id = toolid;
    if(chose) {
      if(this.state.tools[0].length === 1 && this.state.tools.length === 1) {
        dialog.showErrorBox("Deletion Error", "Cannot delete the last node.");
      } else {
        dialog.showMessageBox({
          type: "warning",
          buttons: ["Delete", "Cancel"],
          title: "Deletion Warning",
          message: "Are you sure to delete "+Util.filterByProperty(this.state.tools, "id", this.state.currentTool).name+"?",
        }, function(r){
          if(Number(r) === 0) {
            Util.deleteById(this.state.tools, id);
            for(var i=0; i < this.state.tools.length; i++) {
              if(this.state.tools[i].length == 0) {
                this.state.tools.splice(i, 1);
              }
            }
            this.state.chose = false;
            if(this.state.currentTool == id){
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
  onNodeClick: function(id) {
    if(this.state.chose && this.state.choosing == id){ //unselect node
      this.state.chose = false;
    } else if(!this.state.chose) { //select node
      this.state.chose = true;
      this.state.choosing = id;
    } else if(this.state.chose && this.state.choosing != id) { //select another node
      this.state.choosing = id;
    }
    this.setState(this.state);
  },


  //Tool defining
  toolClick: function(id) {
    this.state.currentTool = id;
    this.state.action = "code";
    this.state.showingParsed = false;
    CodeParse.syncEditorToState(this); //validate JSON
    this.setState(this.state);
  },
  inputChange: function(e) {
    if(e.target.getAttribute("name")=="name") {
      Util.filterByProperty(this.state.tools, "id", this.state.currentTool).name = e.target.value;
      Util.filterByProperty(this.state.tools, "id", this.state.currentTool).codeobj.name = e.target.value;
      CodeParse.syncStateToEditor(this);
      this.setState(this.state);
    }
    if(e.target.getAttribute("name")=="description") {
      Util.filterByProperty(this.state.tools, "id", this.state.currentTool).description = e.target.value;
      Util.filterByProperty(this.state.tools, "id", this.state.currentTool).codeobj.description = e.target.value;
      CodeParse.syncStateToEditor(this);
      this.setState(this.state);
    }
  },
  editorChange: function(v) {
    Util.filterByProperty(this.state.tools, "id", this.state.currentTool).code = v;
    CodeParse.syncEditorToState(this);
    this.setState(this.state);
  },

  //Code parsing
  parseCode: function() {
    if(!Police.checkToolDefinition(this)){
      this.refs.codePanel.refs.ace.editor.focus();
      return;
    }
    this.state.showingParsed = true;
    CodeParse.parseToolCommand(this);
    FileOperation.newParse(this);
    this.setState(this.state);
    console.log('showingParsed: ' + this.state.showingParsed);
  },
  editCode: function() {
    this.state.showingParsed = false;
    CodeParse.syncStateToEditor(this);
    this.setState(this.state);
    console.log('showingParsed: ' + this.state.showingParsed);
  },
  exportTool: function() {
    FileOperation.exportTool(this);
  },
  exportProject: function() {
    var json = Util.arrayToJSON(this.state.tools);
    FileOperation.exportProject(this, json);
  },
  importTool: function() {
    FileOperation.importTool(this);
    CodeParse.syncEditorToState(this);
    CodeParse.syncStateToEditor(this);
    this.setState(this.state);
  },
  shareTool: function() {
    if(!Police.checkToolDefinition(this)){
      this.refs.codePanel.refs.ace.editor.focus();
      return;
    }
    dialog.showMessageBox({
      type: "warning",
      buttons: ["Confirm", "Cancel"],
      title: "Gist creating confirmation",
      message: "This will upload your code as a public gist snippet.",
    }, function(r){
      if(Number(r) === 0) {
        var tool = Util.filterByProperty(this.state.tools, "id", this.state.currentTool);
        var file = {};
        file[tool.name+".json"] = {
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
        }, function(err, res) {
          if(err) {
            console.log(err);
          } else {
            open(res.html_url);
          }
        }.bind(this));
      }
    }.bind(this));
  },
  parseAll: function() {
    if(CodeParse.generateCommand(this)) {
      dialog.showMessageBox({
          type: "info",
          buttons: ["OK"],
          title: "Parse Success",
          message: "All tools successfully parsed.",
      });
    }
  },


  render: function() {
    return (
      this.state.workDir !== "" ?
        <div className="window">
          <HeaderPanel
            newProject={this.newProject}
            openProject={this.openProject}
            saveProject={this.saveProject}
            saveAsProject={this.saveAsProject}
            importFile={this.importFile}
            mapCode={this.mapCode}
            parseAll={this.parseAll}
            exportProject={this.exportProject}
            exportCode={this.exportCode}
            runCode={this.runCode}
          />
          <div className="window-content">
            <div className="pane-group">
              <ToolPanel
                currentTool={this.state.currentTool}
                tools={this.state.tools}
                toolClick={this.toolClick}
              />
              {this.state.action === "map" ?
                <MapPanel
                  addTool={this.addTool}
                  linkTool={this.linkTool}
                  tools={this.state.tools}
                  deleteTool={this.deleteTool}
                  onNodeClick={this.onNodeClick}
                  toolClick={this.toolClick}
                  chose={this.state.chose}
                  choosing={this.state.choosing}
                /> :
                <CodePanel
                  currentTool={this.state.currentTool}
                  tools={this.state.tools}
                  showingParsed={this.state.showingParsed}
                  inputChange={this.inputChange}
                  editorChange={this.editorChange}
                  parseCode={this.parseCode}
                  editCode={this.editCode}
                  exportTool={this.exportTool}
                  importTool={this.importTool}
                  shareTool={this.shareTool}
                  ref="codePanel"
                />
              }
              <FilePanel
                files={this.state.files}
                insertFile={this.insertFile}
                openFile={this.openFile}
                deleteFile={this.deleteFile}
              />
            </div>
          </div>
        </div> :
        <div className="window welcomescreen">
          <WelcomeScreen
            openProject={this.openProject}
            newProject={this.newProject}
          />
        </div>
      );
    }
});

ReactDOM.render(
  <MainComponent />,
  document.getElementById('content')
);
