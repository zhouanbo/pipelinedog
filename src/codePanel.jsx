var React = require('react');
var brace = require('brace');
var AceEditor = require('react-ace');
var Util = require('./util');

require('brace/mode/sh');
require('brace/theme/chrome');

var CodePanel = React.createClass({

  getInitialState: function() {
    return {
      options: {}
    };
  },

  refreshEditor: function() {
    this.refs.ace.editor.getSession().setUseWrapMode(true);
  },

  componentDidMount: function() {
    this.refreshEditor();
  },
  componentDidUpdate: function() {
    this.refreshEditor();
  },

  focusEditor: function() {
    this.refs.ace.editor.focus();
  },

  render: function() {
    var tool = Util.filterByProperty(this.props.tools, "id", this.props.currentTool);

    return (
      <div className="pane parampane">
        <div className="formpane">
          <ul className="list-group">
            <li className="list-group-header">
              <strong>Profile</strong>
            </li>
          </ul>
          <div className="form-group">
            <span>Name: </span>
            <div className="nameinput">
              <input type="text" name="name" className="form-control" placeholder="Name" value={tool[0].name} onChange={this.props.inputChange}/>
            </div>
            <span className="splitter">splitter</span>
            <span>Description: </span>
            <div className="descriptioninput">
              <input type="text" name="description" className="form-control" placeholder="Description" value={tool[0].description} onChange={this.props.inputChange}/>
            </div>
          </div>
        </div>
        <div className="formpane">
          <ul className="list-group">
            <li className="list-group-header">
              <strong>Loop & Condition</strong>
            </li>
          </ul>
          <div className="form-group">
            <span><input type="checkbox" name="loopcheck" onChange={this.props.inputChange}/></span>
            <span>for</span>
            <div>
              <input type="text" name="loop" className="form-control" placeholder="Loop" onChange={this.props.inputChange} disabled={!tool[0].haveloop}/>
            </div>
            <span>do...</span>
            <span className="splitter">splitter</span>
            <span><input type="checkbox" name="conditioncheck" onChange={this.props.inputChange}/></span>
            <span>if</span>
            <div>
              <input type="text" name="condition" className="form-control" placeholder="Condition"  onChange={this.props.inputChange} disabled={!tool[0].havecondition}/>
            </div>
            <span>then...</span>
          </div>
        </div>
        <div className="codepane" onClick={this.focusEditor}>
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
            maxLines={100}
            fontSize={14}
            ref="ace"
            value={tool[0].code}
            onChange={this.props.editorChange}
            editorProps={{$blockScrolling: Infinity}}
          />
        </div>
      </div>
    );
  }
});

module.exports = CodePanel;
