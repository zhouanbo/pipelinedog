var React = require('react');

var MapPanel = React.createClass({
  displayName: "MapPanel",

  render: function () {
    return React.createElement(
      "div",
      { className: "pane" },
      React.createElement(
        "ul",
        { className: "list-group" },
        React.createElement(
          "li",
          { className: "list-group-header" },
          React.createElement(
            "strong",
            null,
            "Map"
          )
        )
      ),
      React.createElement(
        "div",
        null,
        "aaa"
      )
    );
  }
});

module.exports = MapPanel;