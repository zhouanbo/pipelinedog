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
            "Pipelines"
          )
        ),
        this.props.tools.map(function (tool, index) {
          return React.createElement(
            "li",
            { key: index, name: index, className: "list-group-item" + (this.props.currentTool == index ? " active" : ""), onClick: this.props.toolClick },
            React.createElement(
              "div",
              { name: index, className: "media-body" },
              React.createElement(
                "strong",
                { name: index },
                tool.name
              ),
              React.createElement(
                "p",
                { name: index },
                tool.description
              )
            )
          );
        }, this)
      )
    );
  }
});

module.exports = ToolPanel;