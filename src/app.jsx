var React = require('react');
var ReactDOM = require('react-dom');
var HeaderPanel = require('./lib/headerPanel');
var ToolPanel = require('./lib/toolPanel');
var CodePanel = require('./lib/codePanel');
var FilePanel = require('./lib/filePanel');

var MainComponent = React.createClass({
  getInitialState: function() {
    return {
      tools: [],
      files: [],
    };
  },
  render: function() {
    return (
      <div className="window">
        <HeaderPanel />

        <div className="window-content">
          <div className="pane-group">
            <ToolPanel />
            <CodePanel />
            <FilePanel />
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
