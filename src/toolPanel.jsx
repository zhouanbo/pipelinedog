var React = require('react');

var ToolPanel = React.createClass({
  render: function() {
    return (
      <div className="pane-sm sidebar">
        <ul className="list-group">
          <li className="list-group-header">
            <strong>Pipelines</strong>
          </li>
          {this.props.tools.map(function(tool, index) {
            return (
              <li key={index} className="list-group-item">
                <div className="media-body">
                  <strong>{tool.name}</strong>
                  <p>{tool.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
});

module.exports = ToolPanel;
