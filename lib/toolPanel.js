var React = require('react');

var ToolPanel = React.createClass({
  displayName: "ToolPanel",


  render: function () {
    return React.createElement(
      "div",
      { className: "pane-sm sidebar" },
      React.createElement(
        "ul",
        { className: "list-group" },
        React.createElement(
          "li",
          { className: "list-group-header" },
          React.createElement(
            "strong",
            null,
            "Tools"
          )
        ),
        this.props.tools.map(function (level, levelindex) {
          return level.map(function (tool, index) {
            return React.createElement(
              "li",
              { key: tool.id, className: "list-group-item" + (this.props.currentTool == tool.id ? " active" : ""), onClick: this.props.toolClick.bind(null, tool.id) },
              React.createElement(
                "div",
                { name: tool.id, className: "media-body" },
                React.createElement(
                  "strong",
                  { name: tool.id },
                  tool.name
                ),
                React.createElement(
                  "p",
                  { name: tool.id },
                  tool.description
                )
              )
            );
          }, this);
        }, this)
      )
    );
  }
});

module.exports = ToolPanel;