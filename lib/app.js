var React = require('react');
var ReactDOM = require('react-dom');
var HeaderPanel = require('./lib/headerPanel');
var ToolPanel = require('./lib/toolPanel');
var CodePanel = require('./lib/codePanel');
var FilePanel = require('./lib/filePanel');

var MainComponent = React.createClass({
  displayName: 'MainComponent',

  getInitialState: function () {
    return {
      tools: [],
      files: []
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
          React.createElement(ToolPanel, null),
          React.createElement(CodePanel, null),
          React.createElement(FilePanel, null)
        )
      )
    );
  }
});

ReactDOM.render(React.createElement(MainComponent, null), document.getElementById('content'));