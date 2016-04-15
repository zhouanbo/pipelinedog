var React = require('react');
var brace = require('brace');
var AceEditor = require('react-ace');
var Util = require('./util');

require('brace/mode/json');
require('brace/mode/sh');
require('brace/theme/chrome');

var CodePanel = React.createClass({

  refreshEditor: function() {    
    if(!this.props.showingParsed) this.refs.ace.editor.getSession().setUseWrapMode(true);
    if(this.props.showingParsed) this.refs.aceparsed.editor.getSession().setUseWrapMode(true);
  },

  componentDidMount: function() {
    this.refreshEditor();
    this.clearHistory();
  },
  componentDidUpdate: function() {
    this.refreshEditor();
  },
  foucsEditor: function() {
    this.refs.ace.editor.focus();
  },
  clearHistory: function() {
    //A hack to fix ace editor's undo to empty bug
    if(!this.props.showingParsed) {
      var undo_manager = this.refs.ace.editor.getSession().getUndoManager();
      undo_manager.reset();
      this.refs.ace.editor.getSession().setUndoManager(undo_manager);
    } else {
      var undo_manager_parsed = this.refs.aceparsed.editor.getSession().getUndoManager();
      undo_manager_parsed.reset();
      this.refs.aceparsed.editor.getSession().setUndoManager(undo_manager_parsed);
    }
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
        {
          !this.props.showingParsed ?
          <AceEditor
            key={tool.id}
            mode="json"
            theme="chrome"
            name="code"
            width="100%"
            maxLines={500}
            fontSize={14}
            ref="ace"
            value={tool.code}
            onChange={this.props.editorChange}
            onFocus={this.clearHistory}
          /> :
          <AceEditor
            key={tool.id}
            mode="sh"
            theme="chrome"
            name="codeparsed"
            width="100%"
            maxLines={500}
            fontSize={14}
            value={tool.parsedCommand}
            ref="aceparsed"
            onFocus={this.clearHistory}
          />
        }
        </div>
      </div>
    );
  }
});

module.exports = CodePanel;
