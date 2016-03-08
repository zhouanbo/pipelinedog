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
            { key: index, className: "list-group-item" },
            React.createElement(
              "div",
              { className: "media-body" },
              React.createElement(
                "strong",
                null,
                tool.name
              ),
              React.createElement(
                "p",
                null,
                tool.description
              )
            )
          );
        })
      )
    );
  }
});

module.exports = ToolPanel;