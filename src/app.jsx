var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
var remote = require('remote');
var dialog = remote.require('dialog');

var HeaderPanel = require('./lib/headerPanel');
var ToolPanel = require('./lib/toolPanel');
var CodePanel = require('./lib/codePanel');
var MapPanel = require('./lib/mapPanel');
var FilePanel = require('./lib/filePanel');

var MainComponent = React.createClass({

  getInitialState: function() {
    return {
      tools: [{name: "aaa", description: "bbb"}, {name: "ccc", description: "ddd"}],
      files: [{name: "call.vcf", type: "real"}, {name: "result.bed", type: "virtual"}],
      action: "map",
    };
  },

  openProject: function() {
    console.log("1 clicked");
  },

  saveProject: function() {
    console.log("2 clicked");
  },

  importFile: function() {
    console.log(dialog.showOpenDialog({
      title: "Import File",
      properties: ['openFile','multiSelections']
    }));
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
              tools={this.state.tools}
            />
          {this.state.action === "map" ? <MapPanel addTool={this.addTool} linkTool={this.linkTool} /> : <CodePanel />}
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
