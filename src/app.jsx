var React = require('react');
var ReactDOM = require('react-dom');
var HeaderPanel = require('./lib/headerPanel');
var ToolPanel = require('./lib/toolPanel');
var CodePanel = require('./lib/codePanel');
var PathPanel = require('./lib/pathPanel');
var FilePanel = require('./lib/filePanel');

var MainComponent = React.createClass({
  getInitialState: function() {
    return {
      tools: [{name: "aaa", description: "bbb"}, {name: "ccc", description: "ddd"}],
      files: [{name: "call.vcf", type: "real"}, {name: "result.bed", type: "virtual"}],
      coding: false,
    };
  },
  render: function() {
    return (
      <div className="window">
        <HeaderPanel />
        <div className="window-content">
          <div className="pane-group">
            <ToolPanel
              tools={this.state.tools}
            />
            {!this.state.coding ? <PathPanel /> : <CodePanel />}
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
