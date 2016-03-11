var React = require('react');
var $ = require('jquery');

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
              <li key={index} name={index} className={"list-group-item"+(this.props.currentTool == index ? " active" : "")} onClick={this.props.toolClick} >
                <div name={index} className="media-body">
                  <strong name={index} >{tool.name}</strong>
                  <p name={index} >{tool.description}</p>
                </div>
              </li>
            );
          }, this)}
        </ul>
      </div>
    );
  }
});

module.exports = ToolPanel;
