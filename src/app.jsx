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
      workDir: process.env.HOME,
      tools: [
        [{
          id: 0,
          name: "New Step",
          description: "A new step you just created",
          code: CodeParse.initCode(),
          codeobj: {},
          valid: true,
          upstream: [],
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
    };
    this.state.tools[hierarchy].push({id: this.state.lastId, name: "New Step", description: "A new step you just created", code: CodeParse.initCode(), codeobj: {}, upstream:[], output:[]});
    this.setState(this.state);
  },
  linkTool: function(n1, n2) {
    if(Util.getHierarchy(this.state.tools, n1) > Util.getHierarchy(this.state.tools, n2)) {
      Util.filterByProperty(this.state.tools, "id", n1).upstream.push(n2);
    } else if(Util.getHierarchy(this.state.tools, n1) < Util.getHierarchy(this.state.tools, n2)) {
      Util.filterByProperty(this.state.tools, "id", n2).upstream.push(n1);
    } else {
      dialog.showErrorBox("Link Error", "Cannot link tools that executed synchronously.");
    }
    this.setState(this.state);
  },
  deleteTool: function(chose, toolid) {
    var id = toolid;
    if(chose) {
      if(id == 0) {
        dialog.showErrorBox("Deletion Error", "Leave your root node alone T.T");
      } else {
        dialog.showMessageBox({
          type: "warning",
          buttons: ["You bet", "Just kidding"],
          title: "Deletion Warning",
          message: "Are you sure to delete "+Util.filterByProperty(this.state.tools, "id", this.state.currentTool).name+"?",
        }, function(r){
          if(r == 0) {
            Util.deleteById(this.state.tools, id);
            this.state.chose = false;
            this.setState(this.state);
          } else {
            return;
          }
        }.bind(this))
      }
    }
  },
  onNodeClick: function(e) {
    if(this.state.chose && this.state.choosing == e.target.getAttribute("name")){ //unselect node
      this.state.chose = false;
    } else if(!this.state.chose) { //select node
      this.state.chose = true;
      this.state.choosing = e.target.getAttribute("name");
    } else if(this.state.chose && this.state.choosing != e.target.getAttribute("name")) { //link node
      this.state.chose = false;
      this.linkTool(this.state.choosing, e.target.getAttribute("name"));
    }
    this.setState(this.state);
  },


  //Tool defining
  toolClick: function(e) {
    this.state.currentTool = e.target.getAttribute("name");
    this.state.action = "code";
    CodeParse.syncEditorToState(this);
    this.setState(this.state);
  },
  inputChange: function(e) {
    if(e.target.getAttribute("name")=="name") {
      Util.filterByProperty(this.state.tools, "id", this.state.currentTool).name = e.target.value;
      CodeParse.syncStateToEditor(this);
      this.setState(this.state);
    }
    if(e.target.getAttribute("name")=="description") {
      Util.filterByProperty(this.state.tools, "id", this.state.currentTool).description = e.target.value;
      CodeParse.syncStateToEditor(this);
      this.setState(this.state);
    }
  },
  editorChange: function(v) {
    Util.filterByProperty(this.state.tools, "id", this.state.currentTool).code = v;
    CodeParse.syncEditorToState(this);
    this.setState(this.state);
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
                  chose={this.state.chose}
                  choosing={this.state.choosing}
                /> :
                <CodePanel
                  currentTool={this.state.currentTool}
                  tools={this.state.tools}
                  inputChange={this.inputChange}
                  editorChange={this.editorChange}
                />
              }
              <FilePanel
                files={this.state.files}
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
