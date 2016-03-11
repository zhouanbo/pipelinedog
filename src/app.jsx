var React = require('react');
var ReactDOM = require('react-dom');
var remote = require('remote');
var dialog = remote.require('dialog');
var path = require('path');
var fs = require('fs');

var HeaderPanel = require('./lib/headerPanel');
var ToolPanel = require('./lib/toolPanel');
var CodePanel = require('./lib/codePanel');
var MapPanel = require('./lib/mapPanel');
var FilePanel = require('./lib/filePanel');

var MainComponent = React.createClass({

  getInitialState: function() {
    return {
      tools: [{name: "aaa", description: "bbb", code: "toolcode1"}, {name: "ccc", description: "ddd", code: "toolcode2"}],
      files: [{name: "call.vcf", type: "imported", path:"./call.vcf"}, {name: "result.bed", type: "predicted", path: "/home/me/result.bed"}],
      action: "map",
      currentTool: "",
    };
  },

  openProject: function() {
    var app = this;
    var filepath = dialog.showOpenDialog({
      title: "Open Project",
      properties: ['openFile']
    }, function(filepath) {
      if (!filepath) {return;}
      fs.readFile(filepath[0], 'utf8', function(err, data) {
        if (err) {
          return console.log(err);
        }
        var readState = JSON.parse(data)
        app.state = readState;
        app.setState(app.state);
      });
    });
  },

  saveProject: function() {
    var app = this;
    var filepath = dialog.showSaveDialog({
      title: "Save Project",
      defaultPath: path.join(process.env.HOME, "defaultProject.JSON")
    }, function(filepath) {
      if (!filepath) {return;}
      var writeState = JSON.stringify(app.state)
      fs.writeFile(filepath, writeState, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("Project saved!");
      });
    });
  },

  importFile: function() {
    var app = this;
    var filepaths = dialog.showOpenDialog({
      title: "Import File",
      properties: ['openFile','multiSelections']
    }, function(filepaths) {
      if (!filepaths) {return;}
      filepaths.map(function(filepath) {
        app.state.files.push({name: path.basename(filepath), type: "imported", path: filepath});
        app.setState({files: app.state.files});
      }, this)
    });
  },

  runCode: function(e) {
    console.log("4 clicked");
  },

  exportCode: function() {
    console.log("5 clicked");
  },

  pathCode: function() {
    this.state.action = this.state.action === "map" ? "code" : "map";
    this.setState({action: this.state.action});
  },

  addTool: function() {
    console.log("addtool clicked");
  },

  linkTool: function(e) {
    console.log(e.target.toString());
  },

  toolClick: function(e) {
    this.state.currentTool = e.target.getAttribute("name");
    this.state.action = "code";
    this.setState({currentTool: this.state.currentTool, action: this.state.action});
  },


  render: function() {
    return (
      <div className="window">
        <HeaderPanel
          openProject={this.openProject}
          saveProject={this.saveProject}
          importFile={this.importFile}
          pathCode={this.pathCode}
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
              /> :
              <CodePanel
                currentTool={this.state.currentTool}
                tools={this.state.tools}
              />
            }
            <FilePanel
              files={this.state.files}
            />
          </div>
        </div>
      </div>
    );
  }
});

ReactDOM.render(
  <MainComponent />,
  document.getElementById('content')
);
