var React = require('react');

var HeaderPanel = React.createClass({

  render: function() {
    return (
      <header className="toolbar">
        <div className="toolbar-actions">
          <div className="btn-group">
            <button className="btn btn-large btn-default" onClick={this.props.newProject}>
              <span className="icon icon-plus icon-text"></span>
              New
            </button>
            <button className="btn btn-large btn-default" onClick={this.props.openProject}>
              <span className="icon icon-folder icon-text"></span>
              Open
            </button>
            <button className="btn btn-large btn-default" onClick={this.props.saveProject}>
              <span className="icon icon-floppy icon-text"></span>
              Save
            </button>
            <button className="btn btn-large btn-default" onClick={this.props.saveAsProject}>
              <span className="icon icon-forward icon-text"></span>
              Save As...
            </button>
            
          </div>
          
          <button className="btn btn-large btn-default" onClick={this.props.importFile}>
            <span className="icon icon-doc-text icon-text"></span>
            Import File
          </button>
          <button className="btn btn-large btn-default pull-right" onClick={this.props.runCode}>
            <span className="icon icon-play icon-text"></span>
            Run
          </button>
          <button className="btn btn-large btn-default pull-right" onClick={this.props.exportCode}>
            <span className="icon icon-publish icon-text"></span>
            Export Code
          </button>
          <button className="btn btn-large btn-default pull-right" onClick={this.props.exportProject}>
            <span className="icon icon-export icon-text"></span>
            Export Project
          </button>
          <button className="btn btn-large btn-default pull-right" onClick={this.props.parseAll}>
            <span className="icon icon-code icon-text"></span>
            Parse All
          </button>
          <button className="btn btn-large btn-default pull-right" onClick={this.props.mapCode}>
            <span className="icon icon-arrows-ccw icon-text"></span>
            Map / Tool
          </button>
        </div>
      </header>
    );
  }
});

module.exports = HeaderPanel;
