var React = require('react');
var ReactDOM = require('react-dom');
var HeaderPanel = require('./lib/headerPanel');
var ToolPanel = require('./lib/toolPanel');
var CodePanel = require('./lib/codePanel');
var PathPanel = require('./lib/pathPanel');
var FilePanel = require('./lib/filePanel');

var MainComponent = React.createClass({
  displayName: 'MainComponent',

  getInitialState: function () {
    return {
      tools: [{ name: "aaa", description: "bbb" }, { name: "ccc", description: "ddd" }],
      files: [{ name: "call.vcf", type: "real" }, { name: "result.bed", type: "virtual" }],
      coding: false
    };
  },
  render: function () {
    return React.createElement(
      'div',
      { className: 'window' },
      React.createElement(HeaderPanel, null),
      React.createElement(
        'div',
        { className: 'window-content' },
        React.createElement(
          'div',
          { className: 'pane-group' },
          React.createElement(ToolPanel, {
            tools: this.state.tools
          }),
          !this.state.coding ? React.createElement(PathPanel, null) : React.createElement(CodePanel, null),
          React.createElement(FilePanel, {
            files: this.state.files
          })
        )
      )
    );
  }
});

ReactDOM.render(React.createElement(MainComponent, null), document.getElementById('content'));