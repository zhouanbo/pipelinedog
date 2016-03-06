var React = require('react');

var FilePanel = React.createClass({
  displayName: "FilePanel",

  render: function () {
    return React.createElement(
      "div",
      { className: "pane-sm sidebar pull-right" },
      React.createElement(
        "ul",
        { className: "list-group" },
        React.createElement(
          "li",
          { className: "list-group-header" },
          React.createElement(
            "strong",
            null,
            "Files"
          )
        )
      ),
      React.createElement(
        "table",
        { className: "table-striped" },
        React.createElement(
          "thead",
          null,
          React.createElement(
            "tr",
            null,
            React.createElement(
              "th",
              null,
              "Name"
            ),
            React.createElement(
              "th",
              null,
              "Type"
            )
          )
        ),
        React.createElement(
          "tbody",
          null,
          React.createElement(
            "tr",
            null,
            React.createElement(
              "td",
              null,
              "photon.css"
            ),
            React.createElement(
              "td",
              null,
              "File"
            )
          ),
          React.createElement(
            "tr",
            null,
            React.createElement(
              "td",
              null,
              "photon.css"
            ),
            React.createElement(
              "td",
              null,
              "File"
            )
          ),
          React.createElement(
            "tr",
            null,
            React.createElement(
              "td",
              null,
              "photon.css"
            ),
            React.createElement(
              "td",
              null,
              "File"
            )
          ),
          React.createElement(
            "tr",
            null,
            React.createElement(
              "td",
              null,
              "photooooooooo.css"
            ),
            React.createElement(
              "td",
              null,
              "FileList"
            )
          )
        )
      )
    );
  }
});

module.exports = FilePanel;