var React = require('react');
var brace = require('brace');
var AceEditor = require('react-ace');
var Util = require('./util');

require('brace/mode/json');
require('brace/theme/chrome');

var CodePanel = React.createClass({

  refreshEditor: function() {
    this.refs.ace.editor.getSession().setUseWrapMode(true);
  },

  componentDidMount: function() {
    this.refreshEditor();
  },
  componentDidUpdate: function() {
    this.refreshEditor();
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
              <input type="text" name="name" className="form-control" placeholder="Name" value={tool.name} onChange={this.props.inputChange}/>
            </div>
            <span>Description: </span>
            <div className="descriptioninput">
              <input type="text" name="description" className="form-control" placeholder="Description" value={tool.description} onChange={this.props.inputChange}/>
            </div>
          </div>
        </div>
        <div className="codepane" onClick={this.focusEditor}>
          <ul className="list-group">
            <li className="list-group-header">
              <strong>Code</strong>
              {tool.valid ? <strong style={{color: '#016936', float: 'right'}}>Valid</strong> : <strong style={{color: '#B03060', float: 'right'}}>Invalid</strong>}
            </li>
          </ul>
          <AceEditor
            mode="json"
            theme="chrome"
            name="code"
            width="100%"
            maxLines={100}
            fontSize={14}
            ref="ace"
            value={tool.code}
            onChange={this.props.editorChange}
            editorProps={{$blockScrolling: Infinity}}
          />
        </div>
      </div>
    );
  }
});

module.exports = CodePanel;
