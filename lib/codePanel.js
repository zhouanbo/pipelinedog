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

  filterByProperty: function (array, prop, value) {
    var filtered = [];
    for (var i = 0; i < array.length; i++) {
      var obj = array[i];
      for (var key in obj) {
        if (typeof (obj[key] == "object")) {
          var item = obj[key];
          if (item[prop] == value) {
            filtered.push(item);
          }
        }
      }
    }
    return filtered;
  },

  refreshEditor: function () {
    this.focusEditor();
    this.refs.ace.editor.getSession().setUseWrapMode(true);
    var tool = this.filterByProperty(this.props.tools, "id", this.props.currentTool);
    this.refs.ace.editor.setValue(tool[0].code, 1);
  },

  componentDidMount: function () {
    this.refreshEditor();
  },
  componentDidUpdate: function () {
    this.refreshEditor();
  },

  focusEditor: function () {
    this.refs.ace.editor.focus();
  },

  render: function () {
    return React.createElement(
      'div',
      { className: 'codepane pane', onClick: this.focusEditor },
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
        maxLines: 100,
        fontSize: 14,
        ref: 'ace',
        editorProps: { $blockScrolling: Infinity }
      })
    );
  }
});

module.exports = CodePanel;