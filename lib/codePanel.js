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
    var tool = this.filterByProperty(this.props.tools, "id", this.props.currentTool);

    return React.createElement(
      'div',
      { className: 'pane' },
      React.createElement(
        'div',
        { className: 'formpane' },
        React.createElement(
          'ul',
          { className: 'list-group' },
          React.createElement(
            'li',
            { className: 'list-group-header' },
            React.createElement(
              'strong',
              null,
              'Profile'
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'form-group' },
          React.createElement(
            'span',
            null,
            'Name: '
          ),
          React.createElement(
            'div',
            null,
            React.createElement('input', { type: 'text', name: 'name', className: 'form-control', placeholder: 'Name', defaultValue: tool[0].name })
          ),
          React.createElement(
            'span',
            { className: 'splitter' },
            'splitter'
          ),
          React.createElement(
            'span',
            null,
            'Description'
          ),
          React.createElement(
            'div',
            null,
            React.createElement('input', { type: 'text', name: 'description', className: 'form-control', placeholder: 'Description', defaultValue: tool[0].description })
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'formpane' },
        React.createElement(
          'ul',
          { className: 'list-group' },
          React.createElement(
            'li',
            { className: 'list-group-header' },
            React.createElement(
              'strong',
              null,
              'Loop & Condition'
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'form-group' },
          React.createElement(
            'span',
            null,
            React.createElement('input', { type: 'checkbox' })
          ),
          React.createElement(
            'span',
            null,
            'for'
          ),
          React.createElement(
            'div',
            null,
            React.createElement('input', { type: 'text', name: 'loop', className: 'form-control', placeholder: 'Loop' })
          ),
          React.createElement(
            'span',
            null,
            'do...'
          ),
          React.createElement(
            'span',
            { className: 'splitter' },
            'splitter'
          ),
          React.createElement(
            'span',
            null,
            React.createElement('input', { type: 'checkbox' })
          ),
          React.createElement(
            'span',
            null,
            'if'
          ),
          React.createElement(
            'div',
            null,
            React.createElement('input', { type: 'text', name: 'condition', className: 'form-control', placeholder: 'Condition' })
          ),
          React.createElement(
            'span',
            null,
            'then...'
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'codepane', onClick: this.focusEditor },
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
      )
    );
  }
});

module.exports = CodePanel;