var React = require('react');
var brace = require('brace');
var AceEditor = require('react-ace');
var Util = require('./util');

require('brace/mode/json');
require('brace/mode/sh');
require('brace/theme/chrome');

var CodePanel = React.createClass({
  displayName: 'CodePanel',


  refreshEditor: function () {
    if (!this.props.showingParsed) this.refs.ace.editor.getSession().setUseWrapMode(true);
    if (this.props.showingParsed) this.refs.aceparsed.editor.getSession().setUseWrapMode(true);
  },

  componentDidMount: function () {
    this.refreshEditor();
    this.clearHistory();
  },
  componentDidUpdate: function () {
    this.refreshEditor();
  },
  foucsEditor: function () {
    this.refs.ace.editor.focus();
  },
  clearHistory: function () {
    //A hack to fix ace editor's undo to empty bug
    if (!this.props.showingParsed) {
      var undo_manager = this.refs.ace.editor.getSession().getUndoManager();
      undo_manager.reset();
      this.refs.ace.editor.getSession().setUndoManager(undo_manager);
    } else {
      var undo_manager_parsed = this.refs.aceparsed.editor.getSession().getUndoManager();
      undo_manager_parsed.reset();
      this.refs.aceparsed.editor.getSession().setUndoManager(undo_manager_parsed);
    }
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
            React.createElement('input', { type: 'text', name: 'name', className: 'form-control', placeholder: 'Name', value: tool.name, onChange: this.props.inputChange })
          ),
          React.createElement(
            'span',
            null,
            'Description: '
          ),
          React.createElement(
            'div',
            { className: 'descriptioninput' },
            React.createElement('input', { type: 'text', name: 'description', className: 'form-control', placeholder: 'Description', value: tool.description, onChange: this.props.inputChange })
          )
        ),
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
            ),
            tool.valid ? React.createElement(
              'strong',
              { style: { color: '#016936', float: 'right' } },
              React.createElement(
                'span',
                { style: { color: "black" } },
                'JSON: '
              ),
              'Valid'
            ) : React.createElement(
              'strong',
              { style: { color: '#B03060', float: 'right' } },
              React.createElement(
                'span',
                { style: { color: "black" } },
                'JSON: '
              ),
              'Invalid'
            ),
            React.createElement(
              'div',
              { style: { marginRight: '10px' }, className: 'btn-group pull-right' },
              React.createElement(
                'button',
                { className: 'btn btn-mini btn-default', onClick: this.props.parseCode },
                'Parse'
              ),
              React.createElement(
                'button',
                { className: 'btn btn-mini btn-default', onClick: this.props.editCode },
                'Edit'
              )
            )
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'codepane', onClick: this.focusEditor },
        !this.props.showingParsed ? React.createElement(AceEditor, {
          key: tool.id,
          mode: 'json',
          theme: 'chrome',
          name: 'code',
          width: '100%',
          maxLines: 500,
          fontSize: 14,
          ref: 'ace',
          value: tool.code,
          onChange: this.props.editorChange,
          onFocus: this.clearHistory
        }) : React.createElement(AceEditor, {
          key: tool.id,
          mode: 'sh',
          theme: 'chrome',
          name: 'codeparsed',
          width: '100%',
          maxLines: 500,
          fontSize: 14,
          value: tool.parsedCommand,
          ref: 'aceparsed',
          onFocus: this.clearHistory
        })
      )
    );
  }
});

module.exports = CodePanel;