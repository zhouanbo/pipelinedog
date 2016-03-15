var React = require('react');

var ToolPanel = React.createClass({

  render: function() {
    return (
      <div className="pane-sm sidebar">
        <ul className="list-group">
          <li className="list-group-header">
            <strong>Tools</strong>
          </li>
          {this.props.tools.map(function(level, levelindex) {
            return level.map(function(tool, index) {
              return (
                <li key={tool.id} name={tool.id} className={"list-group-item"+(this.props.currentTool == tool.id ? " active" : "")} onClick={this.props.toolClick} >
                  <div name={tool.id} className="media-body">
                    <strong name={tool.id}>{tool.name}</strong>
                    <p name={tool.id}>{tool.description}</p>
                  </div>
                </li>
              );
            }, this);
          }, this)}
        </ul>
      </div>
    );
  }
});

module.exports = ToolPanel;
