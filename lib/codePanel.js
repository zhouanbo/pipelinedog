var React = require('react');
var brace = require('brace');
var AceEditor = require('react-ace');

require('brace/mode/sh');
require('brace/theme/chrome');

var CodePanel = React.createClass({
  displayName: 'CodePanel',


  getInitialState: function () {
    return {
      options: {}
    };
  },

  refreshEditor: function () {
    this.refs.ace.editor.focus();
    this.refs.ace.editor.getSession().setUseWrapMode(true);
    if (this.props.currentTool == "") {
      this.refs.ace.editor.setReadOnly(true);
      this.refs.ace.editor.setValue("-----No tool selected-----", 1);
    } else {
      this.refs.ace.editor.setReadOnly(false);
      this.refs.ace.editor.setValue(this.props.tools[this.props.currentTool].code, 1);
    }
  },

  componentDidMount: function () {
    this.refreshEditor();
  },

  componentDidUpdate: function () {
    this.refreshEditor();
  },

  render: function () {
    return React.createElement(
      'div',
      { className: 'pane' },
      React.createElement(
        'ul',
        { className: 'list-group' },
        React.createElement(
          'li',
          { className: 'list-group-header' },
          React.createElement(
            'strong',
            null,
            'Code'
          )
        )
      ),
      React.createElement(AceEditor, {
        mode: 'sh',
        theme: 'chrome',
        name: 'code',
        width: '100%',
        maxLines: 200,
        minLines: 27,
        fontSize: 14,
        ref: 'ace',
        editorProps: { $blockScrolling: Infinity }
      })
    );
  }
});

module.exports = CodePanel;