var React = require('react');
var brace = require('brace');
var AceEditor = require('react-ace');
var Util = require('./util');

require('brace/mode/json');
require('brace/mode/sh');
require('brace/theme/chrome');

var CodePanel = React.createClass({

  refreshEditor: function() {
    this.refs.ace.editor.getSession().setUseWrapMode(true);
    this.refs.aceparsed.editor.getSession().setUseWrapMode(true);
    if(this.props.showingParsed){
      document.getElementById('code').style.display = 'none';
      document.getElementById('codeparsed').style.display = 'block';
    } else {
      document.getElementById('code').style.display = 'block';
      document.getElementById('codeparsed').style.display = 'none';
    }
  },

  componentDidMount: function() {
    this.refreshEditor();
    //A hack to fix ace editor's undo to empty bug
    var undo_manager = this.refs.ace.editor.getSession().getUndoManager();
    undo_manager.reset();
    this.refs.ace.editor.getSession().setUndoManager(undo_manager);
    var undo_manager_parsed = this.refs.aceparsed.editor.getSession().getUndoManager();
    undo_manager_parsed.reset();
    this.refs.aceparsed.editor.getSession().setUndoManager(undo_manager_parsed);
  },
  componentDidUpdate: function() {
    this.refreshEditor();
  },
  foucsEditor: function() {
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
              <input type="text" name="name" className="form-control" placeholder="Name" value={tool.name} onChange={this.props.inputChange}/>
            </div>
            <span>Description: </span>
            <div className="descriptioninput">
              <input type="text" name="description" className="form-control" placeholder="Description" value={tool.description} onChange={this.props.inputChange}/>
            </div>
          </div>
          <ul className="list-group">
            <li className="list-group-header">
              <strong>Code</strong>
              {tool.valid ? <strong style={{color: '#016936', float: 'right'}}><span style={{color: "black"}}>JSON: </span>Valid</strong> : <strong style={{color: '#B03060', float: 'right'}}><span style={{color: "black"}}>JSON: </span>Invalid</strong>}
              <div style={{marginRight: '10px'}} className="btn-group pull-right">
                <button className="btn btn-mini btn-default" onClick={this.props.parseCode}>
                  Parse
                </button>
                <button className="btn btn-mini btn-default" onClick={this.props.editCode}>
                  Edit
                </button>
              </div>
            </li>
          </ul>
        </div>
        <div className="codepane" onClick={this.focusEditor}> 
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
          <AceEditor
            mode="sh"
            theme="chrome"
            name="codeparsed"
            width="100%"
            maxLines={100}
            fontSize={14}
            ref="aceparsed"
            value={tool.parsedCommand}
            editorProps={{$blockScrolling: Infinity}}
          />
        </div>
      </div>
    );
  }
});

module.exports = CodePanel;
