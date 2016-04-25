var React = require('react');
var ReactDOM = require('react-dom');
var remote = require('remote');
var ipcRenderer = require('electron').ipcRenderer;

var dialog = remote.require('dialog');
var Menu = remote.Menu;
var spawn = require('child_process').spawn;
var path = require('path');

var Util = require('./lib/util');
var Menus = require('./lib/menus')
var CodeParse = require('./lib/codeParse');
var FileOperation = require('./lib/fileOperation');
var HeaderPanel = require('./lib/headerPanel');
var ToolPanel = require('./lib/toolPanel');
var CodePanel = require('./lib/codePanel');
var MapPanel = require('./lib/mapPanel');
var FilePanel = require('./lib/filePanel');
var WelcomeScreen = require('./lib/welcomeScreen');
var Police = require('./lib/police');

var MainComponent = React.createClass({

  getInitialState: function() {
    return {
      workDir: "",
      lastSaved: "",
      tools: [
        [this.getNewTool(0)],
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
          codeobj: {}, //JOSN object parsed from the code
          parsedOptions: {}, //LEASH converted options of the tool
          looping: false, //if the command is to run as a loop, or the values to loop
          expressions: [], //direct LEASH parsing result
          options: [], //keys for options
          parsedCommnad: "", //the command to finally run
          valid: true, //if the JSON is valid
          output_files: [], //the array of predicted output files path
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
      var pipeline;
      
      ipcRenderer.send('createRun');
      
      ipcRenderer.on('winloaded', function(event) {
        console.log("loaded");
        FileOperation.runCommand(this);
        pipeline = spawn("bash", [path.join(this.state.workDir, ".pipelinecommand.sh")]);
        pipeline.stdout.on('data', function(data) {
          ipcRenderer.send('ondata', data);
        });
        
        pipeline.stderr.on('data', function(data) {
          ipcRenderer.send('ondata', data);
        });

        pipeline.on('close', function(code) {
          ipcRenderer.send('ondata', `child process exited with code ${code}`);
        });
      
      }.bind(this));
      
      ipcRenderer.on('runclosed', function(event) {
        pipeline.kill('SIGHUP');
      }.bind(this));   
    }
    
    
  },

  exportCode: function() {
    if(CodeParse.generateCommand(this)) {
      FileOperation.exportCommand(this);
    }
  },
  
  onFileClick: function(path) {
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
    console.log("parsing.");
  },
  editCode: function() {
    this.state.showingParsed = false;
    CodeParse.syncStateToEditor(this);
    this.setState(this.state);
    console.log("editing.");
  },
  exportTool: function() {
    FileOperation.exportTool(this);
  },
  importTool: function() {
    FileOperation.importTool(this);
    CodeParse.syncEditorToState(this);
    CodeParse.syncStateToEditor(this);
    this.setState(this.state);
  },
  shareTool: function() {
    
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
                onFileClick={this.onFileClick}
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
