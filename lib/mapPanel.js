var React = require('react');

var MapPanel = React.createClass({
  displayName: "MapPanel",


  render: function () {

    return React.createElement(
      "div",
      { className: "pane mappanel" },
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
      this.props.tools.map(function (level, levelindex) {
        return React.createElement(
          "div",
          { key: levelindex, className: "maplevel", name: levelindex },
          level.map(function (tool, index) {
            return React.createElement(
              "div",
              { key: index, className: "mapnode" },
              tool.name
            );
          }, this),
          React.createElement(
            "div",
            { className: "btn-group" },
            React.createElement(
              "button",
              { className: "btn btn-small btn-default bottomplus", name: "bottomplus", tabIndex: levelindex, onClick: this.props.addTool },
              React.createElement("span", { name: "bottomplus", tabIndex: levelindex, className: "icon icon-down" })
            ),
            React.createElement(
              "button",
              { className: "btn btn-small btn-default rightplus", name: "rightplus", tabIndex: levelindex, onClick: this.props.addTool },
              React.createElement("span", { name: "rightplus", tabIndex: levelindex, className: "icon icon-right" })
            )
          )
        );
      }, this)
    );
  }

});

module.exports = MapPanel;