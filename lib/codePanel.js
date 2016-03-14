var React = require('react');
var brace = require('brace');
var AceEditor = require('react-ace');
var Util = require('./util');

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
    this.refs.ace.editor.getSession().setUseWrapMode(true);
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
    var tool = Util.filterByProperty(this.props.tools, "id", this.props.currentTool);

    return React.createElement(
      'div',
      { className: 'pane parampane' },
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
            { className: 'nameinput' },
            React.createElement('input', { type: 'text', name: 'name', className: 'form-control', placeholder: 'Name', value: tool[0].name, onChange: this.props.inputChange })
          ),
          React.createElement(
            'span',
            { className: 'splitter' },
            'splitter'
          ),
          React.createElement(
            'span',
            null,
            'Description: '
          ),
          React.createElement(
            'div',
            { className: 'descriptioninput' },
            React.createElement('input', { type: 'text', name: 'description', className: 'form-control', placeholder: 'Description', value: tool[0].description, onChange: this.props.inputChange })
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
            React.createElement('input', { type: 'checkbox', name: 'loopcheck', onChange: this.props.inputChange })
          ),
          React.createElement(
            'span',
            null,
            'for'
          ),
          React.createElement(
            'div',
            null,
            React.createElement('input', { type: 'text', name: 'loop', className: 'form-control', placeholder: 'Loop', onChange: this.props.inputChange, disabled: !tool[0].haveloop })
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
            React.createElement('input', { type: 'checkbox', name: 'conditioncheck', onChange: this.props.inputChange })
          ),
          React.createElement(
            'span',
            null,
            'if'
          ),
          React.createElement(
            'div',
            null,
            React.createElement('input', { type: 'text', name: 'condition', className: 'form-control', placeholder: 'Condition', onChange: this.props.inputChange, disabled: !tool[0].havecondition })
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
          value: tool[0].code,
          onChange: this.props.editorChange,
          editorProps: { $blockScrolling: Infinity }
        })
      )
    );
  }
});

module.exports = CodePanel;