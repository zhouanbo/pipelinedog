var React = require('react');

var HeaderPanel = React.createClass({

  render: function() {
    return (
      <header className="toolbar">
        <div className="toolbar-actions">
          <div className="btn-group">
            <button className="btn btn-large btn-default" onClick={this.props.openProject}>
              <span className="icon icon-folder icon-text"></span>
              Open Project
            </button>
            <button className="btn btn-large btn-default" onClick={this.props.saveProject}>
              <span className="icon icon-floppy icon-text"></span>
              Save Project
            </button>
            <button className="btn btn-large btn-default" onClick={this.props.importFile}>
              <span className="icon icon-doc-text icon-text"></span>
              Import File
            </button>
          </div>
          <button className="btn btn-large btn-default pull-right" onClick={this.props.runCode}>
            <span className="icon icon-play icon-text"></span>
            Run
          </button>
          <button className="btn btn-large btn-default pull-right" onClick={this.props.exportCode}>
            <span className="icon icon-export icon-text"></span>
            Export
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
