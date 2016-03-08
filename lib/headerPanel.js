var React = require('react');

var HeaderPanel = React.createClass({
  displayName: "HeaderPanel",

  render: function () {
    return React.createElement(
      "header",
      { className: "toolbar" },
      React.createElement(
        "div",
        { className: "toolbar-actions" },
        React.createElement(
          "div",
          { className: "btn-group" },
          React.createElement(
            "button",
            { className: "btn btn-large btn-default" },
            React.createElement("span", { className: "icon icon-folder icon-text" }),
            "Open Project"
          ),
          React.createElement(
            "button",
            { className: "btn btn-large btn-default" },
            React.createElement("span", { className: "icon icon-floppy icon-text" }),
            "Save Project"
          ),
          React.createElement(
            "button",
            { className: "btn btn-large btn-default" },
            React.createElement("span", { className: "icon icon-doc-text icon-text" }),
            "Import File"
          )
        ),
        React.createElement(
          "button",
          { className: "btn btn-large btn-default pull-right" },
          React.createElement("span", { className: "icon icon-play icon-text" }),
          "Run"
        ),
        React.createElement(
          "button",
          { className: "btn btn-large btn-default pull-right" },
          React.createElement("span", { className: "icon icon-export icon-text" }),
          "Export"
        ),
        React.createElement(
          "button",
          { className: "btn btn-large btn-default pull-right" },
          React.createElement("span", { className: "icon icon-plus icon-text" }),
          "Add Tool"
        )
      )
    );
  }
});

module.exports = HeaderPanel;