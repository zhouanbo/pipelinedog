"use strict";

var React = require('react');

var HeaderPanel = React.createClass({
  displayName: "HeaderPanel",


  render: function render() {
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
            { className: "btn btn-large btn-default", onClick: this.props.newProject },
            React.createElement("span", { className: "icon icon-plus icon-text" }),
            "New"
          ),
          React.createElement(
            "button",
            { className: "btn btn-large btn-default", onClick: this.props.openProject },
            React.createElement("span", { className: "icon icon-folder icon-text" }),
            "Open"
          ),
          React.createElement(
            "button",
            { className: "btn btn-large btn-default", onClick: this.props.saveProject },
            React.createElement("span", { className: "icon icon-floppy icon-text" }),
            "Save"
          ),
          React.createElement(
            "button",
            { className: "btn btn-large btn-default", onClick: this.props.saveAsProject },
            React.createElement("span", { className: "icon icon-forward icon-text" }),
            "Save As..."
          )
        ),
        React.createElement(
          "button",
          { className: "btn btn-large btn-default", onClick: this.props.importFile },
          React.createElement("span", { className: "icon icon-doc-text icon-text" }),
          "Import File"
        ),
        React.createElement(
          "button",
          { className: "btn btn-large btn-default pull-right", onClick: this.props.runCode },
          React.createElement("span", { className: "icon icon-play icon-text" }),
          "Run"
        ),
        React.createElement(
          "button",
          { className: "btn btn-large btn-default pull-right", onClick: this.props.exportCode },
          React.createElement("span", { className: "icon icon-export icon-text" }),
          "Export"
        ),
        React.createElement(
          "button",
          { className: "btn btn-large btn-default pull-right", onClick: this.props.parseAll },
          React.createElement("span", { className: "icon icon-code icon-text" }),
          "Parse All"
        ),
        React.createElement(
          "button",
          { className: "btn btn-large btn-default pull-right", onClick: this.props.mapCode },
          React.createElement("span", { className: "icon icon-arrows-ccw icon-text" }),
          "Map / Tool"
        )
      )
    );
  }
});

module.exports = HeaderPanel;