var React = require('react');
var ReactDOM = require('react-dom');
var remote = require('remote');
var dialog = remote.require('dialog');

var Util = require('./lib/util');
var CodeParse = require('./lib/codeParse');
var FileOperation = require('./lib/fileOperation');
var HeaderPanel = require('./lib/headerPanel');
var ToolPanel = require('./lib/toolPanel');
var CodePanel = require('./lib/codePanel');
var MapPanel = require('./lib/mapPanel');
var FilePanel = require('./lib/filePanel');
var WelcomeScreen = require('./lib/welcomeScreen');

var MainComponent = React.createClass({

  getInitialState: function() {
    return {
      workDir: "",
      tools: [
        [{
          id: 0,
          name: "New Step",
          description: "A new step you just created",
          code: CodeParse.initCode(),
          codeobj: {},
          parsedOptions: {},
          looping: false,
          parsedCommnad: "",
          valid: true,
          output: []
        }],
      ],
      lastId: 0,
      files: [],
      action: "map",
      currentTool: 0,
      chose: false,
      choosing: 0
    };
  },


  //File operations
  openProject: function() {
    FileOperation.openProject(this);
  },
  saveProject: function() {
    FileOperation.saveProject(this);
  },
  importFile: function() {
    FileOperation.importFile(this);
  },
  newProject: function() {
    FileOperation.newProject(this);
  },

  runCode: function() {
    console.log("4 clicked");
  },

  exportCode: function() {
    console.log("5 clicked");
  },
  
  onFileClick: function(path) {
    this.refs.codePanel.refs.ace.editor.insert('"'+path+'"');
    this.refs.codePanel.refs.ace.editor.focus();
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
    this.state.tools[hierarchy].push({id: this.state.lastId, name: "New Step", description: "A new step you just created", code: CodeParse.initCode(), codeobj: {}, output:[]});
    this.setState(this.state);
  },
  deleteTool: function(chose, toolid) {
    var id = toolid;
    if(chose) {
      if(Number(id) === 0) {
        dialog.showErrorBox("Deletion Error", "Root node cannot be deleted.");
      } else {
        dialog.showMessageBox({
          type: "warning",
          buttons: ["Delete", "Cancel"],
          title: "Deletion Warning",
          message: "Are you sure to delete "+Util.filterByProperty(this.state.tools, "id", this.state.currentTool).name+"?",
        }, function(r){
          if(Number(r) === 0) {
            Util.deleteById(this.state.tools, id);
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
    CodeParse.syncEditorToState(this); //validate the JSON
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
    CodeParse.parseToolCommand(this);
    this.setState(this.state);
    console.log("parsing.");
  },
  editCode: function() {
    CodeParse.syncStateToEditor(this);
    this.setState(this.state);
    console.log("editing.");
  },


  render: function() {
    return (
      this.state.workDir !== "" ?
        <div className="window">
          <HeaderPanel
            openProject={this.openProject}
            saveProject={this.saveProject}
            importFile={this.importFile}
            mapCode={this.mapCode}
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
                  inputChange={this.inputChange}
                  editorChange={this.editorChange}
                  parseCode={this.parseCode}
                  editCode={this.editCode}
                  ref="codePanel"
                />
              }
              <FilePanel
                files={this.state.files}
                onFileClick={this.onFileClick}
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
