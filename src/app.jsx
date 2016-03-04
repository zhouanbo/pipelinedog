var React = require('react');
var ReactDOM = require('react-dom');
var HeaderPanel = require('./lib/headerPanel');
var ToolPanel = require('./lib/toolPanel');
var OptionPanel = require('./lib/optionPanel');
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
            <OptionPanel />
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
