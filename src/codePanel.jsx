var React = require('react');
var brace = require('brace');
var AceEditor = require('react-ace');

require('brace/mode/sh');
require('brace/theme/chrome');

var CodePanel = React.createClass({

  getInitialState: function() {
    return {
      options: {}
    };
  },

  componentDidMount: function() {
    this.refs.ace.editor.focus();
    this.refs.ace.editor.getSession().setUseWrapMode(true);
  },

  setOptionState: function(event) {
    this.state.options[event.target.name] = event.target.value;
    return this.setState({options: this.state.options});
  },

  render: function() {
    return (
      <div className="pane">
        <ul className="list-group">
          <li className="list-group-header">
            <strong>Code</strong>
          </li>
        </ul>
        <AceEditor
          mode="sh"
          theme="chrome"
          name="code"
          width="100%"
          maxLines={200}
          minLines={27}
          fontSize={14}
          ref="ace"
          editorProps={{$blockScrolling: Infinity}}
        />
      </div>
    );
  }
});

module.exports = CodePanel;
