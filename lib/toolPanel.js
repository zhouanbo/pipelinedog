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
        React.createElement(
          "li",
          { className: "list-group-item" },
          React.createElement(
            "div",
            { className: "media-body" },
            React.createElement(
              "strong",
              null,
              "samtools index"
            ),
            React.createElement(
              "p",
              null,
              "Index SAM/BAM files."
            )
          )
        ),
        React.createElement(
          "li",
          { className: "list-group-item" },
          React.createElement(
            "div",
            { className: "media-body" },
            React.createElement(
              "strong",
              null,
              "samtools mdup"
            ),
            React.createElement(
              "p",
              null,
              "Remove PCR duplicates in SAM/BAM files."
            )
          )
        )
      )
    );
  }
});

module.exports = ToolPanel;