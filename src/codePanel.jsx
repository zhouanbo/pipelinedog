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

  filterByProperty: function(array, prop, value) {
    var filtered = [];
    for(var i = 0; i < array.length; i++){
      var obj = array[i];
      for(var key in obj){
        if(typeof(obj[key] == "object")){
          var item = obj[key];
          if(item[prop] == value){
            filtered.push(item);
          }
        }
      }
    }
    return filtered;
  },

  refreshEditor: function() {
    this.focusEditor();
    this.refs.ace.editor.getSession().setUseWrapMode(true);
    var tool = this.filterByProperty(this.props.tools, "id", this.props.currentTool);
    this.refs.ace.editor.setValue(tool[0].code, 1);
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
    var tool = this.filterByProperty(this.props.tools, "id", this.props.currentTool);

    return (
      <div className="pane">
        <div className="formpane">
          <ul className="list-group">
            <li className="list-group-header">
              <strong>Profile</strong>
            </li>
          </ul>
          <div className="form-group">
            <span>Name: </span>
            <div className="nameinput">
              <input type="text" name="name" className="form-control" placeholder="Name" defaultValue={tool[0].name}/>
            </div>
            <span className="splitter">splitter</span>
            <span>Description: </span>
            <div className="descriptioninput">
              <input type="text" name="description" className="form-control" placeholder="Description" defaultValue={tool[0].description}/>
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
            <span><input type="checkbox" /></span>
            <span>for</span>
            <div>
              <input type="text" name="loop" className="form-control" placeholder="Loop" />
            </div>
            <span>do...</span>
            <span className="splitter">splitter</span>
            <span><input type="checkbox" /></span>
            <span>if</span>
            <div>
              <input type="text" name="condition" className="form-control" placeholder="Condition" />
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
            editorProps={{$blockScrolling: Infinity}}
          />
        </div>
      </div>
    );
  }
});

module.exports = CodePanel;
